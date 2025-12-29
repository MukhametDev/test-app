# Решение задания: Паттерн Фасад

⚠️ **ВНИМАНИЕ:** Это файл с решением! Попробуйте сначала выполнить задание самостоятельно.

Откройте этот файл только если:
- Застряли и не можете продолжить
- Хотите сравнить свое решение с эталонным
- Уже выполнили задание

---

## Решение метода `placeOrder()`

```php
public function placeOrder(int $userId, array $items, array $address, array $paymentData): array
{
    // Генерируем ID заказа
    $orderId = rand(10000, 99999);

    // Переменные для отката операций
    $reservedItems = [];
    $transactionId = null;
    $shipmentId = null;

    try {
        // 1. Логируем начало создания заказа
        $this->logger->logOrderCreated($orderId);

        // 2. Проверяем наличие всех товаров на складе
        $this->logger->logOperation($orderId, 'Checking inventory availability');
        foreach ($items as $item) {
            if (!$this->inventoryService->checkAvailability($item['product_id'], $item['quantity'])) {
                throw new \Exception("Product {$item['product_id']} is out of stock");
            }
        }

        // 3. Рассчитываем общую стоимость товаров и вес
        $totalItemsPrice = 0;
        $totalWeight = 0;
        foreach ($items as $item) {
            $totalItemsPrice += $item['price'] * $item['quantity'];
            $totalWeight += $item['weight'] * $item['quantity'];
        }

        // 4. Рассчитываем стоимость доставки
        $this->logger->logOperation($orderId, 'Calculating shipping cost');
        $shippingCost = $this->shippingService->calculateShipping($address, $totalWeight);

        // 5. Рассчитываем общую сумму
        $totalAmount = $totalItemsPrice + $shippingCost;

        // 6. Резервируем товары
        $this->logger->logOperation($orderId, 'Reserving items');
        foreach ($items as $item) {
            $this->inventoryService->reserve($item['product_id'], $item['quantity']);
            $reservedItems[] = $item; // Сохраняем для возможного отката
        }

        // 7. Проводим оплату
        $this->logger->logOperation($orderId, 'Processing payment');
        $transactionId = $this->paymentService->charge($totalAmount, $paymentData);

        // 8. Создаем отправление
        $this->logger->logOperation($orderId, 'Creating shipment');
        $shipmentId = $this->shippingService->createShipment($orderId, $address);

        // 9. Получаем трек-номер
        $trackingNumber = $this->shippingService->getTrackingNumber($shipmentId);

        // 10. Отправляем уведомление пользователю
        $this->logger->logOperation($orderId, 'Sending confirmation');
        $this->notificationService->sendOrderConfirmation($userId, [
            'order_id' => $orderId,
            'total' => $totalAmount,
            'tracking_number' => $trackingNumber
        ]);

        // 11. Отправляем информацию о доставке
        $this->notificationService->sendShippingUpdate($userId, $trackingNumber);

        // 12. Логируем успешное завершение
        $this->logger->logOrderCompleted($orderId);

        // Возвращаем данные заказа
        return [
            'order_id' => $orderId,
            'user_id' => $userId,
            'total' => $totalAmount,
            'shipping_cost' => $shippingCost,
            'transaction_id' => $transactionId,
            'shipment_id' => $shipmentId,
            'tracking_number' => $trackingNumber,
            'status' => 'completed'
        ];

    } catch (\Exception $e) {
        // ОТКАТ ОПЕРАЦИЙ ПРИ ОШИБКЕ

        // Отменяем доставку, если была создана
        if ($shipmentId) {
            try {
                $this->shippingService->cancelShipment($shipmentId);
            } catch (\Exception $ex) {
                // Логируем, но продолжаем откат
                $this->logger->logOperation($orderId, 'Failed to cancel shipment: ' . $ex->getMessage());
            }
        }

        // Возвращаем деньги, если была оплата
        if ($transactionId) {
            try {
                $this->paymentService->refund($transactionId, $totalAmount ?? 0);
            } catch (\Exception $ex) {
                $this->logger->logOperation($orderId, 'Failed to refund payment: ' . $ex->getMessage());
            }
        }

        // Освобождаем зарезервированные товары
        foreach ($reservedItems as $item) {
            try {
                $this->inventoryService->release($item['product_id'], $item['quantity']);
            } catch (\Exception $ex) {
                $this->logger->logOperation($orderId, 'Failed to release item: ' . $ex->getMessage());
            }
        }

        // Логируем ошибку
        $this->logger->logOrderFailed($orderId, $e->getMessage());

        // Пробрасываем исключение дальше
        throw new \Exception("Order placement failed: " . $e->getMessage());
    }
}
```

## Решение метода `cancelOrder()`

```php
public function cancelOrder(int $orderId, int $userId, array $orderData): bool
{
    $errors = [];

    // 1. Логируем начало отмены
    $this->logger->logOperation($orderId, 'Starting order cancellation');

    // 2. Освобождаем зарезервированные товары
    if (isset($orderData['items'])) {
        foreach ($orderData['items'] as $item) {
            try {
                $this->inventoryService->release($item['product_id'], $item['quantity']);
            } catch (\Exception $e) {
                $errors[] = "Failed to release product {$item['product_id']}: " . $e->getMessage();
            }
        }
    }

    // 3. Возвращаем деньги
    if (isset($orderData['transaction_id'])) {
        try {
            // Предполагаем, что сумма хранится в orderData или передается отдельно
            $amount = $orderData['total'] ?? 0;
            $this->paymentService->refund($orderData['transaction_id'], $amount);
        } catch (\Exception $e) {
            $errors[] = "Failed to refund payment: " . $e->getMessage();
        }
    }

    // 4. Отменяем доставку
    if (isset($orderData['shipment_id'])) {
        try {
            $this->shippingService->cancelShipment($orderData['shipment_id']);
        } catch (\Exception $e) {
            $errors[] = "Failed to cancel shipment: " . $e->getMessage();
        }
    }

    // 5. Отправляем уведомление об отмене
    try {
        $this->notificationService->sendOrderCancellation($userId, $orderId);
    } catch (\Exception $e) {
        $errors[] = "Failed to send cancellation notification: " . $e->getMessage();
    }

    // 6. Логируем отмену
    $this->logger->logOrderCancelled($orderId);

    // Если были ошибки, выбрасываем исключение, но заказ всё равно считается отменённым
    if (!empty($errors)) {
        $this->logger->logOperation($orderId, 'Cancellation completed with errors: ' . implode('; ', $errors));
        throw new \Exception("Order cancellation completed with errors: " . implode("; ", $errors));
    }

    return true;
}
```

## Бонусное решение: `getOrderStatus()`

```php
public function getOrderStatus(int $orderId, array $orderData): array
{
    try {
        $trackingNumber = 'N/A';

        // Получаем трек-номер если есть shipment_id
        if (isset($orderData['shipment_id'])) {
            $trackingNumber = $this->shippingService->getTrackingNumber($orderData['shipment_id']);
        }

        return [
            'order_id' => $orderId,
            'status' => $orderData['status'] ?? 'unknown',
            'tracking_number' => $trackingNumber,
            'total' => $orderData['total'] ?? 0,
            'message' => 'Order status retrieved successfully'
        ];

    } catch (\Exception $e) {
        return [
            'order_id' => $orderId,
            'status' => 'error',
            'message' => 'Failed to get order status: ' . $e->getMessage()
        ];
    }
}
```

## Ключевые моменты решения

### 1. Переменные для отката
```php
$reservedItems = [];  // Какие товары зарезервировали
$transactionId = null; // ID платежа для возврата
$shipmentId = null;    // ID отправления для отмены
```

### 2. Try-Catch структура
```php
try {
    // Основная логика с сохранением данных для отката
} catch (\Exception $e) {
    // Откат всех операций в обратном порядке
    // Логирование ошибки
    // Пробрасывание исключения
}
```

### 3. Откат в обратном порядке
- Сначала отменяем последнюю операцию (доставка)
- Потом возвращаем деньги
- В конце освобождаем резервы

### 4. Обработка ошибок при откате
```php
try {
    $this->shippingService->cancelShipment($shipmentId);
} catch (\Exception $ex) {
    // Логируем, но не прерываем откат!
    $this->logger->logOperation($orderId, 'Failed to cancel: ' . $ex->getMessage());
}
```

### 5. Сбор ошибок при отмене
```php
$errors = [];
try { /* ... */ } catch (\Exception $e) {
    $errors[] = $e->getMessage();
}
// Продолжаем даже если была ошибка!
```

## Проверка решения

После реализации протестируйте:

```bash
# Запустите сервер
php artisan serve

# В другом терминале:

# Тест 1: Успешный заказ
curl http://localhost:8000/api/test-order/success

# Тест 2: Товар отсутствует
curl http://localhost:8000/api/test-order/out-of-stock

# Тест 3: Ошибка оплаты
curl http://localhost:8000/api/test-order/payment-failed

# Тест 4: Отмена заказа
curl http://localhost:8000/api/test-order/cancel
```

## Что должно произойти

### Тест 1 (success):
✅ Все операции выполнены успешно
✅ Возвращен JSON с данными заказа

### Тест 2 (out-of-stock):
❌ Ошибка "Product 99 is out of stock"
✅ Никакие операции не должны были выполниться (проверка в начале)

### Тест 3 (payment-failed):
❌ Ошибка "Превышен лимит оплаты"
✅ Резерв товаров должен быть освобожден (видно в логах)

### Тест 4 (cancel):
✅ Все операции отмены выполнены
✅ Возвращен success: true

## Преимущества паттерна Фасад (видны в решении)

1. **Простота использования**: Клиент вызывает один метод вместо работы с 5 сервисами
2. **Инкапсуляция**: Вся сложность спрятана внутри фасада
3. **Управление транзакциями**: Фасад координирует работу сервисов и откатывает при ошибках
4. **Единая точка входа**: Легко добавить логирование, валидацию, кеширование

Отличная работа! 🎉

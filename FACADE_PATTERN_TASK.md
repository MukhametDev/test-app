# Задание: Паттерн Фасад (Facade Pattern)

## 📚 Что такое паттерн Фасад?

**Фасад** - это структурный паттерн проектирования, который предоставляет простой интерфейс к сложной системе классов, библиотеке или фреймворку.

### Проблема
Представьте, что вам нужно оформить заказ в интернет-магазине. Для этого необходимо:
- Проверить наличие товаров на складе
- Рассчитать доставку
- Провести оплату
- Создать отправление
- Отправить уведомления
- Залогировать все операции

Клиент не должен знать обо всех этих деталях!

### Решение
Создаем **Фасад** - простой интерфейс, который скрывает всю сложность:

```php
// Без фасада (клиент работает с множеством классов):
$inventory = new InventoryService();
$payment = new PaymentService();
$shipping = new ShippingService();
// ... и т.д.

if ($inventory->checkAvailability(...)) {
    $inventory->reserve(...);
    if ($payment->charge(...)) {
        $shipping->createShipment(...);
        // ... еще 10 строк кода
    }
}

// С фасадом (клиент работает с одним методом):
$orderFacade->placeOrder($userId, $items, $address, $paymentData);
```

## 🎯 Ваша задача

Реализовать методы `placeOrder()` и `cancelOrder()` в классе **OrderFacade**.

### Структура проекта

```
app/
├── Services/                    # Подсистемы (уже готовы)
│   ├── InventoryService.php     # Управление складом
│   ├── PaymentService.php       # Обработка платежей
│   ├── ShippingService.php      # Доставка
│   ├── NotificationService.php  # Уведомления
│   └── OrderLogger.php          # Логирование
│
├── Facades/
│   └── OrderFacade.php          # 👉 ЗДЕСЬ ВАША ЗАДАЧА
│
└── Http/Controllers/
    └── OrderController.php      # Контроллер для тестирования
```

## 📝 Задание 1: Метод `placeOrder()`

Реализуйте размещение заказа со следующими шагами:

### Алгоритм:

1. **Логирование начала** - используйте `$this->logger->logOrderCreated($orderId)`
2. **Проверка наличия товаров** - для каждого товара проверьте `$this->inventoryService->checkAvailability()`
3. **Расчет веса** - суммируйте вес всех товаров
4. **Расчет доставки** - `$this->shippingService->calculateShipping()`
5. **Расчет итоговой суммы** - товары + доставка
6. **Резервирование** - для каждого товара `$this->inventoryService->reserve()`
7. **Оплата** - `$this->paymentService->charge()` (сохраните transaction_id!)
8. **Создание отправления** - `$this->shippingService->createShipment()` (сохраните shipment_id!)
9. **Получение трек-номера** - `$this->shippingService->getTrackingNumber()`
10. **Уведомление** - `$this->notificationService->sendOrderConfirmation()`
11. **Логирование успеха** - `$this->logger->logOrderCompleted()`

### ⚠️ Обработка ошибок (очень важно!)

Используйте `try-catch` и откатывайте изменения при ошибках:

```php
$reservedItems = [];
$transactionId = null;
$shipmentId = null;

try {
    // Шаг 1: резервирование
    foreach ($items as $item) {
        $this->inventoryService->reserve(...);
        $reservedItems[] = $item; // Сохраняем для отката
    }

    // Шаг 2: оплата
    $transactionId = $this->paymentService->charge(...);

    // Шаг 3: доставка
    $shipmentId = $this->shippingService->createShipment(...);

} catch (\Exception $e) {
    // ОТКАТ!

    // Если была доставка - отменить
    if ($shipmentId) {
        $this->shippingService->cancelShipment($shipmentId);
    }

    // Если была оплата - вернуть деньги
    if ($transactionId) {
        $this->paymentService->refund($transactionId, $totalAmount);
    }

    // Освободить резервы
    foreach ($reservedItems as $item) {
        $this->inventoryService->release(...);
    }

    // Залогировать ошибку
    $this->logger->logOrderFailed($orderId, $e->getMessage());

    // Пробросить исключение дальше
    throw $e;
}
```

### Что должен вернуть метод:

```php
return [
    'order_id' => $orderId,              // Сгенерируйте: rand(10000, 99999)
    'user_id' => $userId,
    'total' => $totalAmount,             // Товары + доставка
    'shipping_cost' => $shippingCost,
    'transaction_id' => $transactionId,
    'tracking_number' => $trackingNumber,
    'status' => 'completed'
];
```

## 📝 Задание 2: Метод `cancelOrder()`

Реализуйте отмену заказа:

### Алгоритм:

1. **Логирование** - `$this->logger->logOperation($orderId, 'Cancellation started')`
2. **Освобождение товаров** - для каждого товара из `$orderData['items']`
3. **Возврат денег** - используйте `$orderData['transaction_id']`
4. **Отмена доставки** - используйте `$orderData['shipment_id']`
5. **Уведомление** - `$this->notificationService->sendOrderCancellation()`
6. **Логирование** - `$this->logger->logOrderCancelled()`

### ⚠️ Обработка ошибок

Даже если один шаг не удался, продолжайте остальные:

```php
$errors = [];

// Шаг 1
try {
    $this->inventoryService->release(...);
} catch (\Exception $e) {
    $errors[] = "Inventory release failed: " . $e->getMessage();
}

// Шаг 2
try {
    $this->paymentService->refund(...);
} catch (\Exception $e) {
    $errors[] = "Payment refund failed: " . $e->getMessage();
}

// И так далее...

// В конце
if (!empty($errors)) {
    throw new \Exception("Cancellation completed with errors: " . implode("; ", $errors));
}

return true;
```

## 🧪 Как тестировать

### 1. Запустите Laravel сервер

```bash
cd /home/mukhamet/laravel-test/laravel-test-app
php artisan serve
```

### 2. Тестовые эндпоинты

#### Успешный заказ:
```bash
curl http://localhost:8000/api/test-order/success
```

Должно пройти успешно (товары есть, карта валидна, сумма в пределах лимита)

#### Товар отсутствует (проверка отката):
```bash
curl http://localhost:8000/api/test-order/out-of-stock
```

Должна быть ошибка + откат (товар с ID < 100 недоступен)

#### Ошибка оплаты (проверка отката резерва):
```bash
curl http://localhost:8000/api/test-order/payment-failed
```

Должна быть ошибка + освобождение резерва (сумма > 100000 не проходит)

#### Отмена заказа:
```bash
curl http://localhost:8000/api/test-order/cancel
```

Должна пройти успешная отмена

## 💡 Подсказки

### Как рассчитать общую стоимость товаров:
```php
$totalItemsPrice = 0;
foreach ($items as $item) {
    $totalItemsPrice += $item['price'] * $item['quantity'];
}
```

### Как рассчитать общий вес:
```php
$totalWeight = 0;
foreach ($items as $item) {
    $totalWeight += $item['weight'] * $item['quantity'];
}
```

### Генерация Order ID:
```php
$orderId = rand(10000, 99999);
```

## 🎓 Что вы изучите

После выполнения этого задания вы поймёте:

1. **Как упростить сложный интерфейс** - OrderFacade скрывает 5 подсистем
2. **Как обрабатывать транзакции** - откат при ошибках
3. **Принцип единственной ответственности** - каждый сервис делает одно дело
4. **Инкапсуляцию сложности** - клиент не знает о деталях реализации

## 🚀 Бонусное задание (по желанию)

Реализуйте метод `getOrderStatus()` который:
- Получает трек-номер через ShippingService
- Возвращает статус заказа

## 📂 Где найти файлы

- Задание: [app/Facades/OrderFacade.php](app/Facades/OrderFacade.php)
- Тесты: [app/Http/Controllers/OrderController.php](app/Http/Controllers/OrderController.php)
- Сервисы: [app/Services/](app/Services/)

## ✅ Критерии выполнения

Задание считается выполненным, если:

- ✅ Метод `placeOrder()` реализован и работает
- ✅ Метод `cancelOrder()` реализован и работает
- ✅ Обработка ошибок работает корректно (откат операций)
- ✅ Все 4 тестовых эндпоинта работают как ожидается
- ✅ Код читаемый и понятный

Удачи! 🎉

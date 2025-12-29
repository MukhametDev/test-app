<?php

namespace App\Facades;

use App\Services\InventoryService;
use App\Services\PaymentService;
use App\Services\ShippingService;
use App\Services\NotificationService;
use App\Services\OrderLogger;

/**
 * ФАСАД для управления заказами
 *
 * Этот класс предоставляет простой интерфейс для сложной системы обработки заказов.
 * Он скрывает сложность взаимодействия между различными подсистемами:
 * - Управление складом (InventoryService)
 * - Обработка платежей (PaymentService)
 * - Доставка (ShippingService)
 * - Уведомления (NotificationService)
 * - Логирование (OrderLogger)
 *
 * ЗАДАЧА: Реализуйте методы placeOrder() и cancelOrder()
 */
class OrderFacade
{
    private InventoryService $inventoryService;
    private PaymentService $paymentService;
    private ShippingService $shippingService;
    private NotificationService $notificationService;
    private OrderLogger $logger;

    public function __construct(
        InventoryService $inventoryService,
        PaymentService $paymentService,
        ShippingService $shippingService,
        NotificationService $notificationService,
        OrderLogger $logger
    ) {
        $this->inventoryService = $inventoryService;
        $this->paymentService = $paymentService;
        $this->shippingService = $shippingService;
        $this->notificationService = $notificationService;
        $this->logger = $logger;
    }

    /**
     * ЗАДАНИЕ 1: Реализуйте размещение заказа
     *
     * Метод должен выполнить следующие шаги:
     *
     * 1. Залогировать начало создания заказа
     * 2. Проверить наличие ВСЕХ товаров на складе
     * 3. Рассчитать общий вес товаров для доставки
     * 4. Рассчитать стоимость доставки
     * 5. Рассчитать общую сумму (товары + доставка)
     * 6. Зарезервировать товары
     * 7. Провести оплату (total amount)
     * 8. Создать отправление
     * 9. Получить трек-номер
     * 10. Отправить уведомление пользователю
     * 11. Залогировать успешное завершение
     *
     * ВАЖНО: Обработка ошибок!
     * - Если на любом шаге произошла ошибка, нужно откатить все изменения
     * - Если зарезервировали товар, но не прошла оплата - освободить резерв
     * - Если прошла оплата, но не создалось отправление - вернуть деньги и освободить резерв
     * - Залогировать ошибку
     * - Выбросить исключение с понятным сообщением
     *
     * @param int $userId ID пользователя
     * @param array $items Массив товаров: [['product_id' => int, 'quantity' => int, 'price' => float, 'weight' => float], ...]
     * @param array $address Адрес доставки: ['country' => string, 'city' => string, 'street' => string, 'zip' => string]
     * @param array $paymentData Данные для оплаты: ['card_number' => string, 'cvv' => string, 'expiry' => string]
     * @return array Данные созданного заказа
     * @throws \Exception
     */
    public function placeOrder(int $userId, array $items, array $address, array $paymentData): array
    {
        // TODO: Ваша реализация здесь

        // Подсказка: используйте try-catch для обработки ошибок
        // Подсказка: сохраняйте ID транзакции и резервов для возможности отката

        throw new \Exception("Метод placeOrder() не реализован. Это ваше задание!");

        // Метод должен вернуть массив вида:
        // return [
        //     'order_id' => $orderId,
        //     'user_id' => $userId,
        //     'total' => $totalAmount,
        //     'shipping_cost' => $shippingCost,
        //     'transaction_id' => $transactionId,
        //     'tracking_number' => $trackingNumber,
        //     'status' => 'completed'
        // ];
    }

    /**
     * ЗАДАНИЕ 2: Реализуйте отмену заказа
     *
     * Метод должен выполнить следующие шаги:
     *
     * 1. Залогировать начало отмены заказа
     * 2. Освободить зарезервированные товары
     * 3. Вернуть деньги (refund)
     * 4. Отменить доставку
     * 5. Отправить уведомление об отмене
     * 6. Залогировать отмену
     *
     * ВАЖНО:
     * - Даже если какой-то шаг не удался, продолжайте выполнять остальные
     * - Соберите все ошибки и залогируйте их
     * - В конце выбросьте исключение со всеми ошибками, если они были
     *
     * @param int $orderId ID заказа
     * @param int $userId ID пользователя
     * @param array $orderData Данные заказа (items, transaction_id, shipment_id и т.д.)
     * @return bool
     * @throws \Exception
     */
    public function cancelOrder(int $orderId, int $userId, array $orderData): bool
    {
        // TODO: Ваша реализация здесь

        // Подсказка: используйте массив для сбора ошибок
        // $errors = [];
        // try { ... } catch (\Exception $e) { $errors[] = $e->getMessage(); }

        throw new \Exception("Метод cancelOrder() не реализован. Это ваше задание!");

        // return true;
    }

    /**
     * БОНУСНОЕ ЗАДАНИЕ 3 (необязательно): Реализуйте получение статуса заказа
     *
     * Метод должен:
     * 1. Получить трек-номер доставки
     * 2. Вернуть информацию о заказе
     *
     * @param int $orderId ID заказа
     * @param array $orderData Данные заказа
     * @return array
     */
    public function getOrderStatus(int $orderId, array $orderData): array
    {
        // TODO: Ваша реализация (необязательно)

        return [
            'order_id' => $orderId,
            'status' => 'unknown',
            'message' => 'Метод не реализован'
        ];
    }
}

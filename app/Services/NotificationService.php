<?php

namespace App\Services;

/**
 * Сервис уведомлений
 * Отвечает за отправку уведомлений пользователям
 */
class NotificationService
{
    /**
     * Отправить подтверждение заказа
     *
     * @param int $userId ID пользователя
     * @param array $orderData Данные заказа
     * @return bool
     */
    public function sendOrderConfirmation(int $userId, array $orderData): bool
    {
        echo "📧 [Notification] Отправка подтверждения заказа пользователю #{$userId}\n";

        // Симуляция отправки email
        $orderId = $orderData['order_id'] ?? 'N/A';
        $total = $orderData['total'] ?? 0;

        echo "   ✉️  Кому: user_{$userId}@example.com\n";
        echo "   📋 Заказ: #{$orderId}\n";
        echo "   💵 Сумма: {$total} руб.\n";
        echo "✅ [Notification] Подтверждение отправлено\n";

        return true;
    }

    /**
     * Отправить обновление о доставке
     *
     * @param int $userId ID пользователя
     * @param string $trackingNumber Трек-номер
     * @return bool
     */
    public function sendShippingUpdate(int $userId, string $trackingNumber): bool
    {
        echo "📧 [Notification] Отправка информации о доставке пользователю #{$userId}\n";

        echo "   ✉️  Кому: user_{$userId}@example.com\n";
        echo "   📦 Трек-номер: {$trackingNumber}\n";
        echo "✅ [Notification] Уведомление о доставке отправлено\n";

        return true;
    }

    /**
     * Отправить уведомление об отмене заказа
     *
     * @param int $userId ID пользователя
     * @param int $orderId ID заказа
     * @return bool
     */
    public function sendOrderCancellation(int $userId, int $orderId): bool
    {
        echo "📧 [Notification] Отправка уведомления об отмене заказа #{$orderId} пользователю #{$userId}\n";

        echo "   ✉️  Кому: user_{$userId}@example.com\n";
        echo "   ❌ Заказ #{$orderId} отменен\n";
        echo "✅ [Notification] Уведомление об отмене отправлено\n";

        return true;
    }
}

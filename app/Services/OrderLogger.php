<?php

namespace App\Services;

/**
 * Сервис логирования заказов
 * Отвечает за запись логов всех операций с заказами
 */
class OrderLogger
{
    /**
     * Залогировать создание заказа
     *
     * @param int $orderId ID заказа
     * @return void
     */
    public function logOrderCreated(int $orderId): void
    {
        $timestamp = date('Y-m-d H:i:s');
        echo "📝 [Logger] [{$timestamp}] Создан заказ #{$orderId}\n";
    }

    /**
     * Залогировать ошибку при создании заказа
     *
     * @param int $orderId ID заказа
     * @param string $reason Причина ошибки
     * @return void
     */
    public function logOrderFailed(int $orderId, string $reason): void
    {
        $timestamp = date('Y-m-d H:i:s');
        echo "⚠️ [Logger] [{$timestamp}] ОШИБКА заказа #{$orderId}: {$reason}\n";
    }

    /**
     * Залогировать успешное завершение заказа
     *
     * @param int $orderId ID заказа
     * @return void
     */
    public function logOrderCompleted(int $orderId): void
    {
        $timestamp = date('Y-m-d H:i:s');
        echo "✅ [Logger] [{$timestamp}] Заказ #{$orderId} успешно завершен\n";
    }

    /**
     * Залогировать отмену заказа
     *
     * @param int $orderId ID заказа
     * @return void
     */
    public function logOrderCancelled(int $orderId): void
    {
        $timestamp = date('Y-m-d H:i:s');
        echo "❌ [Logger] [{$timestamp}] Заказ #{$orderId} отменен\n";
    }

    /**
     * Залогировать начало операции
     *
     * @param int $orderId ID заказа
     * @param string $operation Название операции
     * @return void
     */
    public function logOperation(int $orderId, string $operation): void
    {
        $timestamp = date('Y-m-d H:i:s');
        echo "🔄 [Logger] [{$timestamp}] Заказ #{$orderId}: {$operation}\n";
    }
}

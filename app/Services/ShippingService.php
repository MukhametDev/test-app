<?php

namespace App\Services;

/**
 * Сервис доставки
 * Отвечает за расчет стоимости и создание отправлений
 */
class ShippingService
{
    /**
     * Рассчитать стоимость доставки
     *
     * @param array $address Адрес доставки
     * @param float $weight Вес отправления (кг)
     * @return float Стоимость доставки
     */
    public function calculateShipping(array $address, float $weight): float
    {
        echo "📮 [Shipping] Расчет стоимости доставки (вес: {$weight} кг)\n";

        // Простая формула: базовая стоимость + вес
        $basePrice = 500;
        $pricePerKg = 100;
        $shippingCost = $basePrice + ($weight * $pricePerKg);

        // Для демонстрации: доставка в другие страны дороже
        if (isset($address['country']) && $address['country'] !== 'Russia') {
            $shippingCost *= 2;
            echo "🌍 [Shipping] Международная доставка\n";
        }

        echo "✅ [Shipping] Стоимость доставки: {$shippingCost} руб.\n";
        return $shippingCost;
    }

    /**
     * Создать отправление
     *
     * @param int $orderId ID заказа
     * @param array $address Адрес доставки
     * @return string ID отправления
     * @throws \Exception
     */
    public function createShipment(int $orderId, array $address): string
    {
        echo "📦 [Shipping] Создание отправления для заказа #{$orderId}\n";

        // Проверка адреса
        if (empty($address['city']) || empty($address['street'])) {
            throw new \Exception("Неполный адрес доставки");
        }

        $shipmentId = 'SHIP_' . uniqid();
        echo "✅ [Shipping] Отправление создано: {$shipmentId}\n";

        return $shipmentId;
    }

    /**
     * Получить трек-номер отправления
     *
     * @param string $shipmentId ID отправления
     * @return string Трек-номер
     */
    public function getTrackingNumber(string $shipmentId): string
    {
        echo "🔍 [Shipping] Получение трек-номера для {$shipmentId}\n";

        $trackingNumber = 'TRACK_' . strtoupper(substr(md5($shipmentId), 0, 10));
        echo "✅ [Shipping] Трек-номер: {$trackingNumber}\n";

        return $trackingNumber;
    }

    /**
     * Отменить отправление
     *
     * @param string $shipmentId ID отправления
     * @return bool
     */
    public function cancelShipment(string $shipmentId): bool
    {
        echo "❌ [Shipping] Отмена отправления {$shipmentId}\n";

        // Симуляция отмены
        echo "✅ [Shipping] Отправление отменено\n";
        return true;
    }
}

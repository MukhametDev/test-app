<?php

namespace App\Services;

/**
 * Сервис управления складом
 * Отвечает за проверку наличия товаров и резервирование
 */
class InventoryService
{
    /**
     * Проверить наличие товара на складе
     *
     * @param int $productId ID товара
     * @param int $quantity Требуемое количество
     * @return bool
     */
    public function checkAvailability(int $productId, int $quantity): bool
    {
        // Симуляция проверки наличия товара
        echo "📦 [Inventory] Проверка наличия товара #{$productId}, количество: {$quantity}\n";

        // Для демонстрации: считаем что товаров с ID < 100 нет в наличии
        if ($productId < 100) {
            echo "❌ [Inventory] Товар #{$productId} отсутствует на складе\n";
            return false;
        }

        echo "✅ [Inventory] Товар #{$productId} доступен\n";
        return true;
    }

    /**
     * Зарезервировать товар
     *
     * @param int $productId ID товара
     * @param int $quantity Количество для резервирования
     * @return bool
     * @throws \Exception
     */
    public function reserve(int $productId, int $quantity): bool
    {
        echo "🔒 [Inventory] Резервирование товара #{$productId}, количество: {$quantity}\n";

        // Симуляция резервирования
        if (!$this->checkAvailability($productId, $quantity)) {
            throw new \Exception("Невозможно зарезервировать товар #{$productId} - недостаточно на складе");
        }

        echo "✅ [Inventory] Товар #{$productId} зарезервирован\n";
        return true;
    }

    /**
     * Освободить резерв товара
     *
     * @param int $productId ID товара
     * @param int $quantity Количество для освобождения
     * @return bool
     */
    public function release(int $productId, int $quantity): bool
    {
        echo "🔓 [Inventory] Освобождение резерва товара #{$productId}, количество: {$quantity}\n";

        // Симуляция освобождения резерва
        echo "✅ [Inventory] Резерв товара #{$productId} освобожден\n";
        return true;
    }
}

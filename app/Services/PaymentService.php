<?php

namespace App\Services;

/**
 * Сервис обработки платежей
 * Отвечает за валидацию и проведение платежей
 */
class PaymentService
{
    /**
     * Валидация метода оплаты
     *
     * @param array $paymentData Данные платежа
     * @return bool
     */
    public function validatePaymentMethod(array $paymentData): bool
    {
        echo "💳 [Payment] Валидация метода оплаты\n";

        // Симуляция валидации
        if (empty($paymentData['card_number'])) {
            echo "❌ [Payment] Отсутствует номер карты\n";
            return false;
        }

        // Для демонстрации: карты начинающиеся с "0000" невалидны
        if (str_starts_with($paymentData['card_number'], '0000')) {
            echo "❌ [Payment] Невалидный номер карты\n";
            return false;
        }

        echo "✅ [Payment] Метод оплаты валиден\n";
        return true;
    }

    /**
     * Списать средства
     *
     * @param float $amount Сумма к списанию
     * @param array $paymentData Данные платежа
     * @return string ID транзакции
     * @throws \Exception
     */
    public function charge(float $amount, array $paymentData): string
    {
        echo "💰 [Payment] Попытка списания {$amount} руб.\n";

        if (!$this->validatePaymentMethod($paymentData)) {
            throw new \Exception("Невалидный метод оплаты");
        }

        // Для демонстрации: суммы больше 100000 не проходят
        if ($amount > 100000) {
            throw new \Exception("Превышен лимит оплаты");
        }

        $transactionId = 'TXN_' . uniqid();
        echo "✅ [Payment] Оплата успешна. ID транзакции: {$transactionId}\n";

        return $transactionId;
    }

    /**
     * Вернуть средства
     *
     * @param string $transactionId ID транзакции
     * @param float $amount Сумма возврата
     * @return bool
     */
    public function refund(string $transactionId, float $amount): bool
    {
        echo "↩️ [Payment] Возврат {$amount} руб. по транзакции {$transactionId}\n";

        // Симуляция возврата средств
        echo "✅ [Payment] Возврат выполнен успешно\n";
        return true;
    }
}

<?php

namespace App\Http\Controllers;

use App\Facades\OrderFacade;
use Illuminate\Http\Request;

/**
 * Контроллер для тестирования OrderFacade
 */
class OrderController extends Controller
{
    private OrderFacade $orderFacade;

    public function __construct(OrderFacade $orderFacade)
    {
        $this->orderFacade = $orderFacade;
    }

    /**
     * Тестовый эндпоинт для размещения заказа (успешный сценарий)
     *
     * GET /api/test-order/success
     */
    public function testSuccessOrder()
    {
        echo "🧪 ТЕСТ: Успешное размещение заказа\n";
        echo str_repeat("=", 80) . "\n\n";

        try {
            $userId = 1;
            $items = [
                [
                    'product_id' => 101,  // Товар доступен (ID >= 100)
                    'quantity' => 2,
                    'price' => 1500.00,
                    'weight' => 0.5
                ],
                [
                    'product_id' => 102,
                    'quantity' => 1,
                    'price' => 2500.00,
                    'weight' => 1.0
                ]
            ];
            $address = [
                'country' => 'Russia',
                'city' => 'Moscow',
                'street' => 'Tverskaya 1',
                'zip' => '123456'
            ];
            $paymentData = [
                'card_number' => '4111111111111111',
                'cvv' => '123',
                'expiry' => '12/25'
            ];

            $result = $this->orderFacade->placeOrder($userId, $items, $address, $paymentData);

            echo "\n" . str_repeat("=", 80) . "\n";
            echo "✅ РЕЗУЛЬТАТ: Заказ успешно размещен!\n";
            echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";

            return response()->json([
                'success' => true,
                'data' => $result
            ]);

        } catch (\Exception $e) {
            echo "\n" . str_repeat("=", 80) . "\n";
            echo "❌ ОШИБКА: " . $e->getMessage() . "\n";

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Тестовый эндпоинт для проверки отката при недоступности товара
     *
     * GET /api/test-order/out-of-stock
     */
    public function testOutOfStock()
    {
        echo "🧪 ТЕСТ: Заказ с недоступным товаром (проверка отката)\n";
        echo str_repeat("=", 80) . "\n\n";

        try {
            $userId = 2;
            $items = [
                [
                    'product_id' => 99,  // Товар НЕдоступен (ID < 100)
                    'quantity' => 1,
                    'price' => 5000.00,
                    'weight' => 2.0
                ]
            ];
            $address = [
                'country' => 'Russia',
                'city' => 'Saint Petersburg',
                'street' => 'Nevsky 10',
                'zip' => '654321'
            ];
            $paymentData = [
                'card_number' => '4111111111111111',
                'cvv' => '456',
                'expiry' => '12/26'
            ];

            $result = $this->orderFacade->placeOrder($userId, $items, $address, $paymentData);

            echo "\n" . str_repeat("=", 80) . "\n";
            echo "✅ РЕЗУЛЬТАТ (не должно было получиться):\n";
            echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";

            return response()->json([
                'success' => true,
                'data' => $result
            ]);

        } catch (\Exception $e) {
            echo "\n" . str_repeat("=", 80) . "\n";
            echo "✅ ОЖИДАЕМАЯ ОШИБКА: " . $e->getMessage() . "\n";
            echo "👍 Откат должен был выполниться корректно!\n";

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'expected' => true
            ], 400);
        }
    }

    /**
     * Тестовый эндпоинт для проверки отката при ошибке платежа
     *
     * GET /api/test-order/payment-failed
     */
    public function testPaymentFailed()
    {
        echo "🧪 ТЕСТ: Ошибка оплаты (проверка отката резерва)\n";
        echo str_repeat("=", 80) . "\n\n";

        try {
            $userId = 3;
            $items = [
                [
                    'product_id' => 103,  // Товар доступен
                    'quantity' => 1,
                    'price' => 150000.00, // Сумма > 100000 - платеж не пройдет
                    'weight' => 5.0
                ]
            ];
            $address = [
                'country' => 'Russia',
                'city' => 'Kazan',
                'street' => 'Baumana 5',
                'zip' => '789012'
            ];
            $paymentData = [
                'card_number' => '4111111111111111',
                'cvv' => '789',
                'expiry' => '12/27'
            ];

            $result = $this->orderFacade->placeOrder($userId, $items, $address, $paymentData);

            echo "\n" . str_repeat("=", 80) . "\n";
            echo "✅ РЕЗУЛЬТАТ (не должно было получиться):\n";
            echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";

            return response()->json([
                'success' => true,
                'data' => $result
            ]);

        } catch (\Exception $e) {
            echo "\n" . str_repeat("=", 80) . "\n";
            echo "✅ ОЖИДАЕМАЯ ОШИБКА: " . $e->getMessage() . "\n";
            echo "👍 Резерв товара должен был быть освобожден!\n";

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'expected' => true
            ], 400);
        }
    }

    /**
     * Тестовый эндпоинт для отмены заказа
     *
     * GET /api/test-order/cancel
     */
    public function testCancelOrder()
    {
        echo "🧪 ТЕСТ: Отмена заказа\n";
        echo str_repeat("=", 80) . "\n\n";

        try {
            $orderId = 12345;
            $userId = 1;
            $orderData = [
                'items' => [
                    ['product_id' => 101, 'quantity' => 2],
                    ['product_id' => 102, 'quantity' => 1]
                ],
                'transaction_id' => 'TXN_test123',
                'shipment_id' => 'SHIP_test456'
            ];

            $result = $this->orderFacade->cancelOrder($orderId, $userId, $orderData);

            echo "\n" . str_repeat("=", 80) . "\n";
            echo "✅ РЕЗУЛЬТАТ: Заказ успешно отменен!\n";

            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully'
            ]);

        } catch (\Exception $e) {
            echo "\n" . str_repeat("=", 80) . "\n";
            echo "❌ ОШИБКА: " . $e->getMessage() . "\n";

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 400);
        }
    }
}

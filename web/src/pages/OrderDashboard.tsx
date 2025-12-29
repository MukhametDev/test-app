import {
    Button,
    Card,
    Divider,
    Form,
    Input,
    List,
    Segmented,
    Select,
    Space,
    Statistic,
    Table,
    Tag,
    Typography,
} from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

const orderItems = [
    { key: "1", product: "Монитор 27''", qty: 2, price: "18 900 ₽" },
    { key: "2", product: "Клавиатура Pro", qty: 1, price: "9 400 ₽" },
    { key: "3", product: "USB-C хаб", qty: 3, price: "3 150 ₽" },
];

const logItems = [
    "InventoryService: резерв 3 товаров создан",
    "PaymentService: транзакция подтверждена",
    "ShippingService: рассчитана доставка",
    "NotificationService: письмо отправлено",
];

const notifications = [
    { title: "Заказ #1024 оформлен", status: "success" },
    { title: "Оплата по заказу #1023 в обработке", status: "processing" },
    { title: "Отгрузка #841 передана курьеру", status: "default" },
];

function OrderDashboard() {
    return (
        <div className="dashboard-grid">
            <Card className="panel" bordered={false}>
                <Typography.Title level={4}>Создание заказа</Typography.Title>
                <Form layout="vertical">
                    <Form.Item label="Покупатель">
                        <Input placeholder="Email или ID пользователя" />
                    </Form.Item>
                    <Form.Item label="Адрес доставки">
                        <Input placeholder="Город, улица, дом" />
                    </Form.Item>
                    <Form.Item label="Способ доставки">
                        <Select
                            defaultValue="courier"
                            options={[
                                { value: "courier", label: "Курьер" },
                                { value: "pickup", label: "Самовывоз" },
                                { value: "express", label: "Экспресс" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Платежная система">
                        <Segmented block options={["Card", "PayPal", "Invoice"]} />
                    </Form.Item>
                    <Button type="primary" size="large" block>
                        Отправить заказ в обработку
                    </Button>
                </Form>
            </Card>

            <Card className="panel" bordered={false}>
                <Typography.Title level={4}>Состав заказа</Typography.Title>
                <Table
                    size="small"
                    pagination={false}
                    dataSource={orderItems}
                    columns={[
                        { title: "Товар", dataIndex: "product" },
                        { title: "Кол-во", dataIndex: "qty" },
                        { title: "Цена", dataIndex: "price" },
                    ]}
                />
                <Divider />
                <Space size="large" className="summary-row">
                    <Statistic title="Товары" value="50 350 ₽" />
                    <Statistic title="Доставка" value="1 200 ₽" />
                    <Statistic title="Итого" value="51 550 ₽" />
                </Space>
            </Card>

            <Card className="panel" bordered={false}>
                <Typography.Title level={4}>Платежные системы</Typography.Title>
                <Space direction="vertical" size="middle" className="panel-stack">
                    <Card className="mini-card" bordered={false}>
                        <Space direction="vertical">
                            <Typography.Text strong>Card Gateway</Typography.Text>
                            <Typography.Text type="secondary">
                                Среднее время: 1.2с
                            </Typography.Text>
                            <Tag color="green">99.2% success</Tag>
                        </Space>
                    </Card>
                    <Card className="mini-card" bordered={false}>
                        <Space direction="vertical">
                            <Typography.Text strong>PayPal</Typography.Text>
                            <Typography.Text type="secondary">
                                Очередь платежей: 3
                            </Typography.Text>
                            <Tag color="orange">Внимание</Tag>
                        </Space>
                    </Card>
                    <Card className="mini-card" bordered={false}>
                        <Space direction="vertical">
                            <Typography.Text strong>Invoice</Typography.Text>
                            <Typography.Text type="secondary">
                                Верификация: 100%
                            </Typography.Text>
                            <Tag color="blue">Готово</Tag>
                        </Space>
                    </Card>
                </Space>
            </Card>

            <Card className="panel" bordered={false}>
                <Typography.Title level={4}>Уведомления</Typography.Title>
                <List
                    dataSource={notifications}
                    renderItem={(item) => (
                        <List.Item>
                            <Space>
                                <Tag color={item.status}>{item.status}</Tag>
                                <Typography.Text>{item.title}</Typography.Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </Card>

            <Card className="panel" bordered={false}>
                <Typography.Title level={4}>Логирование</Typography.Title>
                <List
                    dataSource={logItems}
                    renderItem={(item) => (
                        <List.Item>
                            <Typography.Text type="secondary">{item}</Typography.Text>
                        </List.Item>
                    )}
                />
            </Card>

            <Card className="panel" bordered={false}>
                <Typography.Title level={4}>Инвентарь</Typography.Title>
                <List
                    dataSource={[
                        "SKU-8821: 42 шт",
                        "SKU-8822: 13 шт",
                        "SKU-8823: 87 шт",
                    ]}
                    renderItem={(item) => (
                        <List.Item>
                            <Space>
                                <AppstoreOutlined />
                                <Typography.Text>{item}</Typography.Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
}

export default OrderDashboard;

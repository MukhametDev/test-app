import { Card, List, Space, Statistic, Tag, Typography } from "antd";
import { CreditCardOutlined, DollarOutlined } from "@ant-design/icons";

const gateways = [
    { name: "Card Gateway", latency: "1.2s", status: "green" },
    { name: "PayPal", latency: "2.6s", status: "orange" },
    { name: "Invoice", latency: "0.8s", status: "blue" },
];

function PaymentsPage() {
    return (
        <div className="dashboard-grid">
            <Card className="panel" bordered={false}>
                <Typography.Title level={4}>PaymentService</Typography.Title>
                <Typography.Text type="secondary">
                    Мониторинг платежей, возвратов и способов оплаты.
                </Typography.Text>
                <Space size="large" className="summary-row">
                    <Statistic title="Сегодня" value="₽ 1 258 300" />
                    <Statistic title="Отказов" value="1.8%" />
                    <Statistic title="Возвратов" value="12" />
                </Space>
            </Card>
            <Card className="panel" bordered={false}>
                <List
                    header={<Typography.Text strong>Платежные шлюзы</Typography.Text>}
                    dataSource={gateways}
                    renderItem={(item) => (
                        <List.Item>
                            <Space>
                                <CreditCardOutlined />
                                <Typography.Text>{item.name}</Typography.Text>
                            </Space>
                            <Space>
                                <Tag color={item.status}>{item.status}</Tag>
                                <Typography.Text type="secondary">
                                    Latency: {item.latency}
                                </Typography.Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </Card>
            <Card className="panel" bordered={false}>
                <Space direction="vertical">
                    <Space>
                        <DollarOutlined />
                        <Typography.Text strong>Автосписание</Typography.Text>
                    </Space>
                    <Typography.Text type="secondary">
                        Порог авто-возврата: ₽ 50 000, уведомления включены.
                    </Typography.Text>
                </Space>
            </Card>
        </div>
    );
}

export default PaymentsPage;

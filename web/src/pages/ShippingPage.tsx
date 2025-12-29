import { Card, List, Space, Statistic, Tag, Typography } from "antd";
import { EnvironmentOutlined, TruckOutlined } from "@ant-design/icons";

const carriers = [
    { name: "Courier Express", eta: "1-2 дня", status: "green" },
    { name: "Pickup Point", eta: "2-3 дня", status: "blue" },
    { name: "Regional Cargo", eta: "4-6 дней", status: "orange" },
];

function ShippingPage() {
    return (
        <div className="dashboard-grid">
            <Card className="panel" bordered={false}>
                <Typography.Title level={4}>ShippingService</Typography.Title>
                <Typography.Text type="secondary">
                    Управление доставкой и трекингом отправлений.
                </Typography.Text>
                <Space size="large" className="summary-row">
                    <Statistic title="В пути" value={86} />
                    <Statistic title="Сегодня" value={24} />
                    <Statistic title="Проблем" value={3} />
                </Space>
            </Card>
            <Card className="panel" bordered={false}>
                <List
                    header={<Typography.Text strong>Перевозчики</Typography.Text>}
                    dataSource={carriers}
                    renderItem={(item) => (
                        <List.Item>
                            <Space>
                                <TruckOutlined />
                                <Typography.Text>{item.name}</Typography.Text>
                            </Space>
                            <Space>
                                <Tag color={item.status}>{item.status}</Tag>
                                <Typography.Text type="secondary">{item.eta}</Typography.Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </Card>
            <Card className="panel" bordered={false}>
                <Space direction="vertical">
                    <Space>
                        <EnvironmentOutlined />
                        <Typography.Text strong>География</Typography.Text>
                    </Space>
                    <Typography.Text type="secondary">
                        Москва, Санкт-Петербург, Казань, Екатеринбург.
                    </Typography.Text>
                </Space>
            </Card>
        </div>
    );
}

export default ShippingPage;

import { Card, List, Space, Statistic, Tag, Typography } from "antd";
import { DatabaseOutlined, WarningOutlined } from "@ant-design/icons";

const inventory = [
    { sku: "SKU-8821", stock: 42, status: "ok" },
    { sku: "SKU-8822", stock: 13, status: "low" },
    { sku: "SKU-8823", stock: 87, status: "ok" },
];

function InventoryPage() {
    return (
        <div className="dashboard-grid">
            <Card className="panel" bordered={false}>
                <Typography.Title level={4}>InventoryService</Typography.Title>
                <Typography.Text type="secondary">
                    Контроль доступности товаров и резервов.
                </Typography.Text>
                <Space size="large" className="summary-row">
                    <Statistic title="Всего SKU" value={1280} />
                    <Statistic title="В резерве" value={318} />
                    <Statistic title="Низкий остаток" value={12} />
                </Space>
            </Card>
            <Card className="panel" bordered={false}>
                <List
                    header={<Typography.Text strong>Складские позиции</Typography.Text>}
                    dataSource={inventory}
                    renderItem={(item) => (
                        <List.Item>
                            <Space>
                                <DatabaseOutlined />
                                <Typography.Text>{item.sku}</Typography.Text>
                            </Space>
                            <Space>
                                <Tag color={item.status === "low" ? "orange" : "green"}>
                                    {item.status === "low" ? "Низкий остаток" : "OK"}
                                </Tag>
                                <Typography.Text>
                                    Остаток: <strong>{item.stock}</strong>
                                </Typography.Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </Card>
            <Card className="panel" bordered={false}>
                <Space direction="vertical">
                    <Space>
                        <WarningOutlined />
                        <Typography.Text strong>Зоны риска</Typography.Text>
                    </Space>
                    <Typography.Text type="secondary">
                        SKU-8822 требует пополнения в течение 24 часов.
                    </Typography.Text>
                </Space>
            </Card>
        </div>
    );
}

export default InventoryPage;

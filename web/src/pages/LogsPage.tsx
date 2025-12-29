import { Card, List, Space, Statistic, Tag, Typography } from "antd";
import { FileTextOutlined, SafetyOutlined } from "@ant-design/icons";

const logs = [
    "Order #1024 created -> reserve inventory",
    "Payment TXN-88432 approved",
    "Shipment SHP-11024 created",
    "Notification queued: Order confirmation",
];

function LogsPage() {
    return (
        <div className="dashboard-grid">
            <Card className="panel" bordered={false}>
                <Typography.Title level={4}>OrderLogger</Typography.Title>
                <Typography.Text type="secondary">
                    Журнал операций фасада и технических ошибок.
                </Typography.Text>
                <Space size="large" className="summary-row">
                    <Statistic title="Сегодня" value={284} />
                    <Statistic title="Ошибок" value={3} />
                    <Statistic title="Оповещений" value={19} />
                </Space>
            </Card>
            <Card className="panel" bordered={false}>
                <List
                    header={<Typography.Text strong>Последние записи</Typography.Text>}
                    dataSource={logs}
                    renderItem={(item) => (
                        <List.Item>
                            <Space>
                                <FileTextOutlined />
                                <Typography.Text>{item}</Typography.Text>
                            </Space>
                            <Tag color="blue">info</Tag>
                        </List.Item>
                    )}
                />
            </Card>
            <Card className="panel" bordered={false}>
                <Space direction="vertical">
                    <Space>
                        <SafetyOutlined />
                        <Typography.Text strong>Политика логирования</Typography.Text>
                    </Space>
                    <Typography.Text type="secondary">
                        Храним критические события 30 дней, ошибки — 90 дней.
                    </Typography.Text>
                </Space>
            </Card>
        </div>
    );
}

export default LogsPage;

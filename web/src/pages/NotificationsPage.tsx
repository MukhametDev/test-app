import { Card, List, Space, Statistic, Tag, Typography } from "antd";
import { BellOutlined, MailOutlined } from "@ant-design/icons";

const updates = [
    { title: "Письмо по заказу #1024 отправлено", status: "success" },
    { title: "SMS по заказу #1022 не доставлено", status: "error" },
    { title: "Push о доставке #1019 в очереди", status: "processing" },
];

function NotificationsPage() {
    return (
        <div className="dashboard-grid">
            <Card className="panel" bordered={false}>
                <Typography.Title level={4}>NotificationService</Typography.Title>
                <Typography.Text type="secondary">
                    Очереди уведомлений и шаблоны сообщений.
                </Typography.Text>
                <Space size="large" className="summary-row">
                    <Statistic title="В очереди" value={36} />
                    <Statistic title="Отправлено" value={1240} />
                    <Statistic title="Ошибки" value={4} />
                </Space>
            </Card>
            <Card className="panel" bordered={false}>
                <List
                    header={<Typography.Text strong>Последние события</Typography.Text>}
                    dataSource={updates}
                    renderItem={(item) => (
                        <List.Item>
                            <Space>
                                <BellOutlined />
                                <Typography.Text>{item.title}</Typography.Text>
                            </Space>
                            <Tag color={item.status}>{item.status}</Tag>
                        </List.Item>
                    )}
                />
            </Card>
            <Card className="panel" bordered={false}>
                <Space direction="vertical">
                    <Space>
                        <MailOutlined />
                        <Typography.Text strong>Шаблоны</Typography.Text>
                    </Space>
                    <Typography.Text type="secondary">
                        Используется 8 активных шаблонов уведомлений.
                    </Typography.Text>
                </Space>
            </Card>
        </div>
    );
}

export default NotificationsPage;

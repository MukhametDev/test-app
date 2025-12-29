import {
    Badge,
    Button,
    Card,
    ConfigProvider,
    Divider,
    Layout,
    Menu,
    Space,
    Tag,
    Typography,
} from "antd";
import {
    BellOutlined,
    DatabaseOutlined,
    DollarOutlined,
    FileTextOutlined,
    ShoppingCartOutlined,
    TruckOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useMemo } from "react";

const { Sider, Content, Header } = Layout;

const menuItems = [
    { key: "/orders", icon: <ShoppingCartOutlined />, label: <Link to="/orders">Заказы</Link> },
    {
        key: "/orders/inventory",
        icon: <DatabaseOutlined />,
        label: <Link to="/orders/inventory">Склад</Link>,
    },
    {
        key: "/orders/payments",
        icon: <DollarOutlined />,
        label: <Link to="/orders/payments">Платежи</Link>,
    },
    {
        key: "/orders/shipping",
        icon: <TruckOutlined />,
        label: <Link to="/orders/shipping">Доставка</Link>,
    },
    {
        key: "/orders/notifications",
        icon: <BellOutlined />,
        label: <Link to="/orders/notifications">Уведомления</Link>,
    },
    {
        key: "/orders/logs",
        icon: <FileTextOutlined />,
        label: <Link to="/orders/logs">Логи</Link>,
    },
];

function DashboardLayout() {
    const location = useLocation();
    const selectedKey =
        menuItems.find((item) => location.pathname.startsWith(item.key))?.key ?? "/orders";

    const theme = useMemo(
        () => ({
            token: {
                colorPrimary: "#ff6b4a",
                colorInfo: "#ff6b4a",
                borderRadius: 14,
                fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
            },
        }),
        []
    );

    return (
        <ConfigProvider theme={theme}>
            <Layout className="dashboard-shell">
                <Sider width={260} className="dashboard-sider" theme="light">
                    <div className="brand-block">
                        <div className="brand-logo">OF</div>
                        <div>
                            <Typography.Text className="brand-title">
                                Order Facade
                            </Typography.Text>
                            <Typography.Text type="secondary" className="brand-subtitle">
                                Control Hub
                            </Typography.Text>
                        </div>
                    </div>
                    <Menu mode="inline" selectedKeys={[selectedKey]} items={menuItems} />
                    <Card className="sider-card" bordered={false}>
                        <Typography.Text type="secondary">Статус среды</Typography.Text>
                        <Divider />
                        <Space direction="vertical">
                            <Tag color="green">Facade online</Tag>
                            <Tag color="orange">Inventory sync</Tag>
                            <Tag color="blue">Payment ready</Tag>
                        </Space>
                    </Card>
                </Sider>

                <Layout>
                    <Header className="dashboard-header">
                        <Space size="large">
                            <Tag color="volcano">Активный модуль</Tag>
                            <Typography.Title level={3} className="header-title">
                                Панель управления заказами
                            </Typography.Title>
                        </Space>
                        <Space>
                            <Badge count={3} color="#ff6b4a">
                                <Button shape="round" icon={<BellOutlined />}>
                                    Уведомления
                                </Button>
                            </Badge>
                        </Space>
                    </Header>
                    <Content className="dashboard-content">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}

export default DashboardLayout;

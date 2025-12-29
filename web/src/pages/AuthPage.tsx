import { useMemo, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Checkbox,
    ConfigProvider,
    Divider,
    Form,
    Input,
    Tabs,
    Tag,
    Typography,
    message,
} from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { normalizeApiError, setAccessToken } from "../api/api";
import {
    login,
    register,
    type LoginPayload,
    type RegisterPayload,
} from "../api/auth";

function AuthPage() {
    const [loading, setLoading] = useState<"login" | "register" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();

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

    const handleLogin = async (values: LoginPayload) => {
        setLoading("login");
        setError(null);
        try {
            const response = await login(values);
            if (response.token) {
                setAccessToken(response.token);
            }
            messageApi.success("Успешный вход");
            navigate("/orders");
        } catch (err) {
            const apiError = normalizeApiError(err);
            setError(`${apiError.status}: ${apiError.message}`);
        } finally {
            setLoading(null);
        }
    };

    const handleRegister = async (values: RegisterPayload) => {
        setLoading("register");
        setError(null);
        try {
            const response = await register(values);
            if (response.token) {
                setAccessToken(response.token);
            }
            messageApi.success("Регистрация завершена");
            navigate("/orders");
        } catch (err) {
            const apiError = normalizeApiError(err);
            setError(`${apiError.status}: ${apiError.message}`);
        } finally {
            setLoading(null);
        }
    };

    return (
        <ConfigProvider theme={theme}>
            {contextHolder}
            <div className="app-shell">
                <section className="hero-panel">
                    <Tag color="volcano">Practice</Tag>
                    <Typography.Title level={1}>
                        Order Facade
                        <br />
                        Control Center
                    </Typography.Title>
                    <Typography.Paragraph>
                        Подготовленный интерфейс для регистрации и авторизации.
                        Используйте его, чтобы подключить ваш backend для
                        практического задания по паттерну Фасад.
                    </Typography.Paragraph>
                    <div className="hero-grid">
                        <div className="hero-card">
                            <Typography.Text strong>Что дальше</Typography.Text>
                            <ul>
                                <li>
                                    Создать эндпоинты /api/register и /api/login
                                </li>
                                <li>Вернуть токен или установить сессию</li>
                                <li>Подключить защищенные маршруты</li>
                            </ul>
                        </div>
                        <div className="hero-card">
                            <Typography.Text strong>Подсистемы</Typography.Text>
                            <div className="pill-row">
                                <span>Inventory</span>
                                <span>Payment</span>
                                <span>Shipping</span>
                                <span>Notifications</span>
                                <span>Logger</span>
                            </div>
                        </div>
                    </div>
                </section>

                <Card className="auth-card" bordered={false}>
                    <Typography.Title level={3}>
                        Вход в систему
                    </Typography.Title>
                    <Typography.Text type="secondary">
                        Авторизация для доступа к панели управления заказами
                    </Typography.Text>
                    <Divider />

                    {error && (
                        <Alert
                            type="error"
                            message="Ошибка"
                            description={error}
                            showIcon
                            className="auth-alert"
                        />
                    )}

                    <Tabs
                        defaultActiveKey="login"
                        items={[
                            {
                                key: "login",
                                label: "Вход",
                                children: (
                                    <Form
                                        layout="vertical"
                                        onFinish={handleLogin}
                                    >
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Укажите email",
                                                },
                                                {
                                                    type: "email",
                                                    message:
                                                        "Некорректный email",
                                                },
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined />}
                                                placeholder="you@mail.com"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Пароль"
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Введите пароль",
                                                },
                                            ]}
                                        >
                                            <Input.Password
                                                prefix={<LockOutlined />}
                                                placeholder="Минимум 8 символов"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="remember"
                                            valuePropName="checked"
                                        >
                                            <Checkbox>Запомнить меня</Checkbox>
                                        </Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading === "login"}
                                            block
                                            size="large"
                                        >
                                            Войти
                                        </Button>
                                    </Form>
                                ),
                            },
                            {
                                key: "register",
                                label: "Регистрация",
                                children: (
                                    <Form
                                        layout="vertical"
                                        onFinish={handleRegister}
                                    >
                                        <Form.Item
                                            label="Имя"
                                            name="name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Введите имя",
                                                },
                                            ]}
                                        >
                                            <Input
                                                prefix={<UserOutlined />}
                                                placeholder="Ваше имя"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Укажите email",
                                                },
                                                {
                                                    type: "email",
                                                    message:
                                                        "Некорректный email",
                                                },
                                            ]}
                                        >
                                            <Input
                                                prefix={<MailOutlined />}
                                                placeholder="you@mail.com"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Пароль"
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Введите пароль",
                                                },
                                                {
                                                    min: 8,
                                                    message:
                                                        "Минимум 8 символов",
                                                },
                                            ]}
                                            hasFeedback
                                        >
                                            <Input.Password
                                                prefix={<LockOutlined />}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Повторите пароль"
                                            name="password_confirmation"
                                            dependencies={["password"]}
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Подтвердите пароль",
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (
                                                            !value ||
                                                            getFieldValue(
                                                                "password"
                                                            ) === value
                                                        ) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(
                                                            new Error(
                                                                "Пароли не совпадают"
                                                            )
                                                        );
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input.Password
                                                prefix={<LockOutlined />}
                                            />
                                        </Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading === "register"}
                                            block
                                            size="large"
                                        >
                                            Создать аккаунт
                                        </Button>
                                    </Form>
                                ),
                            },
                        ]}
                    />
                </Card>
            </div>
        </ConfigProvider>
    );
}

export default AuthPage;

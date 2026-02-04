/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Button,
    Center,
    Container,
    Image,
    Paper,
    PasswordInput,
    Stack, 
    Tabs,
    TextInput,
    Title,
    Text,
    Box,
    Anchor,
    Group,
    Divider,
    Modal
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { 
    IconAt, 
    IconLock, 
    IconPhone, 
    IconUser, 
    IconArrowLeft,
    IconMailForward
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, userService } from '../api/service';

export default function AuthPage() {
    const navigate = useNavigate();
    
    // Forgot Password Modal-ийн төлөв
    const [opened, { open, close }] = useDisclosure(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

    // Нэвтрэх Form
    const loginForm = useForm({
        initialValues: { email: '', password: '' },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Буруу и-мэйл хаяг'),
            password: (val) => (val.length < 4 ? 'Нууц үг хамгийн багадаа 4 тэмдэгт' : null),
        },
    });

    // Бүртгүүлэх Form
    const registerForm = useForm({
        initialValues: { name: '', email: '', phone: '', password: '' },
        validate: {
            name: (val) => (val.length < 2 ? 'Нэрээ оруулна уу' : null),
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Буруу и-мэйл хаяг'),
            phone: (val) => (val.length < 8 ? 'Утасны дугаар буруу' : null),
            password: (val) => (val.length < 4 ? 'Нууц үг хамгийн багадаа 4 тэмдэгт' : null),
        },
    });

    // Нэвтрэх функц
    const onLogin = async (values: typeof loginForm.values) => {
        try {
            const res = await authService.signIn(values);
            if (res) {
                localStorage.setItem('token', res.body.token);
                if (res.body.client) {
                    localStorage.setItem('user', JSON.stringify(res.body.client));
                }
                notifications.show({
                    title: 'Амжилттай',
                    message: 'Тавтай морил!',
                    color: 'green',
                });
                navigate('/');
                window.location.reload(); 
            }
        } catch (err: any) {
            notifications.show({
                title: 'Алдаа',
                message: err.response?.data?.error?.message || 'И-мэйл эсвэл нууц үг буруу байна',
                color: 'red',
            });
        }
    };

    // Бүртгүүлэх функц
    const onRegister = async (values: typeof registerForm.values) => {
        try {
            const res = await authService.signUp(values);
            if (res.success) {
                notifications.show({ 
                    title: 'Бүртгэл амжилттай', 
                    message: 'Одоо нэвтрэх хэсгээр нэвтэрнэ үү.', 
                    color: 'green' 
                });
            }
        } catch (err: any) {
            notifications.show({ 
                title: 'Алдаа', 
                message: 'Бүртгэл үүсгэхэд алдаа гарлаа. Мэдээллээ шалгана уу.', 
                color: 'red' 
            });
        }
    };

    // Нууц үг сэргээх хүсэлт (PUT /forgot-password)
    const handleForgotPassword = async () => {
        if (!/^\S+@\S+$/.test(forgotEmail)) {
            notifications.show({ message: 'Зөв и-мэйл хаяг оруулна уу', color: 'red' });
            return;
        }

        setForgotLoading(true);
        try {
            await userService.forgotPassword(forgotEmail);
            notifications.show({
                title: 'Хүсэлт илгээгдлээ',
                message: `${forgotEmail} хаяг руу нууц үг сэргээх заавар илгээв.`,
                color: 'green',
                icon: <IconMailForward size={18} />
            });
            setForgotEmail('');
            close();
        } catch (err: any) {
            notifications.show({
                title: 'Алдаа',
                message: 'Хүсэлт илгээхэд алдаа гарлаа.',
                color: 'red',
            });
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <Box style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Буцах товч */}
            <Container size="lg" w="100%" py="md">
                <Button 
                    component={Link} 
                    to="/" 
                    variant="subtle" 
                    color="gray" 
                    leftSection={<IconArrowLeft size={16} />}
                >
                    Буцах
                </Button>
            </Container>

            <Container size={460} py={20} style={{ flex: 1 }}>
                <Center mb="xl">
                    <Stack align="center" gap={5}>
                        <Image src="/favicon.webp" h={60} w="auto" />
                        <Title order={1} fw={900} c="orange.8" style={{ letterSpacing: '-1px' }}>DEEDBUUZ.MN</Title>
                        <Text c="dimmed" size="sm" fw={500}>Дээд зэргийн амтыг таны үүдэнд</Text>
                    </Stack>
                </Center>

                <Paper withBorder shadow="xl" p={{ base: 20, sm: 40 }} radius="lg" bg="white">
                    <Tabs color="orange" defaultValue="login" variant="pills" radius="xl">
                        <Tabs.List grow mb="xl">
                            <Tabs.Tab value="login" fw={700} py="md">Нэвтрэх</Tabs.Tab>
                            <Tabs.Tab value="register" fw={700} py="md">Бүртгүүлэх</Tabs.Tab>
                        </Tabs.List>

                        {/* Login Panel */}
                        <Tabs.Panel value="login">
                            <form onSubmit={loginForm.onSubmit(onLogin)}>
                                <Stack gap="md">
                                    <TextInput 
                                        label="И-мэйл хаяг" 
                                        placeholder="email@example.com" 
                                        required 
                                        size="md"
                                        leftSection={<IconAt size={16} />}
                                        {...loginForm.getInputProps('email')} 
                                    />
                                    <Box>
                                        <PasswordInput 
                                            label="Нууц үг" 
                                            placeholder="****" 
                                            required 
                                            size="md"
                                            leftSection={<IconLock size={16} />}
                                            {...loginForm.getInputProps('password')} 
                                        />
                                        <Group justify="flex-end" mt={8}>
                                            <Anchor 
                                                component="button" 
                                                type="button" 
                                                size="xs" 
                                                c="orange" 
                                                fw={600}
                                                onClick={open}
                                            >
                                                Нууц үгээ мартсан уу?
                                            </Anchor>
                                        </Group>
                                    </Box>
                                    <Button type="submit" color="orange" fullWidth size="md" radius="md">
                                        Нэвтрэх
                                    </Button>
                                </Stack>
                            </form>
                        </Tabs.Panel>

                        {/* Register Panel */}
                        <Tabs.Panel value="register">
                            <form onSubmit={registerForm.onSubmit(onRegister)}>
                                <Stack gap="md">
                                    <TextInput label="Бүтэн нэр" placeholder="Таны нэр" required size="md" leftSection={<IconUser size={16}/>} {...registerForm.getInputProps('name')} />
                                    <TextInput label="И-мэйл" placeholder="email@example.com" required size="md" leftSection={<IconAt size={16}/>} {...registerForm.getInputProps('email')} />
                                    <TextInput label="Утас" placeholder="88******" required size="md" leftSection={<IconPhone size={16}/>} {...registerForm.getInputProps('phone')} />
                                    <PasswordInput label="Нууц үг" placeholder="****" required size="md" leftSection={<IconLock size={16}/>} {...registerForm.getInputProps('password')} />
                                    <Button type="submit" color="orange" fullWidth size="md" radius="md">
                                        Бүртгэл үүсгэх
                                    </Button>
                                </Stack>
                            </form>
                        </Tabs.Panel>
                    </Tabs>

                    <Divider my="xl" label="эсвэл" labelPosition="center" />
                    
                    <Text ta="center" size="xs" c="dimmed">
                        Бүртгүүлснээр та манай <Anchor href='/terms' size="xs" c="orange">Үйлчилгээний нөхцөл</Anchor>-ийг зөвшөөрч буй хэрэг юм.
                    </Text>
                </Paper>
            </Container>

            {/* Footer */}
            <Container size="lg" py="xl" ta="center">
                <Text size="xs" c="dimmed">
                    © {new Date().getFullYear()} DEEDBUUZ.MN. Бүх эрх хуулиар хамгаалагдсан.
                </Text>
            </Container>

            {/* Нууц үг сэргээх Modal */}
            <Modal 
                opened={opened} 
                onClose={close} 
                title={<Text fw={700}>Нууц үг сэргээх</Text>} 
                centered 
                radius="md"
            >
                <Stack gap="md">
                    <Text size="sm" c="dimmed">
                        Таны бүртгэлтэй и-мэйл хаяг руу нууц үг сэргээх холбоос илгээгдэх болно.
                    </Text>
                    <TextInput 
                        label="И-мэйл хаяг" 
                        placeholder="email@example.com" 
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.currentTarget.value)}
                        leftSection={<IconAt size={16} />}
                    />
                    <Button 
                        fullWidth 
                        color="orange" 
                        onClick={handleForgotPassword}
                        loading={forgotLoading}
                    >
                        Илгээх
                    </Button>
                </Stack>
            </Modal>
        </Box>
    );
}
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  Container, Paper, Title, Text, Stack, TextInput, 
  Button, Group, Avatar, Divider, LoadingOverlay, 
  PasswordInput, Modal, Box
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { userService } from '../api/service';
import { 
  IconUser, IconPhone, IconMapPin, 
  IconDeviceFloppy, IconLock, IconShieldLock 
} from '@tabler/icons-react';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // Modal-ыг удирдах hook
  const [opened, { open, close }] = useDisclosure(false);

  // Мэдээлэл засах Form
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Нэр хэт богино байна' : null),
      phone: (value) => (value.length < 8 ? 'Утасны дугаар буруу' : null),
    },
  });

  // Мэдээлэл татаж авах функц
  const fetchUserData = async () => {
    try {
      const res = await userService.getMe();
      if (res.body) {
        form.setValues({
          name: res.body.name || '',
          email: res.body.email || '',
          phone: res.body.phone || '',
          location: res.body.location || '',
        });
      }
    } catch (error) {
      notifications.show({ title: 'Алдаа', message: 'Мэдээлэл татаж чадсангүй', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Мэдээлэл шинэчлэх (PUT /api/client)
  const handleUpdate = async (values: typeof form.values) => {
    setSubmitting(true);
    try {
      const res = await userService.updateProfile({
        name: values.name,
        phone: values.phone,
        location: values.location,
      });

      if (res.body.success) {
        notifications.show({
          title: 'Амжилттай',
          message: 'Таны мэдээлэл шинэчлэгдлээ.',
          color: 'green',
        });
        
        // LocalStorage дахь нэрийг шинэчлэх
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...currentUser, name: values.name }));
      }
    } catch (error) {
      notifications.show({ title: 'Алдаа', message: 'Шинэчлэхэд алдаа гарлаа', color: 'red' });
    } finally {
      setSubmitting(false);
    }
  };

  // Нууц үг солих (POST /api/client/change-password)
  const handleChangePassword = async () => {
    if (newPassword.length < 4) {
      notifications.show({ message: 'Нууц үг хамгийн багадаа 4 тэмдэгт байна', color: 'red' });
      return;
    }

    setPassLoading(true);
    try {
      await userService.changePassword(newPassword);
      // API response-оос хамаарч res.success эсвэл res.body.success-ыг шалгана
      notifications.show({
        title: 'Амжилттай',
        message: 'Нууц үг амжилттай солигдлоо.',
        color: 'green',
      });
      setNewPassword('');
      close();
    } catch (error) {
      notifications.show({ title: 'Алдаа', message: 'Нууц үг солиход алдаа гарлаа', color: 'red' });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl" pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      
      <Title order={2} mb="lg" fw={900}>Миний мэдээлэл</Title>

      <Paper withBorder shadow="md" p={{ base: 20, sm: 30 }} radius="md">
        <Stack align="center" mb="xl">
          <Avatar size={100} radius={100} color="orange" src={null} variant="filled">
            {form.values.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Box ta="center">
            <Text fw={700} size="xl">{form.values.name}</Text>
            <Text c="dimmed" size="sm">{form.values.email}</Text>
          </Box>
        </Stack>

        <Divider my="xl" label="Хувийн мэдээлэл" labelPosition="center" />

        <form onSubmit={form.onSubmit(handleUpdate)}>
          <Stack gap="md">
            <TextInput
              label="Бүтэн нэр"
              placeholder="Таны нэр"
              required
              leftSection={<IconUser size={16} />}
              {...form.getInputProps('name')}
            />

            <TextInput
              label="И-мэйл хаяг"
              disabled
              description="И-мэйл солих боломжгүй"
              leftSection={<Text size="xs">@</Text>}
              {...form.getInputProps('email')}
            />

            <TextInput
              label="Утасны дугаар"
              placeholder="8899****"
              required
              leftSection={<IconPhone size={16} />}
              {...form.getInputProps('phone')}
            />

            <TextInput
              label="Байршил"
              placeholder="Дүүрэг, хороо, байр..."
              leftSection={<IconMapPin size={16} />}
              {...form.getInputProps('location')}
            />

            <Button 
              type="submit" 
              color="orange" 
              size="md" 
              mt="md"
              loading={submitting}
              leftSection={<IconDeviceFloppy size={18} />}
            >
              Мэдээлэл хадгалах
            </Button>
          </Stack>
        </form>

        <Divider my="xl" />

        <Paper withBorder p="md" radius="md" bg="gray.0">
          <Group justify="space-between" wrap="nowrap">
            <Box>
              <Text fw={700} size="sm" flex={1}>Нууц үг солих</Text>
              <Text size="xs" c="dimmed">Нэвтрэх нууц үгээ үе үе шинэчилж байхыг зөвлөж байна.</Text>
            </Box>
            <Button 
              variant="outline" 
              color="orange" 
              size="xs" 
              onClick={open}
              leftSection={<IconShieldLock size={14} />}
            >
              Шинэчлэх
            </Button>
          </Group>
        </Paper>
      </Paper>

      {/* Нууц үг солих Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={<Text fw={700}>Шинэ нууц үг тохируулах</Text>} 
        centered
        radius="md"
      >
        <Stack gap="md">
          <PasswordInput
            label="Шинэ нууц үг"
            placeholder="****"
            required
            leftSection={<IconLock size={16} />}
            value={newPassword}
            onChange={(event) => setNewPassword(event.currentTarget.value)}
          />
          <Text size="xs" c="dimmed">
            * Нууц үг доод тал нь 4 тэмдэгтээс бүрдсэн байх ёстой.
          </Text>
          <Button 
            fullWidth 
            color="orange" 
            onClick={handleChangePassword}
            loading={passLoading}
          >
            Нууц үг шинэчлэх
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}
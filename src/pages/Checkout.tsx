/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactPixel from 'react-facebook-pixel';
import {
  ActionIcon,
  Alert, Box,
  Button,
  Container,
  CopyButton,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconArrowLeft,
  IconCashBanknote,
  IconCheck,
  IconCopy,
  IconCreditCard,
  IconInfoCircle
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../api/service';
import { useBasketStore } from '../store/useBasketStore';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { basketItems, fetchBasket } = useBasketStore();
  
  // Хэрэглэгчийн мэдээллийг унших
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};

  // Сагсны нийт дүн болон Order ID авах
  const totalPrice = basketItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const orderId = basketItems.length > 0 ? basketItems[0].orderId : null;

  // Гүйлгээний утга үүсгэх (Огноо + Утас)
  const transactionCode = `${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${user.phone || '99xxxxxx'}`;

  // Хуудас ачаалагдахад сагсаа дахин нэг шалгах
  useEffect(() => {
    fetchBasket();
  }, []);

  const handleConfirmPayment = async () => {
    if (!orderId) {
      notifications.show({ title: 'Алдаа', message: 'Захиалга олдсонгүй', color: 'red' });
      return;
    }

    setIsSubmitting(true);
    try {
      // API: PUT https://buuz-api.itwork.mn/api/order/change-status
      const res = await productService.changeOrderStatus(orderId, 'pending');
      
      if (res.success) {
        notifications.show({
          title: 'Амжилттай',
          message: 'Төлбөрийн мэдээлэл илгээгдлээ. Бид удахгүй шалгаж баталгаажуулна.',
          color: 'green',
          autoClose: 5000,
        });

        ReactPixel.track('Purchase', {
        value: totalPrice,
        currency: 'MNT',
        content_name: 'Бүтээгдэхүүн худалдан авалт хийгдлээ.',
        content_ids: [orderId],
        content_type: 'product',
      });
        
        // Сагсыг хоослохын тулд дахин fetch хийнэ
        await fetchBasket();
        // Нүүр хуудас руу шилжих
        navigate('/');
      }
    } catch (err: any) {
      notifications.show({
        title: 'Алдаа',
        message: err.response?.data?.error?.message || 'Төлөв шинэчлэхэд алдаа гарлаа',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="sm" py="xl" pos="relative">
      <LoadingOverlay visible={isSubmitting} overlayProps={{ blur: 2 }} />
      
      <Button 
        variant="subtle" 
        leftSection={<IconArrowLeft size={16} />} 
        onClick={() => navigate('/cart')}
        mb="lg"
        color="gray"
      >
        Сагс руу буцах
      </Button>

      <Paper withBorder shadow="md" p={{ base: 20, sm: 30 }} radius="md">
        <Stack gap="xl">
          <Box ta="center">
            <Group justify="center" mb="xs">
                <IconCashBanknote size={40} color="orange" stroke={1.5} />
            </Group>
            <Title order={2} mb={5}>Төлбөр төлөх заавар</Title>
            <Text c="dimmed" size="sm">Банкны аппликейшн ашиглан доорх данс руу шилжүүлэг хийнэ үү.</Text>
          </Box>

          <Alert variant="light" color="orange" title="Санамж" icon={<IconInfoCircle />}>
            Гүйлгээний утга хэсэгт доорх <b>Кодыг</b> заавал зөв бичнэ үү. Ингэснээр таны захиалга автоматаар баталгаажих боломжтой.
          </Alert>

          <Paper withBorder p="xl" radius="md" bg="gray.0">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500} c="dimmed" size="sm">Дансны дугаар:</Text>
                <Group gap={5}>
                  <Text fw={700} size="lg">5751109020</Text>
                  <CopyButton value="5751109020">
                    {({ copied, copy }) => (
                      <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      </ActionIcon>
                    )}
                  </CopyButton>
                </Group>
              </Group>

              <Group justify="space-between">
                <Text fw={500} c="dimmed" size="sm">Хүлээн авагч банк:</Text>
                <Text fw={600}>Хаан банк</Text>
              </Group>

              <Divider variant="dashed" />

              <Group justify="space-between">
                <Text fw={500} c="dimmed" size="sm">Гүйлгээний утга:</Text>
                <Group gap={5}>
                  <Text fw={900} c="orange.9" size="lg">{transactionCode}</Text>
                  <CopyButton value={transactionCode}>
                    {({ copied, copy }) => (
                      <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      </ActionIcon>
                    )}
                  </CopyButton>
                </Group>
              </Group>

              <Group justify="space-between">
                <Text fw={500} c="dimmed" size="sm">Төлөх нийт дүн:</Text>
                <Text fw={900} size="xl" c="dark">{totalPrice.toLocaleString()}₮</Text>
              </Group>
            </Stack>
          </Paper>

          <Stack gap="xs">
            <Button 
              size="lg" 
              color="orange" 
              fullWidth 
              leftSection={<IconCreditCard size={20}/>}
              disabled={!orderId || totalPrice === 0}
              onClick={handleConfirmPayment}
            >
              Төлбөр төлсөн
            </Button>
            <Text size="xs" c="dimmed" ta="center">
                Та төлбөрөө шилжүүлснийхээ дараа энэ товчийг дарна уу.
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
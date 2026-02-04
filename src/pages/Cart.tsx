import {
    ActionIcon,
    Box,
    Button,
    Center,
    Container,
    Divider,
    Grid,
    Group,
    Image,
    NumberInput,
    Paper,
    Skeleton,
    Stack,
    Table,
    Text,
    Title
} from '@mantine/core';
import { IconMinus, IconPlus, IconShoppingCartX, IconTrash } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasketStore } from '../store/useBasketStore';

export default function CartPage() {
  const { basketItems, loading, fetchBasket, updateQuantity, removeItem } = useBasketStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBasket();
  }, [fetchBasket]);

  const totalPrice = basketItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading && basketItems.length === 0) {
     return <Container size="lg" py="xl"><Skeleton h={400} /></Container>;
  }

  if (basketItems.length === 0) {
    return (
      <Container size="sm" py={100}>
        <Center>
          <Stack align="center">
            <IconShoppingCartX size={80} color="gray" />
            <Title order={2}>Сагс хоосон байна</Title>
            <Button color="orange" onClick={() => navigate('/products')}>Цэс рүү очих</Button>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb={30} fw={900}>Миний сагс ({basketItems.length})</Title>
      
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          
          {/* --- DESKTOP TABLE --- */}
          <Paper withBorder radius="md" p={0} visibleFrom="sm" style={{ overflow: 'hidden' }}>
            <Table verticalSpacing="lg" horizontalSpacing="md">
              <Table.Thead bg="gray.0">
                <Table.Tr>
                  <Table.Th>Бүтээгдэхүүн</Table.Th>
                  <Table.Th ta="center">Тоо</Table.Th>
                  <Table.Th ta="right">Үнэ</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {basketItems.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Group gap="md">
                        <Image src={item.product?.img} h={60} w={60} radius="md" />
                        <Box>
                          <Text fw={700}>{item.product?.title}</Text>
                          <Text size="xs" c="dimmed">{item.price?.toLocaleString()}₮</Text>
                        </Box>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Center>
                        <NumberInput
                          value={item.quantity}
                          onChange={(val) => updateQuantity(item.product.id, Number(val))}
                          min={1} w={90} size="sm"
                        />
                      </Center>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text fw={800}>{(item.price * item.quantity).toLocaleString()}₮</Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <ActionIcon color="red.4" variant="subtle" onClick={() => removeItem(item.id)}>
                        <IconTrash size={20} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>

          {/* --- MOBILE LIST --- */}
          <Stack hiddenFrom="sm" gap="md">
            {basketItems.map((item) => (
              <Paper key={item.id} withBorder p="md" radius="md">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Group gap="sm">
                    <Image src={item.product?.img} h={70} w={70} radius="md" />
                    <Box>
                      <Text fw={700} size="sm">{item.product?.title}</Text>
                      <Text size="xs" c="orange.7" fw={700}>{item.price?.toLocaleString()}₮</Text>
                    </Box>
                  </Group>
                  <ActionIcon color="red" variant="subtle" onClick={() => removeItem(item.id)}>
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
                
                <Divider my="sm" variant="dashed" />
                
                <Group justify="space-between">
                  <Group gap={5}>
                    <ActionIcon 
                      variant="light" 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <IconMinus size={16} />
                    </ActionIcon>
                    <Text fw={700} w={30} ta="center">{item.quantity}</Text>
                    <ActionIcon 
                      variant="light" 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <IconPlus size={16} />
                    </ActionIcon>
                  </Group>
                  <Text fw={900}>{(item.price * item.quantity).toLocaleString()}₮</Text>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Grid.Col>

        {/* --- SUMMARY SIDEBAR --- */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder radius="md" p="xl" shadow="sm" pos="sticky" style={{ top: 20 }}>
            <Title order={3} mb="lg">Төлбөр</Title>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text c="dimmed">Нийт:</Text>
                <Text fw={700}>{totalPrice.toLocaleString()}₮</Text>
              </Group>
              <Button 
                fullWidth size="lg" color="orange" mt="md"
                onClick={() => navigate('/checkout')}
              >
                Захиалга үргэлжлүүлэх
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  Badge,
  Box,
  Container,
  Divider,
  Group, Image,
  LoadingOverlay,
  Paper,
  Stack,
  Tabs, Text, Title
} from '@mantine/core';
import { IconCalendar, IconHash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { userService } from '../api/service';

const statusMap: any = {
  pending: { label: 'Хүлээгдэж буй', color: 'gray' },
  processing: { label: 'Төлөгдсөн', color: 'blue' },
  completed: { label: 'Хүргэгдэж байна', color: 'orange' },
  done: { label: 'Хүргэгдсэн', color: 'green' },
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<string | null>('pending');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (status: string) => {
    setLoading(true);
    try {
      const res = await userService.getOrders(status);
      setOrders(res.body.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab) fetchOrders(activeTab);
  }, [activeTab]);

  return (
    <Container size="lg" py="xl" pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      
      <Title order={2} mb="xl">Миний захиалгууд</Title>

      <Tabs value={activeTab} onChange={setActiveTab} color="orange" variant="pills">
        <Tabs.List mb="xl">
          <Tabs.Tab value="pending">Хүлээгдэж буй</Tabs.Tab>
          <Tabs.Tab value="processing">Төлөгдсөн</Tabs.Tab>
          <Tabs.Tab value="completed">Хүргэгдэж байна</Tabs.Tab>
          <Tabs.Tab value="done">Хүргэгдсэн</Tabs.Tab>
        </Tabs.List>

        {orders.length === 0 ? (
          <Paper withBorder p="xl" radius="md" ta="center">
            <Text c="dimmed">Энэ хэсэгт захиалга олдсонгүй.</Text>
          </Paper>
        ) : (
          <Accordion variant="separated" radius="md">
            {orders.map((order) => (
              <Accordion.Item key={order.id} value={String(order.id)} mb="sm" style={{ border: '1px solid #eee' }}>
                <Accordion.Control>
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="xl">
                      <Stack gap={0}>
                        <Group gap={4}>
                          <IconHash size={14} color="gray" />
                          <Text fw={700} size="sm">{order.order_number}</Text>
                        </Group>
                        <Group gap={4}>
                          <IconCalendar size={14} color="gray" />
                          <Text size="xs" c="dimmed">{new Date(order.createdAt).toLocaleDateString()}</Text>
                        </Group>
                      </Stack>
                      
                      <Badge 
                        color={statusMap[order.status]?.color} 
                        variant="light"
                        visibleFrom="xs"
                      >
                        {statusMap[order.status]?.label}
                      </Badge>
                    </Group>

                    <Text fw={800} c="orange.8" size="lg" pr="md">
                      {Number(order.total_price).toLocaleString()}₮
                    </Text>
                  </Group>
                </Accordion.Control>

                <Accordion.Panel>
                  <Divider mb="md" variant="dashed" />
                  <Text size="sm" fw={700} mb="sm" c="dimmed">
                    Захиалсан бүтээгдэхүүнүүд:
                  </Text>
                  
                  <Stack gap="xs">
                    {order.order_items?.map((item: any) => (
                      <Paper key={item.id} withBorder p="xs" radius="sm" bg="gray.0">
                        <Group justify="space-between">
                          <Group>
                            <Image 
                              src={item.product?.img} 
                              h={50} 
                              w={50} 
                              radius="sm" 
                              fallbackSrc="https://placehold.co/50x50?text=No+Img" 
                            />
                            <Box>
                              <Text size="sm" fw={600}>{item.product?.title}</Text>
                              <Text size="xs" c="dimmed">
                                {Number(item.price).toLocaleString()}₮ x {item.quantity}
                              </Text>
                            </Box>
                          </Group>
                          <Text fw={700} size="sm">
                            {Number(item.subtotal).toLocaleString()}₮
                          </Text>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                  
                  {order.note && order.note !== "-" && (
                    <Text size="xs" mt="md" c="dimmed" fs="italic">
                      Тэмдэглэл: {order.note}
                    </Text>
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Tabs>
    </Container>
  );
}
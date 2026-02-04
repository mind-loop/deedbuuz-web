/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  Box, Container, Title, Text, Button, SimpleGrid, 
  Image, Group, Stack, ThemeIcon, Paper, Badge 
} from '@mantine/core';
import { 
  IconMeat, IconTruckDelivery, IconToolsKitchen2, 
  IconArrowRight, IconShoppingCartPlus, IconCertificate 
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../api/service';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    productService.getAll('?limit=3').then(res => setFeatured(res.body.items));
  }, []);

  return (
    <Box>
      {/* --- HERO SECTION --- */}
      <Box 
        style={{ 
          position: 'relative', 
          backgroundColor: '#fffaf0', // Warm festive background
          overflow: 'hidden' 
        }}
      >
        {/* Background Decorative Pattern */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.04,
            backgroundImage: `url('https://www.transparenttextures.com/patterns/pinstripe.png')`,
            pointerEvents: 'none'
          }}
        />

        <Container size="lg" py={{ base: 40, md: 80 }} style={{ position: 'relative', zIndex: 1 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={80}>
            
            <Stack gap="xl">
              <Badge color="red" variant="filled" size="lg" radius="sm">
                Сар шинийн захиалга эхэллээ
              </Badge>
              
              <Title size={56} fw={900} lh={1.1}>
                Айл гэрийн буян, <br />
                <Text span c="orange.8" inherit>Дээд Бууз</Text> <br />
                Таны Сар шинээр
              </Title>

              <Text size="xl" c="gray.7" style={{ maxWidth: 500, lineHeight: 1.6 }}>
                Гар аргаар татсан цэвэр мах, шүүслэг амт. Уламжлалт баяраа дээд зэргийн амтаар чимээрэй.
              </Text>

              <Group gap="md">
                <Button 
                  size="xl" 
                  radius="md" 
                  color="orange.8" 
                  onClick={() => navigate('/products')}
                  leftSection={<IconShoppingCartPlus size={24} />}
                >
                  Одоо захиалах
                </Button>
                <Button 
                  size="xl" 
                  radius="md" 
                  variant="outline" 
                  color="orange.8"
                  onClick={() => navigate('/help')}
                >
                  Цэс үзэх
                </Button>
              </Group>

              <Group gap="lg" mt="md">
                <Group gap={8}>
                  <ThemeIcon color="green" size={20} radius="xl">
                    <IconCertificate size={12} />
                  </ThemeIcon>
                  <Text size="sm" fw={600}>100% Эрүүл мах</Text>
                </Group>
                <Group gap={8}>
                  <ThemeIcon color="green" size={20} radius="xl">
                    <IconCertificate size={12} />
                  </ThemeIcon>
                  <Text size="sm" fw={600}>Гар таталт</Text>
                </Group>
              </Group>
            </Stack>

            {/* Зураг хэсэг - TypeScript алдааг зассан (Paper ашигласан) */}
            <Box style={{ position: 'relative' }}>
              <Paper 
                shadow="xl" 
                radius="lg" 
                style={{ overflow: 'hidden', border: '8px solid white' }}
              >
                <Image 
                  src="https://qr-api.e-uvs.mn/upload/photo_67cmh5xexyf0000shigejze7vue.jpg" 
                  fit="cover"
                  height={450}
                  alt="Deed Buuz"
                />
              </Paper>
              
              {/* Floating Badge */}
              <Paper
                shadow="md"
                p="md"
                radius="md"
                style={{
                  position: 'absolute',
                  bottom: -20,
                  right: -20,
                  backgroundColor: '#c92a2a', // Festive Red
                  color: 'white',
                  zIndex: 2,
                  textAlign: 'center'
                }}
              >
                <Text size="xs" fw={700} tt="uppercase">Сар шинээр</Text>
                <Text size="xl" fw={900}>ХҮРГЭЛТТЭЙ</Text>
              </Paper>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* --- FEATURED PRODUCTS --- */}
      <Container size="lg" py={100}>
        <Group justify="space-between" mb={50} align="flex-end">
          <Stack gap={5}>
            <Title order={2} size={32}>Онцлох бүтээгдэхүүн</Title>
            <Text c="dimmed">Хамгийн их захиалагддаг багцууд</Text>
          </Stack>
          <Button 
            variant="light" 
            color="orange" 
            radius="md"
            rightSection={<IconArrowRight size={16} />} 
            onClick={() => navigate('/products')}
          >
            Бүх цэсийг үзэх
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </SimpleGrid>
      </Container>

      {/* --- WHY US SECTION --- */}
      <Box bg="gray.0" py={100}>
        <Container size="lg">
          <Title order={2} ta="center" mb={60} size={32}>Бидний давуу тал</Title>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing={50}>
            <Feature icon={IconMeat} title="100% Цэвэр Мах" desc="Ямар ч хольцгүй, зөвхөн шинэхэн хонь, үхрийн мах." />
            <Feature icon={IconToolsKitchen2} title="Гар аргаар татсан" desc="Махны шүүслэг байдлыг хадгалах уламжлалт арга." />
            <Feature icon={IconTruckDelivery} title="Шуурхай Хүргэлт" desc="Захиалга баталгаажсанаас хойш 24 цагт хүргэнэ." />
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}

function Feature({ icon: Icon, title, desc }: any) {
  return (
    <Paper p="xl" radius="md" withBorder style={{ backgroundColor: 'transparent', borderStyle: 'dashed' }}>
      <Stack align="center" ta="center">
        <ThemeIcon size={64} radius="xl" color="orange" variant="light">
          <Icon size={36} />
        </ThemeIcon>
        <Text fw={800} size="lg">{title}</Text>
        <Text c="dimmed" size="sm" lh={1.6}>{desc}</Text>
      </Stack>
    </Paper>
  );
}
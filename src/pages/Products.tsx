/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { 
  SimpleGrid, 
  Text, 
  Skeleton, 
  Container, 
  Title, 
  Stack, 
  Divider,
  Center,
  Box
} from '@mantine/core';
import { productService } from '../api/service';
import { ProductCard } from '../components/ProductCard'; // Саяны үүсгэсэн компонентыг ашиглана
import { type Product } from '../types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productService.getAll()
      .then(res => {
        // API-аас ирж буй датаны бүтцийг шалгаад set хийнэ
        setProducts(res.body.items);
      })
      .catch(err => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box bg="white" mih="100vh" py="xl">
      <Container size="lg">
        {/* Хуудасны толгой хэсэг */}
        <Stack gap="xs" mb={40}>
          <Title order={1} size={36} fw={900}>
            Манай цэс
          </Title>
          <Text c="dimmed" size="lg">
            Шинэ мах, гар таталт, дээд зэргийн амтыг таны сонголтод зориулав.
          </Text>
          <Divider size="sm" color="orange" w={80} />
        </Stack>

        {loading ? (
          // Loading үед харагдах Skeleton
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
            {Array(6).fill(0).map((_, i) => (
              <Stack key={i}>
                <Skeleton h={250} radius="md" />
                <Skeleton h={20} w="70%" />
                <Skeleton h={20} w="40%" />
                <Skeleton h={40} radius="md" />
              </Stack>
            ))}
          </SimpleGrid>
        ) : products.length > 0 ? (
          // Бүтээгдэхүүний жагсаалт
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
            {products.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </SimpleGrid>
        ) : (
          // Дата хоосон үед
          <Center py={100}>
            <Stack align="center">
              <Text size="xl" fw={700} c="dimmed">Бүтээгдэхүүн олдсонгүй.</Text>
              <Text c="dimmed">Түр хүлээгээд дахин оролдоно уу.</Text>
            </Stack>
          </Center>
        )}
      </Container>
    </Box>
  );
}
import ReactPixel from "react-facebook-pixel";
import { Card, Image, Text, Group, Badge, Button, Stack } from "@mantine/core";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import type { Product } from "../types";
import { useBasketStore } from "../store/useBasketStore";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const addToBasket = useBasketStore((state) => state.addToBasket);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    ReactPixel.track("Сагсанд хийсэн.", {
      content_name: product.content, // 'Хонины махтай бууз'
      content_category: "Бууз", // Төрөл
      value: product.price, // 25000
      currency: "MNT", // Төгрөг
      content_ids: [product.id.toString()], // Барааны ID
    });
    setIsAdding(true);
    // useBasketStore доторх addToBasket-ийг дуудна
    await addToBasket(product.id, 1);
    setIsAdding(false);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        {/* Зураг байхгүй үед fallback зураг харуулж болно */}
        <Image
          src={product.img || "https://placehold.co/400x300?text=No+Image"}
          height={220}
          alt={product.title}
        />
      </Card.Section>

      <Stack mt="md" gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Text fw={700} size="lg" lineClamp={1} style={{ flex: 1 }}>
            {product.title}
          </Text>
          <Badge color="orange" size="lg" variant="light">
            {parseInt(product.price).toLocaleString()}₮
          </Badge>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={2} h={40}>
          {product.content}
        </Text>

        <Button
          fullWidth
          color="orange"
          radius="md"
          mt="sm"
          loading={isAdding} // Зөвхөн энэ карт дээр loading харагдана
          onClick={handleAddToCart}
          leftSection={!isAdding && <IconShoppingCartPlus size={18} />}
        >
          {isAdding ? "Нэмж байна..." : "Сагслах"}
        </Button>
      </Stack>
    </Card>
  );
}

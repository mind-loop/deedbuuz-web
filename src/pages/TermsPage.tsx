import { Container, Title, Text, Paper, Accordion, List, ThemeIcon, rem, Stack, Divider, Box, Anchor, Group } from '@mantine/core';
import { IconCircleCheck, IconInfoCircle, IconTruck, IconCreditCard, IconShieldLock } from '@tabler/icons-react';

export default function TermsPage() {
  return (
    <Container size="md" py={50}>
      <Stack gap="xl">
        <Box>
          <Title order={1} fw={900} c="orange.7">Үйлчилгээний нөхцөл</Title>
          <Text c="dimmed" size="sm" mt={5}>Сүүлд шинэчлэгдсэн: 2026 оны 2-р сарын 4</Text>
        </Box>

        <Paper withBorder p={30} radius="md" bg="gray.0">
          <Group wrap="nowrap" align="flex-start">
            <ThemeIcon color="orange" size="lg" variant="light">
              <IconInfoCircle size={20} />
            </ThemeIcon>
            <Text size="sm">
              DEEDBUUZ.MN вэбсайтаар үйлчлүүлж буй хэрэглэгч та доорх нөхцөлүүдийг анхааралтай уншиж танилцана уу. 
              Та захиалга хийснээр эдгээр нөхцөлийг хүлээн зөвшөөрсөнд тооцогдоно.
            </Text>
          </Group>
        </Paper>

        <Accordion variant="separated" radius="md" defaultValue="item-1">
          <Accordion.Item value="item-1">
            <Accordion.Control icon={<IconCircleCheck size={20} color="green" />}>
              1. Ерөнхий нөхцөл
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm" mb="md">
                Энэхүү журам нь DEEDBUUZ.MN онлайн дэлгүүрээр үйлчлүүлэх, бараа бүтээгдэхүүн худалдан авахтай холбоотой үүсэх харилцааг зохицуулна.
              </Text>
              <List spacing="xs" size="sm" center icon={
                <ThemeIcon color="orange" size={12} radius="xl">
                  <IconCircleCheck style={{ width: rem(8), height: rem(8) }} />
                </ThemeIcon>
              }>
                <List.Item>Вэбсайт нь 24 цагийн ажиллагаатай байна.</List.Item>
                <List.Item>Хэрэглэгч өөрийн мэдээллийн үнэн зөв байдлыг бүрэн хариуцна.</List.Item>
                <List.Item>Бүтээгдэхүүний үнэ болон мэдээллийг оператор урьдчилан мэдэгдэлгүйгээр өөрчлөх эрхтэй.</List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="item-2">
            <Accordion.Control icon={<IconCreditCard size={20} color="blue" />}>
              2. Төлбөр тооцоо ба Баталгаажуулалт
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm">
                Захиалгын төлбөрийг QPay, Банкны шилжүүлэг болон Бэлэн мөнгөөр (хүргэлт очих үед) төлөх боломжтой.
                Шилжүүлгээр төлсөн тохиолдолд гүйлгээний утга дээр захиалгын дугаарыг заавал бичнэ. 
                Төлбөр баталгаажсанаас хойш захиалга "Төлөгдсөн" төлөвт шилжиж, хүргэлтэд бэлтгэгдэнэ.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="item-3">
            <Accordion.Control icon={<IconTruck size={20} color="orange" />}>
              3. Хүргэлтийн нөхцөл
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm" mb="sm">
                Бид Улаанбаатар хот дотор хүргэлтийг дараах нөхцөлөөр гүйцэтгэнэ:
              </Text>
              <List size="sm" withPadding spacing="xs">
                <List.Item>Хүргэлтийн хугацаа: Захиалга баталгаажсанаас хойш 24-48 цагт.</List.Item>
                <List.Item>Хүргэлтийн бүс: Улаанбаатар хотын үндсэн дүүргүүд.</List.Item>
                <List.Item>Хүргэлтийн төлбөр: Захиалгын дүнгээс хамаарч өөр өөр байх ба 200,000₮-өөс дээш захиалгад хүргэлт үнэгүй.</List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="item-4">
            <Accordion.Control icon={<IconShieldLock size={20} color="red" />}>
              4. Нууцлалын бодлого
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm">
                Хэрэглэгчийн бүртгүүлсэн и-мэйл, утасны дугаар, гэрийн хаяг зэрэг хувийн мэдээллийг бид гуравдагч этгээдэд задруулахгүй байх үүргийг хүлээнэ. 
                Эдгээр мэдээллийг зөвхөн захиалга хүргэх, хэрэглэгчтэй холбоо барих зорилгоор ашиглана.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Divider my="sm" />

        <Box ta="center">
          <Text size="sm" c="dimmed">
            Танд асуух зүйл байвал <Anchor href="tel:88997766" c="orange" fw={700}>88997766</Anchor> дугаарт холбогдоно уу.
          </Text>
        </Box>
      </Stack>
    </Container>
  );
}
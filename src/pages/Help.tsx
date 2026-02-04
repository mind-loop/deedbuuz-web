// src/pages/Help.tsx
import { Accordion, Container, Title } from '@mantine/core';

export default function HelpPage() {
  return (
    <Container size="sm">
      <Title order={2} ta="center" mb="xl">Түгээмэл асуулт хариулт</Title>
      <Accordion variant="separated" radius="md">
        <Accordion.Item value="delivery">
          <Accordion.Control>Хүргэлт хэрхэн хийгддэг вэ?</Accordion.Control>
          <Accordion.Panel>Захиалга баталгаажсанаас хойш 24 цагийн дотор Улаанбаатар хот дотор хүргэгдэнэ.</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="quality">
          <Accordion.Control>Махны чанар ямар вэ?</Accordion.Control>
          <Accordion.Panel>Бид зөвхөн шинэ хонины болон үхрийн гуяны цул махыг гараар татаж хэрэглэдэг.</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="payment">
          <Accordion.Control>Төлбөр хэрхэн төлөх вэ?</Accordion.Control>
          <Accordion.Panel>Одоогоор бид зөвхөн бэлнээр болон дансаар шилжүүлэх (Cash) хэлбэрээр захиалга авч байна.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
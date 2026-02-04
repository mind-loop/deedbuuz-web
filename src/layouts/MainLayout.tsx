/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  Indicator,
  Menu,
  NavLink,
  rem,
  Stack,
  Text,
  UnstyledButton,
  Anchor,
  Box,
  useMantineTheme,
  Grid,
  ActionIcon,
  Image
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronDown,
  IconHelpCircle,
  IconHome,
  IconLogout,
  IconMeat,
  IconShoppingCart,
  IconUserCircle,
  IconClipboardList,
  IconSettings,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconPhone,
  IconMail,
  IconMapPin,
  IconFileText
} from '@tabler/icons-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useBasketStore } from '../store/useBasketStore';

export function MainLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Сагсны мэдээлэл
  const { basketItems } = useBasketStore();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
    close();
  };

  return (
    <AppShell header={{ height: { base: 60, md: 70 } }}>
      {/* HEADER SECTION */}
      <AppShell.Header style={{ borderBottom: `1px solid ${theme.colors.gray[2]}`, zIndex: 100 }}>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between" wrap="nowrap">
            
            {/* Logo & Burger */}
            <Group gap="xs">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <Image src="/favicon.webp" h={{ base: 35, md: 45 }} w="auto" fallbackSrc="https://placehold.co/45x45?text=DB" />
                <Text fw={900} size="xl" c="orange.7" ml={8} visibleFrom="xs" style={{ letterSpacing: '-0.5px' }}>
                  DEEDBUUZ.MN
                </Text>
              </Link>
            </Group>

            {/* Desktop Navigation */}
            <Group gap="xl" visibleFrom="sm">
              <NavLinkItem to="/" label="Нүүр" active={location.pathname === '/'} />
              <NavLinkItem to="/products" label="Цэс" active={location.pathname === '/products'} />
              <NavLinkItem to="/help" label="Тусламж" active={location.pathname === '/help'} />
              <NavLinkItem to="/terms" label="Үйлчилгээний нөхцөл" active={location.pathname === '/terms'} />
            </Group>

            {/* Actions (Cart & Profile) */}
            <Group gap="md">
              <Indicator 
                label={basketItems.length} 
                size={18} 
                color="orange" 
                offset={2} 
                disabled={basketItems.length === 0}
                withBorder
              >
                <UnstyledButton 
                  onClick={() => navigate('/cart')} 
                  p={8} 
                  style={{ borderRadius: '50%', display: 'flex' }}
                >
                  <IconShoppingCart size={24} stroke={1.5} />
                </UnstyledButton>
              </Indicator>

              {token ? (
                <Menu shadow="xl" width={220} position="bottom-end">
                  <Menu.Target>
                    <UnstyledButton p={4}>
                      <Group gap={8}>
                        <Avatar color="orange" radius="xl" size="sm">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box visibleFrom="md">
                          <Text fw={600} size="sm" style={{ maxWidth: 100 }} lineClamp={1}>{user.name}</Text>
                        </Box>
                        <IconChevronDown size={14} color="gray" />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  
                  <Menu.Dropdown>
                    <Menu.Label>Миний бүртгэл</Menu.Label>
                    <Menu.Item leftSection={<IconUserCircle size={16} />} onClick={() => navigate('/profile')}>
                      Хувийн мэдээлэл
                    </Menu.Item>
                    <Menu.Item leftSection={<IconClipboardList size={16} />} onClick={() => navigate('/orders')}>
                      Миний захиалгууд
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
                      Гарах
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Button 
                  variant="filled" 
                  color="orange" 
                  radius="xl" 
                  onClick={() => navigate('/auth')}
                  leftSection={<IconUserCircle size={18} />}
                  visibleFrom="xs"
                >
                  Нэвтрэх
                </Button>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      {/* MOBILE DRAWER */}
      <Drawer
        opened={opened}
        onClose={close}
        size="80%"
        padding="md"
        title={
          <Group gap="xs">
            <Image src="/favicon.webp" h={45} w={45} />
            <Text fw={900} c="orange.7">DEEDBUUZ.MN</Text>
          </Group>
        }
        hiddenFrom="sm"
      >
        <Stack gap="xs" mt="md">
          <MobileNavLink to="/" label="Нүүр хуудас" icon={IconHome} active={location.pathname === '/'} onClick={close} />
          <MobileNavLink to="/products" label="Буузны цэс" icon={IconMeat} active={location.pathname === '/products'} onClick={close} />
          <MobileNavLink to="/help" label="Тусламж" icon={IconHelpCircle} active={location.pathname === '/help'} onClick={close} />
          <MobileNavLink to="/terms" label="Үйлчилгээний нөхцөл" icon={IconFileText} active={location.pathname === '/terms'} onClick={close} />
          
          <Divider my="sm" label="Хэрэглэгч" labelPosition="center" />
          
          {token ? (
            <>
              <MobileNavLink to="/profile" label="Миний мэдээлэл" icon={IconSettings} active={location.pathname === '/profile'} onClick={close} />
              <MobileNavLink to="/orders" label="Миний захиалгууд" icon={IconClipboardList} active={location.pathname === '/orders'} onClick={close} />
              <Button variant="light" color="red" fullWidth leftSection={<IconLogout size={20} />} onClick={handleLogout} mt="md">
                Гарах
              </Button>
            </>
          ) : (
            <Button color="orange" radius="md" onClick={() => { navigate('/auth'); close(); }}>
              Нэвтрэх
            </Button>
          )}
        </Stack>
      </Drawer>

      {/* MAIN CONTENT AREA */}
      <AppShell.Main bg="gray.0">
        <Box style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Outlet />
        </Box>
       {/* FOOTER SECTION */}
        <Box component="footer" style={{ backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
          <Container size="lg" py={50}>
            <Grid gutter={40}>
              {/* ... өмнөх Grid.Col-ууд хэвээрээ байна ... */}
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="sm">
                  <Group gap="xs">
                    <Image src="/favicon.webp" h={45} w={45}/>
                    <Text fw={900} size="xl" c="orange.7">DEEDBUUZ.MN</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Дээд зэргийн амт, чанарыг эрхэмлэгч танд зориулсан гар хийцийн буузны онлайн дэлгүүр.
                  </Text>
                  <Group gap="xs" mt="sm">
                    <ActionIcon size="lg" color="blue" variant="light" radius="xl"><IconBrandFacebook size={18} /></ActionIcon>
                    <ActionIcon size="lg" color="pink" variant="light" radius="xl"><IconBrandInstagram size={18} /></ActionIcon>
                    <ActionIcon size="lg" color="cyan" variant="light" radius="xl"><IconBrandTwitter size={18} /></ActionIcon>
                  </Group>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 6, md: 2 }}>
                <Text fw={700} mb="sm">Цэс</Text>
                <Stack gap={5}>
                  <Anchor component={Link} to="/" c="dimmed" size="sm">Нүүр</Anchor>
                  <Anchor component={Link} to="/products" c="dimmed" size="sm">Цэс</Anchor>
                  <Anchor component={Link} to="/help" c="dimmed" size="sm">Тусламж</Anchor>
                  <Anchor component={Link} to="/terms" c="dimmed" size="sm">Үйлчилгээний нөхцөл</Anchor>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 6, md: 2 }}>
                <Text fw={700} mb="sm">Туслах</Text>
                <Stack gap={5}>
                  <Anchor component={Link} to="/profile" c="dimmed" size="sm">Профайл</Anchor>
                  <Anchor component={Link} to="/orders" c="dimmed" size="sm">Захиалга</Anchor>
                  <Anchor component={Link} to="/cart" c="dimmed" size="sm">Сагс</Anchor>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text fw={700} mb="sm">Холбоо барих</Text>
                <Stack gap="xs">
                  <Group gap="xs"><IconPhone size={16} color="orange" /><Text size="sm">+976 88997766</Text></Group>
                  <Group gap="xs"><IconMail size={16} color="orange" /><Text size="sm">info@deedbuuz.mn</Text></Group>
                  <Group gap="xs"><IconMapPin size={16} color="orange" /><Text size="sm">УБ хот, БЗД, 26-р хороо</Text></Group>
                </Stack>
              </Grid.Col>
            </Grid>

           <Divider my={30} />
            
            <Group justify="space-between" align="center" wrap="wrap">
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  © {new Date().getFullYear()} DEEDBUUZ.MN. Бүх эрх хуулиар хамгаалагдсан.
                </Text>
                <Group gap={4}>
                  <Text size="xs" c="dimmed">Хөгжүүлсэн:</Text>
                  <Anchor 
                    href="https://itwork.mn" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    c="orange.7" 
                    fw={700}
                    style={{ fontSize: '12px' }}
                  >
                    АЙТИ ВОРК ХХК
                  </Anchor>
                </Group>
              </Stack>
              
              <Group gap="xs" opacity={0.6}>
                 <Image src="https://img.icons8.com/color/48/visa.png" h={20} alt="Visa" />
                 <Image src="https://img.icons8.com/color/48/mastercard.png" h={20} alt="Mastercard" />
              </Group>
            </Group>
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}

// Хялбаршуулсан NavLinkItem
function NavLinkItem({ to, label, active }: any) {
  return (
    <Anchor component={Link} to={to} c={active ? 'orange.7' : 'dark'} fw={active ? 700 : 500} underline="never" style={{ fontSize: rem(15) }}>
      {label}
    </Anchor>
  );
}

// Хялбаршуулсан MobileNavLink
function MobileNavLink({ to, label, icon: Icon, active, onClick }: any) {
  return (
    <NavLink component={Link} to={to} label={label} leftSection={<Icon size={20} stroke={1.5} />} active={active} onClick={onClick} variant="light" color="orange" styles={{ root: { borderRadius: rem(8) } }} />
  );
}
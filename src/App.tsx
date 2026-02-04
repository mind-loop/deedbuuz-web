import { MantineProvider, createTheme } from "@mantine/core";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import AuthPage from "./pages/Auth";
import HelpPage from "./pages/Help";
import HomePage from "./pages/Home";
import ProductsPage from "./pages/Products";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import OrdersPage from "./pages/Orders"; // Шинэ!
import ProfilePage from "./pages/Profile"; // Шинэ!
import { Notifications } from "@mantine/notifications";
import TermsPage from "./pages/TermsPage";

const theme = createTheme({
  primaryColor: "orange",
  defaultRadius: "md",
  fontFamily: "Inter, sans-serif",
});

// Нэвтэрсэн эсэхийг шалгах хамгаалалттай зам
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <MantineProvider theme={theme} forceColorScheme="light">
      <Notifications position="top-right" zIndex={1000} />
      <BrowserRouter>
        <Routes>
          {/* Үндсэн Layout-тай замууд */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/terms" element={<TermsPage />} />
            {/* Зөвхөн нэвтэрсэн үед харагдах замууд */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Layout-гүй замууд */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Бусад буруу замуудыг Нүүр хуудас руу чиглүүлнэ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
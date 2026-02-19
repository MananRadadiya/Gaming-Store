import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import ProtectedRoute from './components/ProtectedRoute';
import {
  HomePage,
  StorePage,
  ProductPage,
  CartPage,
  WishlistPage,
  CheckoutPage,
  BlogPage,
  EsportsPage,
  FlashSalePage,
} from './pages';
import LoginPage from './pages/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes — no Navbar, own layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="add-product" element={<AdminProductForm />} />
          <Route path="edit-product/:category/:id" element={<AdminProductForm />} />
        </Route>

        {/* Login — no Navbar */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public routes — with Navbar */}
        <Route
          path="/*"
          element={
            <div className="bg-nexus-darker min-h-screen text-white">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/esports" element={<EsportsPage />} />
                <Route path="/flash-sale" element={<FlashSalePage />} />
                <Route path="/deals" element={<FlashSalePage />} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;


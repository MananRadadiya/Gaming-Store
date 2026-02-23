import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  BlogDetailsPage,
  AuthorProfilePage,
  EsportsPage,
  FlashSalePage,
  CommunityPage,
  OrderSuccessPage,
  OrdersPage,
  OrderDetailsPage,
} from './pages';
import BuildRecommender from './components/ai/BuildRecommender';
import NexusBot from './components/ai/NexusBot';
import LoginPage from './pages/LoginPage';
import VirtualStore from './pages/VirtualStore';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import SalesAnalytics from './pages/admin/SalesAnalytics';
import UserAnalytics from './pages/admin/UserAnalytics';
import RevenueOverview from './pages/admin/RevenueOverview';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
        limit={3}
        toastClassName="!bg-[#0d0d0d]/95 !border !border-white/[0.08] !rounded-xl !shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(0,255,136,0.08)] !font-sans"
        bodyClassName="!text-white !text-sm !font-medium !p-0"
        progressClassName="!bg-gradient-to-r !from-[#00FF88] !via-[#00E0FF] !to-[#00FF88]"
        closeButton={false}
      />
      <NexusBot />
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
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="analytics/sales" element={<SalesAnalytics />} />
          <Route path="analytics/users" element={<UserAnalytics />} />
          <Route path="analytics/revenue" element={<RevenueOverview />} />
        </Route>

        {/* Login — no Navbar */}
        <Route path="/login" element={<LoginPage />} />

        {/* Virtual 3D Store — standalone immersive, no Navbar */}
        <Route path="/virtual-store" element={<VirtualStore />} />

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
                <Route path="/blog/:slug" element={<BlogDetailsPage />} />
                <Route path="/author/:authorId" element={<AuthorProfilePage />} />
                <Route path="/esports" element={<EsportsPage />} />
                <Route path="/flash-sale" element={<FlashSalePage />} />
                <Route path="/deals" element={<FlashSalePage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/ai-build" element={<BuildRecommender />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;


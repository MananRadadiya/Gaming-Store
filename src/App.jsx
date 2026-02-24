import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from './components';
import ProtectedRoute from './components/ProtectedRoute';
import React, { Suspense, lazy } from 'react';

/* PERF: Lazy-load all page routes.
   Only HomePage JS is eagerly loaded via the import chain.
   All other routes load on demand when user navigates. */
const HomePage = lazy(() => import('./pages/HomePage'));
const StorePage = lazy(() => import('./pages/StorePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailsPage = lazy(() => import('./pages/BlogDetails'));
const AuthorProfilePage = lazy(() => import('./pages/AuthorProfile'));
const EsportsPage = lazy(() => import('./pages/EsportsPage'));
const FlashSalePage = lazy(() => import('./pages/FlashSalePage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccess'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetails'));
const BuildRecommender = lazy(() => import('./components/ai/BuildRecommender'));
const NexusBot = lazy(() => import('./components/ai/NexusBot'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const VirtualStore = lazy(() => import('./pages/VirtualStore'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AnalyticsDashboard = lazy(() => import('./pages/admin/AnalyticsDashboard'));
const SalesAnalytics = lazy(() => import('./pages/admin/SalesAnalytics'));
const UserAnalytics = lazy(() => import('./pages/admin/UserAnalytics'));
const RevenueOverview = lazy(() => import('./pages/admin/RevenueOverview'));

/* PERF: Minimal page-level loading fallback */
const PageLoader = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#00FF88]/20 border-t-[#00FF88] rounded-full animate-spin" />
  </div>
);

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
      {/* PERF: NexusBot lazy-loaded — AI chat is not needed on initial render */}
      <Suspense fallback={null}>
        <NexusBot />
      </Suspense>
      <Routes>
        {/* Admin routes — no Navbar, own layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<PageLoader />}>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route index element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<PageLoader />}><AdminProducts /></Suspense>} />
          <Route path="add-product" element={<Suspense fallback={<PageLoader />}><AdminProductForm /></Suspense>} />
          <Route path="edit-product/:category/:id" element={<Suspense fallback={<PageLoader />}><AdminProductForm /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<PageLoader />}><AnalyticsDashboard /></Suspense>} />
          <Route path="analytics/sales" element={<Suspense fallback={<PageLoader />}><SalesAnalytics /></Suspense>} />
          <Route path="analytics/users" element={<Suspense fallback={<PageLoader />}><UserAnalytics /></Suspense>} />
          <Route path="analytics/revenue" element={<Suspense fallback={<PageLoader />}><RevenueOverview /></Suspense>} />
        </Route>

        {/* Login — standalone, no Navbar */}
        <Route path="/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />

        {/* Virtual 3D Store — standalone immersive, no Navbar */}
        <Route path="/virtual-store" element={<Suspense fallback={<PageLoader />}><VirtualStore /></Suspense>} />

        {/* Public routes — with Navbar */}
        <Route
          path="/*"
          element={
            <div className="bg-nexus-darker min-h-screen text-white">
              <Navbar />
              <Routes>
                <Route path="/" element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
                <Route path="/store" element={<Suspense fallback={<PageLoader />}><StorePage /></Suspense>} />
                <Route path="/product/:id" element={<Suspense fallback={<PageLoader />}><ProductPage /></Suspense>} />
                <Route path="/cart" element={<Suspense fallback={<PageLoader />}><CartPage /></Suspense>} />
                <Route path="/wishlist" element={<Suspense fallback={<PageLoader />}><WishlistPage /></Suspense>} />
                <Route path="/checkout" element={<Suspense fallback={<PageLoader />}><CheckoutPage /></Suspense>} />
                <Route path="/blog" element={<Suspense fallback={<PageLoader />}><BlogPage /></Suspense>} />
                <Route path="/blog/:slug" element={<Suspense fallback={<PageLoader />}><BlogDetailsPage /></Suspense>} />
                <Route path="/author/:authorId" element={<Suspense fallback={<PageLoader />}><AuthorProfilePage /></Suspense>} />
                <Route path="/esports" element={<Suspense fallback={<PageLoader />}><EsportsPage /></Suspense>} />
                <Route path="/flash-sale" element={<Suspense fallback={<PageLoader />}><FlashSalePage /></Suspense>} />
                <Route path="/deals" element={<Suspense fallback={<PageLoader />}><FlashSalePage /></Suspense>} />
                <Route path="/community" element={<Suspense fallback={<PageLoader />}><CommunityPage /></Suspense>} />
                <Route path="/ai-build" element={<Suspense fallback={<PageLoader />}><BuildRecommender /></Suspense>} />
                <Route path="/order-success" element={<Suspense fallback={<PageLoader />}><OrderSuccessPage /></Suspense>} />
                <Route path="/orders" element={<Suspense fallback={<PageLoader />}><OrdersPage /></Suspense>} />
                <Route path="/orders/:orderId" element={<Suspense fallback={<PageLoader />}><OrderDetailsPage /></Suspense>} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;


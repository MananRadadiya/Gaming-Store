import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar } from './components';
import {
  HomePage,
  StorePage,
  ProductPage,
  CartPage,
  WishlistPage,
  CheckoutPage,
  BlogPage,
  EsportsPage,
} from './pages';

function App() {
  return (
    <Router>
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
          <Route path="/deals" element={<StorePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


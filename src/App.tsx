import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CollectionProvider } from './context/CollectionContext';
import Layout from './components/common/Layout/Layout';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CommunityPage from './pages/CommunityPage';
import PostDetailPage from './pages/PostDetailPage';
import CollectionPage from './pages/CollectionPage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <CollectionProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<MarketplacePage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/community/:id" element={<PostDetailPage />} />
                <Route path="/collection" element={<CollectionPage />} />
              </Route>
            </Routes>
          </CollectionProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { HomePageProvider } from './context/HomePageStateContext'; // Import the new provider
import { Analytics } from '@vercel/analytics/react'
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PaletteDetailPage from './pages/PaletteDetailPage';
import AboutPage from './pages/AboutPage';
import Blog from './pages/Blog';
import Post1 from './pages/Blogposts/Post1';
import Post2 from './pages/Blogposts/Post2';
import Post3 from './pages/Blogposts/Post3';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Navbar />
            <main className="flex-grow ">
              <HomePageProvider> {/* Wrap Routes with the provider */}
                <Routes>
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/website-color-schemes-2025" element={<Post1 />} />
                  <Route path="/blog/color-psychology-conversions" element={<Post2 />} />
                  <Route path="/blog/css-gradients-guide" element={<Post3 />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/palette/:id" element={<PaletteDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </HomePageProvider>
            </main>
            <Footer />
          </div>
          <Analytics />
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PaletteDetailPage from './pages/PaletteDetailPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Navbar />
          <main className="flex-grow ">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/palette/:id" element={<PaletteDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Analytics />
      </Router>
    </ThemeProvider>
  );
}

export default App;

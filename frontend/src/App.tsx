import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import GuruDirectory from './pages/GuruDirectory';
import NewsHub from './pages/NewsHub';
import NewsDetail from './pages/NewsDetail';
import Downloads from './pages/Downloads';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between font-sans bg-slate-50">
        <div>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<About />} />
              <Route path="/guru" element={<GuruDirectory />} />
              <Route path="/berita" element={<NewsHub />} />
              <Route path="/berita/:id" element={<NewsDetail />} />
              <Route path="/unduhan" element={<Downloads />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

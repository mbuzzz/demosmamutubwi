import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import GuruDirectory from './pages/GuruDirectory';
import NewsHub from './pages/NewsHub';
import NewsDetail from './pages/NewsDetail';
import Downloads from './pages/Downloads';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setSelectedArticleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (id: number) => {
    setSelectedArticleId(id);
    setCurrentPage('news-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPageChange={handlePageChange} onSelectArticle={handleSelectArticle} />;
      case 'about':
        return <About />;
      case 'guru':
        return <GuruDirectory />;
      case 'news':
        return <NewsHub onSelectArticle={handleSelectArticle} />;
      case 'news-detail':
        return selectedArticleId ? (
          <NewsDetail articleId={selectedArticleId} onBack={() => handlePageChange('news')} />
        ) : (
          <NewsHub onSelectArticle={handleSelectArticle} />
        );
      case 'downloads':
        return <Downloads />;
      default:
        return <Home onPageChange={handlePageChange} onSelectArticle={handleSelectArticle} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans">
      <div>
        <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
        <main>{renderPage()}</main>
      </div>
      <Footer />
    </div>
  );
}

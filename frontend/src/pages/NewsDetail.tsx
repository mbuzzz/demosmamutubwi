import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Share2, Facebook, Twitter, MessageCircle, Link as LinkIcon, Check, Loader2 } from 'lucide-react';
import { usePublicBeritaDetail, usePublicBeritaList } from '../hooks/useCms';
import { getFileUrl } from '../lib/api';

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>(); // 'id' contains the news slug
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data: article, isLoading: isDetailLoading } = usePublicBeritaDetail(id);
  const { data: beritaList = [], isLoading: isListLoading } = usePublicBeritaList();

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = article ? encodeURIComponent(article.judul) : '';

  if (isDetailLoading || isListLoading) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 py-12 px-4 min-h-screen flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm text-slate-500 font-semibold">Memuat berita...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 py-12 px-4 min-h-screen">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <p className="text-slate-500 dark:text-slate-400 font-bold">Berita tidak ditemukan</p>
          <button 
            onClick={() => navigate('/berita')}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Berita
          </button>
        </div>
      </div>
    );
  }

  const categoryName = article.kategori?.nama || 'Umum';
  const authorName = article.penulis?.name || 'Humas Sekolah';
  const publishDate = article.published_at 
    ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  // Filter out current article and show top 3 recommendations
  const relatedArticles = beritaList
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="bg-slate-50 dark:bg-slate-800 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Breadcrumb */}
        <button 
          onClick={() => navigate('/berita')}
          className="text-slate-500 dark:text-slate-400 hover:text-brand-blueDark dark:text-brand-yellow font-semibold text-sm flex items-center gap-2 mb-8 transition-colors bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 w-max"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Berita
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article Content (Bento Main Column) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
            {/* Featured Image Header */}
            <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
              <img 
                src={article.cover_image ? getFileUrl(article.cover_image) : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80'} 
                alt={article.judul} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-4 left-4">
                <span className="flex items-center gap-1.5 bg-brand-teal text-white px-3 py-1.5 rounded-[10px] text-xs font-bold uppercase tracking-wider shadow-md">
                  <Tag className="h-3.5 w-3.5" /> {categoryName}
                </span>
              </div>
            </div>

            <div className="p-8 sm:p-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                {article.judul}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 text-sm mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-2 font-medium">
                  <Calendar className="h-4 w-4 text-brand-teal dark:text-emerald-400" /> {publishDate}
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 text-xs font-bold">
                    {authorName.charAt(0)}
                  </div>
                  Oleh: <span className="text-slate-700 dark:text-slate-300">{authorName}</span>
                </span>
              </div>

              {/* Body Text */}
              <div 
                className="prose prose-lg max-w-none text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: article.konten }}
              />
            </div>
          </div>

          {/* Sidebar (Bento Side Column) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Share Widget Bento */}
            <div className="bg-white dark:bg-slate-900 rounded-[15px] p-6 shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-brand-teal dark:text-emerald-400" /> Bagikan Berita
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* WhatsApp */}
                <a 
                  href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                  target="_blank" rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] p-3 rounded-[12px] transition-colors font-semibold text-sm"
                >
                  <MessageCircle className="w-6 h-6" /> WhatsApp
                </a>
                
                {/* Facebook */}
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank" rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] p-3 rounded-[12px] transition-colors font-semibold text-sm"
                >
                  <Facebook className="w-6 h-6" /> Facebook
                </a>
                
                {/* Telegram */}
                <a 
                  href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                  target="_blank" rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-2 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 text-[#229ED9] p-3 rounded-[12px] transition-colors font-semibold text-sm"
                >
                  <span className="font-bold text-xl leading-none -mt-1">TG</span> Telegram
                </a>
                
                {/* Twitter / X */}
                <a 
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                  target="_blank" rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-2 bg-slate-800/10 hover:bg-slate-800/20 text-slate-800 dark:text-slate-200 p-3 rounded-[12px] transition-colors font-semibold text-sm"
                >
                  <Twitter className="w-6 h-6" /> Twitter
                </a>
              </div>

              {/* Copy Link Button */}
              <button 
                onClick={handleCopyLink}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[12px] font-bold text-sm transition-all duration-200 ${
                  copied 
                    ? 'bg-brand-green text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:bg-slate-700'
                }`}
              >
                {copied ? <><Check className="w-4 h-4" /> Tersalin!</> : <><LinkIcon className="w-4 h-4" /> Salin URL Berita</>}
              </button>
            </div>

            {/* Rekomendasi / Berita Lainnya Bento */}
            <div className="bg-brand-blueDark rounded-[15px] p-6 shadow-card dark:shadow-none text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-slate-900/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className="font-bold text-lg mb-5 relative z-10">Berita Lainnya</h3>
              <div className="space-y-4 relative z-10">
                {relatedArticles.map((related) => {
                  const relatedDate = related.published_at 
                    ? new Date(related.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '—';
                  return (
                    <div 
                      key={related.id} 
                      className="flex gap-3 cursor-pointer group"
                      onClick={() => navigate(`/berita/${related.slug}`)}
                    >
                      <div className="w-20 h-20 rounded-[10px] bg-slate-800 overflow-hidden shrink-0">
                        <img 
                          src={related.cover_image ? getFileUrl(related.cover_image) : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&auto=format&fit=crop&q=80'} 
                          alt={related.judul} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-brand-yellow transition-colors">
                          {related.judul}
                        </h4>
                        <span className="text-[11px] text-slate-400 mt-1">{relatedDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

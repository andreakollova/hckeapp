import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.ts';
import { Article } from '../types.ts';
import { ChevronLeft, Calendar, AlertCircle } from 'lucide-react';
import { getArticleImage } from '../utils/helpers.ts';

const ArticleDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const urlParam = searchParams.get('url');

  useEffect(() => {
    if (!urlParam) {
      navigate('/');
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await apiService.getArticleDetail(urlParam);
        if (data) {
          setArticle(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to load article detail:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [urlParam, navigate]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 md:h-[500px] bg-card w-full" />
        <div className="max-w-3xl mx-auto p-4 space-y-4 -mt-12 relative z-10">
          <div className="h-10 bg-card rounded w-3/4" />
          <div className="h-6 bg-card rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (error || !article) return (
    <div className="p-20 text-center flex flex-col items-center gap-6">
      <AlertCircle size={48} className="text-primary opacity-50" />
      <p className="text-xl font-sports uppercase italic">Článok sa nepodarilo načítať.</p>
      <button onClick={() => navigate(-1)} className="bg-white/5 px-6 py-2 rounded-full">Návrat späť</button>
    </div>
  );

  const normalizedImage = getArticleImage(article);
  const content = String(article.content_html || article.content_text || 'Obsah článku nie je k dispozícii.');
  const title = String(article.title || "Bez názvu");
  const dateText = String(article.date_text || "Dnes");

  return (
    <div className="pb-20">
      <div className="relative h-64 md:h-[600px] w-full">
        <img src={normalizedImage} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-3 bg-black/50 rounded-full z-20"><ChevronLeft size={24} /></button>
      </div>

      <article className="max-w-3xl mx-auto px-4 -mt-16 md:-mt-32 relative z-10">
        <div className="bg-dark rounded-3xl p-6 md:p-10 border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">HC KOŠICE</div>
            <div className="flex items-center gap-2 text-white/40 text-xs"><Calendar size={14} />{dateText}</div>
          </div>
          <h1 className="text-3xl md:text-5xl font-sports font-bold leading-tight mb-8">{title}</h1>
          <div className="prose prose-invert max-w-none text-white/80 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
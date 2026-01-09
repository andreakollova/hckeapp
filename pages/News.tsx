
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api.ts';
import { Article } from '../types.ts';
import ArticleCard from '../components/ArticleCard.tsx';
import { parseSlovakDate, formatSlovakDate } from '../utils/helpers.ts';

const News: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const data = await apiService.getArticles(30); // Zvýšený limit pre lepšie radenie
      
      const processedArticles = (Array.isArray(data) ? data : [])
        .map(art => {
          const parsedDate = parseSlovakDate(art.date_text || art.date);
          return {
            ...art,
            _timestamp: parsedDate ? parsedDate.getTime() : 0,
            _formattedDate: formatSlovakDate(parsedDate)
          };
        })
        .sort((a, b) => b._timestamp - a._timestamp); // Od najnovšieho

      setArticles(processedArticles);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 pb-20 page-transition">
      <div className="flex items-center gap-6 mb-12 mt-4">
        <h1 className="text-4xl md:text-6xl font-sports font-bold uppercase tracking-tighter">
          Aktuality
        </h1>
        <div className="h-[2px] flex-grow bg-gradient-to-r from-primary to-transparent" />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-32 bg-card rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {articles.map((article, idx) => (
            <ArticleCard key={idx} article={article} />
          ))}
        </div>
      )}
      
      {!loading && articles.length === 0 && (
        <div className="text-center py-20 opacity-40">
           <p className="text-xl font-sports italic">Žiadne novinky neboli nájdené.</p>
        </div>
      )}
    </div>
  );
};

export default News;

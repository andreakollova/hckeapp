import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types.ts';
import { ChevronRight } from 'lucide-react';
import { getArticleImage } from '../utils/helpers.ts';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured }) => {
  const imageUrl = getArticleImage(article);
  const articleUrl = article.url || '';
  const displayDate = String(article.date_text || article.date || "Dnes");
  const displayTitle = String(article.title || "Bez názvu");

  if (featured) {
    return (
      <Link 
        to={`/article?url=${encodeURIComponent(articleUrl)}`}
        className="group relative w-full h-[400px] overflow-hidden rounded-2xl block shrink-0"
      >
        <img 
          src={imageUrl} 
          alt={displayTitle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className="inline-block bg-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
            Aktualita
          </span>
          <h2 className="text-2xl md:text-3xl font-sports font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
            {displayTitle}
          </h2>
          <p className="text-white/60 text-sm font-medium">{displayDate}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/article?url=${encodeURIComponent(articleUrl)}`}
      className="group flex gap-4 p-3 bg-card rounded-xl hover:bg-card/80 transition-all border border-white/5"
    >
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden shrink-0">
        <img 
          src={imageUrl} 
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex flex-col justify-center flex-grow">
        <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">{displayDate}</p>
        <h3 className="text-sm sm:text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {displayTitle}
        </h3>
        <div className="mt-2 flex items-center text-xs text-white/40 font-medium">
          Čítať viac <ChevronRight size={14} className="ml-1" />
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
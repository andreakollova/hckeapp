
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api.ts';
import { HomeData, Match } from '../types.ts';
import MatchCard from '../components/MatchCard.tsx';
import ArticleCard from '../components/ArticleCard.tsx';
import { RefreshCcw, Loader2, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getArticleImage, parseSlovakDate, formatSlovakDate } from '../utils/helpers.ts';

const Home: React.FC = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const homeData = await apiService.getHomeData();
      if (homeData) {
        setData(homeData);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Home Fetch Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-dark">
        <div className="relative">
          <Loader2 size={60} className="text-primary animate-spin" />
          <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse" />
        </div>
        <p className="font-sports uppercase tracking-[0.3em] text-white/40 text-sm italic mt-8 animate-pulse text-center px-4">Pripravujeme štadión...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center min-h-[80vh] bg-dark">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary shadow-glow">
          <RefreshCcw size={40} />
        </div>
        <h2 className="text-3xl font-sports font-bold uppercase mb-2">Chyba spojenia</h2>
        <p className="text-white/40 mb-8 max-w-xs">Nepodarilo sa načítať aktuálne dáta z klubu.</p>
        <button 
          onClick={fetchData}
          className="bg-primary hover:bg-secondary px-12 py-4 rounded-full font-sports font-bold uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95"
        >
          Skúsiť znova
        </button>
      </div>
    );
  }

  const upcoming_matches = Array.isArray(data.upcoming_matches) ? data.upcoming_matches : [];
  const played_matches = Array.isArray(data.played_matches) ? data.played_matches : [];
  
  // Spracovanie článkov s jednotným dátumom a radením
  const latest_articles = (Array.isArray(data.latest_articles) ? data.latest_articles : [])
    .map(art => {
      const parsedDate = parseSlovakDate(art.date_text || art.date);
      return {
        ...art,
        _timestamp: parsedDate ? parsedDate.getTime() : 0,
        _formattedDate: formatSlovakDate(parsedDate)
      };
    })
    .sort((a, b) => b._timestamp - a._timestamp);
  
  // LOGIKA PRE NAJBLIŽŠÍ ZÁPAS
  const now = Date.now();
  const allAvailableMatches = [...upcoming_matches, ...played_matches];
  
  const futureMatches = allAvailableMatches
    .map(m => {
      let matchDate = m.date_iso ? new Date(m.date_iso) : parseSlovakDate(m.date_text);
      return { ...m, _timestamp: matchDate && !isNaN(matchDate.getTime()) ? matchDate.getTime() : null };
    })
    .filter(m => m._timestamp !== null && m._timestamp > now)
    .sort((a, b) => (a._timestamp || 0) - (b._timestamp || 0));

  const nextMatch = futureMatches[0] || data.next_match || null;

  const heroArticle = latest_articles[0] || data.latest_article;
  const heroBg = heroArticle 
    ? getArticleImage(heroArticle) 
    : "https://images.unsplash.com/photo-1515703407324-5f753eed217b?q=80&w=1000&auto=format&fit=crop";

  const partners = [
    { name: 'U.S. Steel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/United_States_Steel_logo.svg/1280px-United_States_Steel_logo.svg.png' },
    { name: 'Košice', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Coat_of_Arms_of_Ko%C5%A1ice.svg/800px-Coat_of_Arms_of_Ko%C5%A1ice.svg.png' },
    { name: 'TIPOS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Tipos_logo.svg/2560px-Tipos_logo.svg.png' },
    { name: 'Slovenská sporiteľňa', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Slovensk%C3%A1_sporite%C4%BE%C5%88a_logo.svg/2560px-Slovensk%C3%A1_sporite%C4%BE%C5%88a_logo.svg.png' }
  ];

  return (
    <div className="pb-24 page-transition">
      <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Hero" className="w-full h-full object-cover opacity-40 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/20 via-dark/60 to-dark" />
        </div>
        
        <div className="relative z-10 px-4 py-16 max-w-5xl mx-auto w-full">
           <div className="flex flex-col items-center mb-12 text-center">
              <span className="bg-primary/20 text-primary border border-primary/40 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-6 backdrop-blur-md">Oficiálna aplikácia</span>
              <h1 className="text-6xl md:text-[8rem] font-sports font-black uppercase italic tracking-tighter mb-4 leading-[0.8] text-white text-glow">
                My sme <span className="text-primary">Košice</span>
              </h1>
           </div>

           {nextMatch ? (
             <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
               <MatchCard match={nextMatch} highlighted={true} />
             </div>
           ) : (
             <div className="bg-card/40 backdrop-blur-3xl border border-white/5 p-16 rounded-[3rem] text-center flex flex-col items-center gap-6 shadow-2xl">
                <CalendarDays size={48} className="text-primary/60" />
                <p className="font-sports text-2xl uppercase opacity-40 italic tracking-[0.3em]">Program ďalšieho kola čoskoro</p>
             </div>
           )}
        </div>
      </section>

      <section className="px-4 -mt-16 relative z-20 max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between mb-8 px-4">
          <h2 className="text-4xl md:text-7xl font-sports font-black uppercase tracking-tighter text-white leading-none">Novinky</h2>
          <Link to="/news" className="bg-white/10 hover:bg-primary px-8 py-3.5 rounded-2xl text-white font-sports font-black text-sm uppercase tracking-widest transition-all hover:shadow-glow">Archív</Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide snap-x px-4">
          {latest_articles.slice(0, 6).map((article, idx) => (
            <div key={idx} className="w-[85%] md:w-[60%] lg:w-[45%] shrink-0 snap-center">
              <ArticleCard article={article} featured />
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-card/20 border-y border-white/5 overflow-hidden">
        <div className="animate-marquee">
           {[...partners, ...partners].map((p, i) => (
             <div key={i} className="shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer px-12">
               <img src={p.logo} alt={p.name} className="h-10 md:h-14 w-auto object-contain" />
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

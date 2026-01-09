
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api.ts';
import { Match } from '../types.ts';
import MatchCard from '../components/MatchCard.tsx';
import { RefreshCcw, Search, Loader2 } from 'lucide-react';

const Matches: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'played'>('played');
  const [upcoming, setUpcoming] = useState<Match[]>([]);
  const [played, setPlayed] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMatches = async () => {
    setLoading(true);
    setError(false);
    try {
      const u = await apiService.getMatches('upcoming', 80);
      const p = await apiService.getMatches('played', 80);
      
      // Zoradenie VÝSLEDKOV (Played): Najnovší zápas (napr. 54. kolo) hore
      const sortedPlayed = [...p].sort((a, b) => {
        const dateA = a.date_iso ? new Date(a.date_iso).getTime() : 0;
        const dateB = b.date_iso ? new Date(b.date_iso).getTime() : 0;
        
        if (dateB !== dateA) return dateB - dateA;

        // Ak sú dátumy rovnaké, skúsime zoradiť podľa čísla kola
        const roundA = parseInt(a.round?.replace(/\D/g, '') || '0');
        const roundB = parseInt(b.round?.replace(/\D/g, '') || '0');
        return roundB - roundA;
      });

      // Zoradenie KALENDÁRA (Upcoming): Najbližší zápas hore
      const sortedUpcoming = [...u].sort((a, b) => {
        const dateA = a.date_iso ? new Date(a.date_iso).getTime() : 9999999999999;
        const dateB = b.date_iso ? new Date(b.date_iso).getTime() : 9999999999999;
        return dateA - dateB;
      });

      setUpcoming(sortedUpcoming);
      setPlayed(sortedPlayed);
      
      // Ak sú obe polia prázdne, nahlásime chybu len ak health check zlyhá
      if (u.length === 0 && p.length === 0) {
        const isHealthy = await apiService.getHealth();
        if (!isHealthy) setError(true);
      }
    } catch (err) {
      console.error("Fetch Matches Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const currentMatches = activeTab === 'upcoming' ? upcoming : played;
  
  const filteredMatches = currentMatches.filter(m => 
    (m.team_home || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.team_away || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.round || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 page-transition">
      <div className="mb-10 mt-6 text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-sports font-black uppercase tracking-tighter text-white">
          Program <span className="text-primary italic">Zápasov</span>
        </h1>
      </div>

      <div className="space-y-4 mb-10">
        <div className="flex bg-card/60 backdrop-blur-md p-1.5 rounded-3xl border border-white/5 shadow-xl">
          <button 
            onClick={() => { setActiveTab('played'); setSearchQuery(''); }}
            className={`flex-1 py-4 font-sports font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 ${
              activeTab === 'played' ? 'bg-primary text-white shadow-glow' : 'text-white/30 hover:text-white/50'
            }`}
          >Výsledky</button>
          <button 
            onClick={() => { setActiveTab('upcoming'); setSearchQuery(''); }}
            className={`flex-1 py-4 font-sports font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 ${
              activeTab === 'upcoming' ? 'bg-primary text-white shadow-glow' : 'text-white/30 hover:text-white/50'
            }`}
          >Kalendár</button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/30">
            <Search size={18} />
          </div>
          <input 
            type="text"
            placeholder="Hľadať súpera alebo kolo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all font-bold uppercase tracking-widest text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="text-primary animate-spin" />
          <span className="font-sports text-white/20 uppercase tracking-widest text-xs">Načítavam zápasy...</span>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-card/30 rounded-[3rem] border border-white/5">
          <RefreshCcw size={48} className="mx-auto text-primary/40 mb-6" />
          <h3 className="text-2xl font-sports font-black uppercase mb-4">Nepodarilo sa načítať dáta</h3>
          <button onClick={fetchMatches} className="bg-primary px-10 py-3 rounded-full font-sports font-black uppercase shadow-glow">Skúsiť znova</button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match, idx) => (
              <div key={idx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
                <MatchCard match={match} />
              </div>
            ))
          ) : (
            <div className="text-center py-24 opacity-30">
              <p className="text-2xl font-sports font-black uppercase italic tracking-widest">Žiadne zápasy nenájdené</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Matches;

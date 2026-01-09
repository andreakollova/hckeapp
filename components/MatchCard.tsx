
import React from 'react';
import { Match } from '../types.ts';
import { Trophy, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { normalizeImgUrl, calculateTotalScore } from '../utils/helpers.ts';

interface MatchCardProps {
  match: Match;
  highlighted?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, highlighted }) => {
  if (!match) return null;

  const isPlayed = match.status === 'played';
  const kosiceLogo = "https://upload.wikimedia.org/wikipedia/en/thumb/7/75/HC_Ko%C5%A1ice_logo.svg/1044px-HC_Ko%C5%A1ice_logo.svg.png";

  const homeName = String(match.team_home || "HC Košice");
  const awayName = String(match.team_away || "Súper");
  
  // Detekcia výhry
  const isWin = match.is_win === 1 || match.match_is_win === 1 || match.is_win === true || match.match_is_win === true;
  
  // Robustné zobrazenie skóre
  let scoreDisplay = "VS";
  if (isPlayed) {
    // 1. Skúsime vypočítať skóre zo všetkých tretín (najpresnejšie)
    const calculatedScore = calculateTotalScore(match.score_periods);
    
    if (calculatedScore) {
      scoreDisplay = calculatedScore;
    } else {
      // 2. Ak nevyšlo, skúsime priame skóre z API (pokiaľ to nie je len "win/lose")
      const rawScore = match.score || match.match_score;
      if (rawScore && !['win', 'lose'].includes(rawScore.toLowerCase())) {
        scoreDisplay = rawScore;
      } else {
        scoreDisplay = "–";
      }
    }
  }

  const matchDate = String(match.date_text || "Termín v riešení");
  const homeLogo = normalizeImgUrl(match.logo_home_url || (homeName.toLowerCase().includes('košice') ? kosiceLogo : null));
  const awayLogo = normalizeImgUrl(match.logo_away_url || (awayName.toLowerCase().includes('košice') ? kosiceLogo : null));

  return (
    <div className={`relative rounded-[2.5rem] border transition-all duration-500 group ${
      highlighted 
        ? 'bg-gradient-to-br from-primary/30 via-card to-card border-primary/40 p-6 md:p-8 pt-14 md:pt-16 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(244,108,36,0.2)] mt-12' 
        : 'bg-card/40 backdrop-blur-md border-white/5 p-4 md:p-8 overflow-hidden hover:border-primary/20 hover:bg-card/60'
    }`}>
      {highlighted && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-primary text-white px-8 py-2.5 rounded-b-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-glow border-x border-b border-white/20">
            Najbližší zápas
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40">
          <Trophy size={14} className="text-primary" />
          <span>{String(match.round || 'Tipsport Extraliga')}</span>
        </div>
        
        {isPlayed && (
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${
            isWin 
              ? 'bg-green-500/10 border-green-500/30 text-green-500' 
              : 'bg-red-500/10 border-red-500/30 text-red-500'
          }`}>
            {isWin ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {isWin ? 'VÝHRA' : 'PREHRA'}
          </div>
        )}

        <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-white/40 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
          <Clock size={14} className="text-primary" />
          <span>{matchDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 relative">
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="w-16 h-16 md:w-28 md:h-28 bg-white rounded-full p-3 flex items-center justify-center border-2 border-primary/10 shadow-2xl overflow-hidden mb-4 transition-all group-hover:scale-105 group-hover:border-primary/40">
             <img src={homeLogo} alt={homeName} className="w-full h-auto object-contain" />
          </div>
          <span className="text-[11px] md:text-lg font-sports font-black text-center uppercase tracking-tight truncate w-full group-hover:text-primary transition-colors">{homeName}</span>
        </div>

        <div className="flex flex-col items-center shrink-0 px-2 min-w-[100px] md:min-w-[150px]">
          <div className="text-center">
            <div className={`font-sports font-black italic tracking-tighter transition-all duration-300 ${
              scoreDisplay === 'VS' 
                ? 'text-2xl md:text-5xl text-primary bg-primary/10 px-6 py-2 rounded-2xl' 
                : 'text-4xl md:text-[5rem] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] leading-none'
            }`}>
              {scoreDisplay}
            </div>
            {isPlayed && match.score_periods && (
              <div className="mt-3">
                <div className="text-[9px] md:text-sm font-bold text-primary/80 tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded-full inline-block border border-white/5 whitespace-nowrap">
                  {match.score_periods}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="w-16 h-16 md:w-28 md:h-28 bg-white rounded-full p-3 flex items-center justify-center border-2 border-primary/10 shadow-2xl overflow-hidden mb-4 transition-all group-hover:scale-105 group-hover:border-primary/40">
             <img src={awayLogo} alt={awayName} className="w-full h-auto object-contain" />
          </div>
          <span className="text-[11px] md:text-lg font-sports font-black text-center uppercase tracking-tight truncate w-full group-hover:text-primary transition-colors">{awayName}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;


import { Article } from '../types';

const CLUB_BASE_URL = "https://www.hckosice.sk";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1515703407324-5f753eed217b?q=80&w=1000&auto=format&fit=crop";

const monthsNominative = [
  'január', 'február', 'marec', 'apríl', 'máj', 'jún',
  'júl', 'august', 'september', 'október', 'november', 'december'
];

const monthsGenitive = [
  'januára', 'februára', 'marca', 'apríla', 'mája', 'júna',
  'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'
];

/**
 * Prevedie slovenský textový dátum (rôzne formáty) na Date objekt.
 */
export function parseSlovakDate(dateText?: string): Date | null {
  if (!dateText) return null;
  
  // Očistenie od balastu ako "PRIDANÉ", "aktualizované" a pod.
  let cleanText = dateText.toLowerCase()
    .replace(/pridané\s*/g, '')
    .replace(/aktualizované\s*/g, '')
    .trim();
  
  const monthsMap: Record<string, number> = {};
  monthsNominative.forEach((m, i) => monthsMap[m] = i);
  monthsGenitive.forEach((m, i) => monthsMap[m] = i);
  
  // 1. Skúsime formát s textovým mesiacom: "11. január 2026" alebo "11. januára 2026"
  const textMatch = cleanText.match(/(\d+)\.\s*([a-záčéíľňóŕšťúýž]+)\s*(\d{4})/);
  if (textMatch) {
    const day = parseInt(textMatch[1], 10);
    const monthName = textMatch[2];
    const year = parseInt(textMatch[3], 10);
    const month = monthsMap[monthName];
    
    if (month !== undefined) {
      const timeMatch = cleanText.match(/(\d{1,2}):(\d{2})/);
      const hours = timeMatch ? parseInt(timeMatch[1], 10) : 12;
      const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 0;
      return new Date(year, month, day, hours, minutes);
    }
  }

  // 2. Skúsime numerický formát: "8.1.2026" alebo "08. 01. 2026"
  const numMatch = cleanText.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/);
  if (numMatch) {
    const day = parseInt(numMatch[1], 10);
    const month = parseInt(numMatch[2], 10) - 1; // JS mesiace sú 0-11
    const year = parseInt(numMatch[3], 10);
    
    const timeMatch = cleanText.match(/(\d{1,2}):(\d{2})/);
    const hours = timeMatch ? parseInt(timeMatch[1], 10) : 12;
    const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 0;
    
    return new Date(year, month, day, hours, minutes);
  }

  return null;
}

/**
 * Zjednotí formát dátumu na "d. mesiaca yyyy"
 */
export function formatSlovakDate(date: Date | null): string {
  if (!date || isNaN(date.getTime())) return "Dnes";
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  return `${day}. ${monthsGenitive[monthIndex]} ${year}`;
}

export function normalizeImgUrl(u?: string | null): string {
  if (!u || typeof u !== 'string' || u.trim() === "" || u === "null") return FALLBACK_IMG;
  
  let target = u.trim();
  if (target.toLowerCase().includes('<img')) {
    const m = target.match(/src=["']?([^"'\s>]+)["']?/i);
    if (m && m[1]) target = m[1];
  }

  if (target.startsWith("//")) return "https:" + target;
  if (target.startsWith("/")) return CLUB_BASE_URL + target;
  if (!target.startsWith("http")) return FALLBACK_IMG;
  return target;
}

export function getArticleImage(article: Article): string {
  if (!article) return FALLBACK_IMG;
  const rawImage = article.card_image_url || article.header_image_url || article.image;
  return normalizeImgUrl(rawImage);
}

export function calculateTotalScore(scorePeriods: string | undefined): string | null {
  if (!scorePeriods) return null;
  
  const regex = /(\d+)\s*:\s*(\d+)/g;
  let match;
  let homeTotal = 0;
  let awayTotal = 0;
  let found = false;

  while ((match = regex.exec(scorePeriods)) !== null) {
    homeTotal += parseInt(match[1], 10);
    awayTotal += parseInt(match[2], 10);
    found = true;
  }

  return found ? `${homeTotal}:${awayTotal}` : null;
}

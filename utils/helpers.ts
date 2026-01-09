
import { Article } from '../types';

const CLUB_BASE_URL = "https://www.hckosice.sk";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1515703407324-5f753eed217b?q=80&w=1000&auto=format&fit=crop";

export function normalizeImgUrl(u?: string | null): string {
  if (!u || typeof u !== 'string' || u.trim() === "" || u === "null") return FALLBACK_IMG;
  
  let target = u.trim();
  // Ak je to celý <img src="..."> string, vytiahneme len src
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

/**
 * Vypočíta finálne skóre sčítaním všetkých tretín v stringu.
 * Príklad: "(2:1, 1:1, 1:4)" -> "4:6"
 */
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

export function parseScore(input: unknown) {
  const text = String(input ?? "");
  const numMatch = text.match(/(\d+)\s*:\s*(\d+)/);
  if (numMatch) {
    return { home: parseInt(numMatch[1]), away: parseInt(numMatch[2]), periodsText: null };
  }
  return { home: null, away: null, periodsText: null };
}

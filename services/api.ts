
import { Article, Match, HomeData } from '../types';

const BASE_URL = 'https://projekthcapp.onrender.com';

async function fetchApi(path: string): Promise<any> {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error(`[API] Error:`, e);
    return null;
  }
}

function extractItems<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.items && Array.isArray(data.items)) return data.items;
  if (data.data && Array.isArray(data.data)) return data.data;
  const firstArray = Object.values(data).find(val => Array.isArray(val));
  if (firstArray) return firstArray as T[];
  return [];
}

export const apiService = {
  async getHomeData(): Promise<HomeData | null> {
    try {
      // Zvyšujeme limit na 50, aby sme predišli vynechaniu najbližšieho zápasu kvôli paginácii
      const [articles, upcoming, played] = await Promise.all([
        this.getArticles(10).catch(() => []),
        this.getMatches('upcoming', 50).catch(() => []),
        this.getMatches('played', 50).catch(() => [])
      ]);

      if (articles.length === 0 && upcoming.length === 0 && played.length === 0) {
        return null;
      }

      return {
        next_match: upcoming[0] || played[0],
        latest_article: articles[0] || null,
        latest_articles: articles,
        upcoming_matches: upcoming,
        played_matches: played
      };
    } catch (error) {
      return null;
    }
  },

  async getArticles(limit = 10): Promise<Article[]> {
    const data = await fetchApi(`/articles?limit=${limit}`);
    return extractItems<Article>(data);
  },

  async getArticleDetail(articleUrl: string): Promise<Article | null> {
    const data = await fetchApi(`/articles/by-url?url=${encodeURIComponent(articleUrl)}`);
    if (!data) return null;
    return data.item || data.article || data;
  },

  async getMatches(status: 'upcoming' | 'played', limit = 20): Promise<Match[]> {
    const data = await fetchApi(`/matches?status=${status}&limit=${limit}`);
    return extractItems<Match>(data);
  },

  async getHealth(): Promise<boolean> {
    const data = await fetchApi('/health');
    return data !== null;
  }
};

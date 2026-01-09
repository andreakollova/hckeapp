
export interface Article {
  title: string;
  url: string;
  header_image_url?: string;
  card_image_url?: string;
  date_text?: string;
  content_text?: string;
  content_html?: string;
  // Fallbacks
  date?: string;
  image?: string;
}

export interface Match {
  id?: string | number;
  team_home: string;
  team_away: string;
  logo_home_url?: string;
  logo_away_url?: string;
  score?: string;
  match_score?: string;
  is_win?: boolean | number;
  match_is_win?: boolean | number;
  score_periods?: string;
  date_text: string;
  date_iso?: string; // Pridané pre radenie
  match_time?: string;
  venue?: string;
  round?: string;
  status: 'upcoming' | 'played' | 'live';
}

export interface HomeData {
  next_match?: Match;
  latest_article?: Article;
  latest_articles?: Article[];
  upcoming_matches?: Match[];
  played_matches?: Match[];
}

export interface ApiResponse<T> {
  items: T;
  success: boolean;
}

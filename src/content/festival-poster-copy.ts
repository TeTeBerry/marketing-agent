export type FestivalPosterGuideItem = {
  heading: string;
  subtitle: string;
};

export type FestivalPosterCopy = {
  sectionTitle: string;
  separator: string;
  lineupHeading: string;
  guideItems: FestivalPosterGuideItem[];
  follow: string;
  tagline: string;
};

const EN_COPY: FestivalPosterCopy = {
  sectionTitle: 'Festival Travel Guide',
  separator: '━━━━━━━━━━━━',
  lineupHeading: '🎧 LINEUP HIGHLIGHTS',
  guideItems: [
    {
      heading: '🏨 STAY',
      subtitle: 'Hotels & best areas near the festival',
    },
    {
      heading: '✈️ TRAVEL',
      subtitle: 'Flights · Transport · Planning',
    },
    {
      heading: '💰 BUDGET',
      subtitle: 'Estimated trip cost guide',
    },
  ],
  follow: 'FOLLOW @RAVEN',
  tagline: "Your guide to the world's best festivals 🌎",
};

const ZH_COPY: FestivalPosterCopy = {
  sectionTitle: '电音节旅行指南',
  separator: '━━━━━━━━━━━━',
  lineupHeading: '🎧 阵容亮点',
  guideItems: [
    {
      heading: '🏨 住宿',
      subtitle: '音乐节周边酒店与推荐区域',
    },
    {
      heading: '✈️ 交通',
      subtitle: '航班 · 当地交通 · 行程规划',
    },
    {
      heading: '💰 预算',
      subtitle: '预估旅行花费参考',
    },
  ],
  follow: '关注 @RAVEN',
  tagline: '带你打卡全球电音节 🌎',
};

export function getFestivalPosterCopy(language: string): FestivalPosterCopy {
  return language.toLowerCase().startsWith('zh') ? ZH_COPY : EN_COPY;
}

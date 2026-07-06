export type FestivalPosterCopy = {
  sectionTitle: string;
  lineupHeading: string;
  guideItems: string[];
  follow: string;
  tagline: string;
};

const EN_COPY: FestivalPosterCopy = {
  sectionTitle: 'Festival Travel Guide',
  lineupHeading: '🎧 Lineup Highlights',
  guideItems: [
    '🏨 Where To Stay',
    '✈️ How To Get There',
    '💰 Trip Budget Guide',
    '🎟️ Festival Tips',
  ],
  follow: 'Follow @Raven',
  tagline: "Your guide to the world's best festivals 🌎",
};

const ZH_COPY: FestivalPosterCopy = {
  sectionTitle: '电音节旅行指南',
  lineupHeading: '🎧 阵容亮点',
  guideItems: [
    '🏨 住宿推荐',
    '✈️ 交通攻略',
    '💰 预算参考',
    '🎟️ 现场贴士',
  ],
  follow: '关注 @Raven',
  tagline: '带你打卡全球电音节 🌎',
};

export function getFestivalPosterCopy(language: string): FestivalPosterCopy {
  return language.toLowerCase().startsWith('zh') ? ZH_COPY : EN_COPY;
}

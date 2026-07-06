export type SyncWebHomeCopy = {
  heroLead: string;
  plannerTitle: string;
  plannerLead: string;
  imagePlaceholder: string;
  tabs: {
    trip: string;
    budget: string;
    timeline: string;
    packing: string;
  };
  trip: {
    flightLabel: string;
    hotelLabel: string;
    shuttleLabel: string;
    shuttleDetail: string;
    hotelDetail: string;
  };
  budget: {
    perPerson: string;
    items: string[];
  };
  packing: {
    essentialsLabel: string;
    essentials: string[];
  };
  footerTagline: string;
};

const EN_COPY: SyncWebHomeCopy = {
  heroLead:
    'AI helps you discover festivals, plan trips, and split costs — travel with your crew.',
  plannerTitle: 'Your trip dashboard',
  plannerLead: 'Trip plan, budget, timeline, packing, and calendar in one view.',
  imagePlaceholder: '<!-- Insert your cover image here -->',
  tabs: {
    trip: 'Trip Plan',
    budget: 'Budget',
    timeline: 'Timeline',
    packing: 'Packing',
  },
  trip: {
    flightLabel: 'Flight',
    hotelLabel: 'Hotel',
    shuttleLabel: 'Shuttle',
    shuttleDetail: 'Daily shuttle · hotel ↔ festival site',
    hotelDetail: '2 nights · shuttle included',
  },
  budget: {
    perPerson: 'Per person',
    items: [
      'Festival ticket',
      'Flights',
      'Hotel',
      'Shuttle & local transit',
      'Food & misc',
    ],
  },
  packing: {
    essentialsLabel: 'Essentials',
    essentials: [
      'Passport / ID',
      'Ticket QR codes',
      'Waterproof phone pouch',
      'Power bank',
    ],
  },
  footerTagline: 'Less planning. More floor time.',
};

const ZH_COPY: SyncWebHomeCopy = {
  heroLead: 'AI 帮你发现电音节、排行程、算预算——和朋友组队出发。',
  plannerTitle: '你的出行面板',
  plannerLead: '行程、预算、时间线、行李、日历，一次看清。',
  imagePlaceholder: '<!-- 在此插入封面图 -->',
  tabs: {
    trip: '行程',
    budget: '预算',
    timeline: '时间线',
    packing: '行李',
  },
  trip: {
    flightLabel: '航班',
    hotelLabel: '酒店',
    shuttleLabel: '接驳',
    shuttleDetail: '每日接驳 · 酒店 ↔ 电音节场地',
    hotelDetail: '2 晚 · 含接驳',
  },
  budget: {
    perPerson: '人均预算',
    items: ['电音节门票', '机票', '酒店', '接驳与本地交通', '餐饮与其他'],
  },
  packing: {
    essentialsLabel: '必备',
    essentials: ['护照 / 身份证件', '电子票 QR 码', '防水手机袋', '充电宝'],
  },
  footerTagline: '少做攻略，多蹦几场。',
};

export function getSyncWebHomeCopy(language: string): SyncWebHomeCopy {
  return language.toLowerCase().startsWith('zh') ? ZH_COPY : EN_COPY;
}

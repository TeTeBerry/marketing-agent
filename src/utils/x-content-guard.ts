export const X_PROMOTIONAL_PATTERNS: RegExp[] = [
  /\bdiscover raven\b/i,
  /\bjoin raven\b/i,
  /\btry raven\b/i,
  /\bplan smarter with raven\b/i,
  /\bplan your next festival\b/i,
  /\bsign up\b/i,
  /\bdownload\b/i,
];

export function isPromotionalXContent(content: string): boolean {
  return X_PROMOTIONAL_PATTERNS.some((pattern) => pattern.test(content));
}

export const X_PROMO_WARNING =
  '⚠️ X content looks promotional. Please regenerate.';

export const X_FOUNDER_NOTE =
  'This is for founder/build-in-public, not official marketing.';

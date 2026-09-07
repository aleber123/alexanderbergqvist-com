// Single source of truth for the developer's `sameAs` profile links.
//
// Why this exists: three pages each declared a DIFFERENT subset (SEO.astro had
// only GitHub, /om and /press had only the App Store page). Search engines use
// sameAs to consolidate scattered mentions into one entity — inconsistent lists
// weaken exactly the signal they're meant to strengthen. Declare once, use
// everywhere.
//
// Only add URLs that are verified to exist and that are actually controlled by
// the same person. An invented or dead profile link is worse than none.
export const SAME_AS = [
  'https://apps.apple.com/se/developer/alexander-bergqvist/id1830340527',
  'https://github.com/aleber123',
];

export const PERSON_NAME = 'Alexander Bergqvist';
export const PERSON_EMAIL = 'alexander.bergqvist@gmail.com';
export const PERSON_JOB_TITLE = 'Indie iOS-utvecklare';

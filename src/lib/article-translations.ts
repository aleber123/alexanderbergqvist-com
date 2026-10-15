/**
 * hreflang + "other languages" for articles — see data/article-translations.ts.
 */
import type { CollectionEntry } from 'astro:content';
import { ARTICLE_TRANSLATIONS } from '../data/article-translations';
import { LOCALE_BCP47, LOCALE_LABELS, articleUrl, type Locale } from '../i18n/locales';

const SITE = 'https://alexanderbergqvist.com';

type Article = CollectionEntry<'articles'>;

export interface ArticleTranslation {
  lang: Locale | 'sv';
  label: string;
  title: string;
  path: string;
}

/** All versions of `article` (including itself), Swedish first. Validates
 *  the groups against the collection, so a typo fails the build instead
 *  of silently emitting a broken hreflang. */
export function articleTranslations(article: Article, all: Article[]): ArticleTranslation[] {
  const byId = new Map(all.map((a) => [a.id, a]));
  for (const group of ARTICLE_TRANSLATIONS) {
    const langs = new Set<string>();
    for (const id of group) {
      const a = byId.get(id);
      if (!a) throw new Error(`article-translations: unknown or draft article "${id}"`);
      if (langs.has(a.data.lang)) throw new Error(`article-translations: two ${a.data.lang} articles in group with "${id}"`);
      langs.add(a.data.lang);
    }
  }
  const group = ARTICLE_TRANSLATIONS.find((g) => g.includes(article.id));
  const members = group ? group.map((id) => byId.get(id)!) : [article];
  return members
    .map((a) => ({
      lang: a.data.lang,
      label: LOCALE_LABELS[a.data.lang],
      title: a.data.title,
      path: articleUrl(a.id, a.data.app, a.data.lang),
    }))
    .sort((a, b) => (a.lang === 'sv' ? -1 : b.lang === 'sv' ? 1 : 0));
}

/** BCP-47 → absolute URL map for SEO.astro's hreflangAlternates. */
export function hreflangMap(versions: ArticleTranslation[]): Record<string, string> | undefined {
  if (versions.length < 2) return undefined;
  return Object.fromEntries(versions.map((v) => [LOCALE_BCP47[v.lang], SITE + v.path]));
}

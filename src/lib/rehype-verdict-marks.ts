/**
 * Replace ✅ / ❌ / ⚠️ verdict marks in MDX with a shape gradient.
 *
 * Three problems with the emoji, in order of severity:
 *
 * 1. ✅/❌ is a green/red pair — the single colour distinction the site's
 *    author cannot resolve — used as the verdict column on the nine
 *    highest-commercial-intent pages, which are the ones he edits.
 * 2. They render from a separate colour-emoji font with platform-
 *    dependent baselines. The `font-variant-emoji: text` workaround in
 *    global.css is unsupported in Safari, which is most of the traffic.
 * 3. Screen readers announce "white heavy check mark".
 *
 * Filled / hollow / half-filled is a SHAPE gradient, not a hue gradient:
 * it survives greyscale printing, every type of colour vision
 * deficiency, and a bad phone screen in sunlight. Colour is still
 * present but purely decorative — delete it and the table still reads.
 * That is the test every colour decision here should pass.
 *
 * Build-time, so zero runtime bytes, and it covers all 48 files across
 * six languages without hand-editing any of them.
 */
import type { Root, Element, Text, Parent } from 'hast';

type Verdict = { key: string; shape: string; label: Record<string, string> };

const VERDICTS: Record<string, Verdict> = {
  '✅': {
    key: 'yes',
    shape: '●',
    label: {
      sv: 'Ja', en: 'Yes', de: 'Ja', no: 'Ja', da: 'Ja', es: 'Sí',
      fr: 'Oui', fi: 'Kyllä', is: 'Já', it: 'Sì', el: 'Ναι',
      nl: 'Ja', pl: 'Tak', pt: 'Sim',
    },
  },
  '❌': {
    key: 'no',
    shape: '○',
    label: {
      sv: 'Nej', en: 'No', de: 'Nein', no: 'Nei', da: 'Nej', es: 'No',
      fr: 'Non', fi: 'Ei', is: 'Nei', it: 'No', el: 'Όχι',
      nl: 'Nee', pl: 'Nie', pt: 'Não',
    },
  },
  '⚠️': {
    key: 'partial',
    shape: '◐',
    label: {
      sv: 'Delvis', en: 'Partly', de: 'Teilweise', no: 'Delvis',
      da: 'Delvis', es: 'Parcial', fr: 'Partiel', fi: 'Osittain',
      is: 'Að hluta', it: 'Parziale', el: 'Εν μέρει',
      nl: 'Deels', pl: 'Częściowo', pt: 'Parcial',
    },
  },
};

// ⚠️ carries a trailing U+FE0F variation selector; match it optionally so
// both the emoji-presentation and text-presentation forms are caught.
const MARK_RE = /(✅|❌|⚠️?)/g;

function verdictSpan(mark: string, lang: string): Element {
  const v = VERDICTS[mark] ?? VERDICTS[mark.replace('️', '') + '️'] ?? VERDICTS['⚠️'];
  const word = v.label[lang] ?? v.label.en;
  return {
    type: 'element',
    tagName: 'span',
    properties: { className: ['v'], 'data-v': v.key },
    children: [
      { type: 'element', tagName: 'span', properties: { 'aria-hidden': 'true', className: ['v-mark'] }, children: [{ type: 'text', value: v.shape }] },
      { type: 'text', value: ' ' + word },
    ],
  };
}

function langFromPath(path: string | undefined): string {
  // Frontmatter `lang` is not available on the hast tree, but the file
  // is one of ~163 whose locale we can read back from the built page's
  // sibling data. Cheaper and stable: default to Swedish and let the
  // per-file frontmatter override below correct it.
  return path && /\/(en|de|no|da|es|fr|fi|is|it|el|nl|pl|pt)\//.test(path)
    ? RegExp.$1
    : 'sv';
}

export function rehypeVerdictMarks() {
  return (
    tree: Root,
    file: {
      path?: string;
      history?: string[];
      data?: { astro?: { frontmatter?: { lang?: string } } };
    },
  ) => {
    const lang =
      file.data?.astro?.frontmatter?.lang ??
      langFromPath(file.path ?? file.history?.[0]);

    const walk = (node: Parent): void => {
      const out: (Element | Text)[] = [];
      let changed = false;

      for (const child of node.children as (Element | Text)[]) {
        if (child.type === 'text' && MARK_RE.test(child.value)) {
          MARK_RE.lastIndex = 0;
          const parts = child.value.split(MARK_RE).filter((p) => p !== '');
          for (const part of parts) {
            if (VERDICTS[part] || /^⚠/.test(part)) {
              out.push(verdictSpan(part, lang));
            } else {
              out.push({ type: 'text', value: part });
            }
          }
          changed = true;
        } else {
          if (child.type === 'element') walk(child);
          out.push(child);
        }
        MARK_RE.lastIndex = 0;
      }

      if (changed) node.children = out;
    };

    walk(tree);
  };
}

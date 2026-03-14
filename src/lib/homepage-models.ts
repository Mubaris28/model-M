/** Fixed model names for homepage sections (order = display order). Each entry can be a string or array of variants so DB spellings still match. */
export const NEW_FACES_NAMES: (string | string[])[] = [
  "Ophélie Philogène",
  "Moutoucomarapoule Ladli",
  "Emmy Kelianne Durhône",
  ["HOAREAU Léanne", "Léanne HOAREAU", "Leanne Hoareau", "Rosedeleanne", "Rose de Leanne"],
  "Miles Williams",
  ["Mary Grace Tracy John", "Mary Grace", "Tracy John", "Mary Grace Tracy"],
];
export const TRENDING_NAMES = [
  "Ritisha Khedoo",
  "Gulbul Mary-keth Taylor Alicia Goder",
  "Kiara Delnard",
  "Samanta Luchoo",
  "Lea Ferhat-Huckel",
  "Victoria Ruth Claire Walys Philippe",
];
export const LATEST_MODELS_COUNT = 16;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** Words (length > 2) from target that appear in model name (or vice versa). */
function matchingWordCount(modelName: string, target: string): number {
  const modelWords = normalize(modelName).split(/\s+/).filter(Boolean);
  const targetWords = normalize(target).split(/\s+/).filter((w) => w.length > 2);
  let count = 0;
  for (const tw of targetWords) {
    const inModel = modelWords.some((mw) => mw.includes(tw) || tw.includes(mw));
    if (inModel) count++;
  }
  return count;
}

/** True if model name matches target: exact normalized match, or enough word overlap (≥2 words for 2+ word targets to avoid wrong matches). */
function partialMatch(modelName: string, target: string): boolean {
  const n = normalize(modelName);
  const t = normalize(target);
  if (n === t) return true;
  const targetWords = t.split(/\s+/).filter((w) => w.length > 2);
  const minRequired = targetWords.length >= 2 ? 2 : 1;
  return matchingWordCount(modelName, target) >= minRequired;
}

function nameMatchesModel(
  m: { username?: string; fullName?: string },
  name: string
): boolean {
  return (
    partialMatch(m.username || "", name) ||
    partialMatch(m.fullName || "", name) ||
    normalize(m.username || "") === normalize(name) ||
    normalize(m.fullName || "") === normalize(name)
  );
}

type OrderByNamesOptions = { onlyMatched?: boolean };

/**
 * Order models so that those matching `orderNames` appear first in that order.
 * Each entry in orderNames can be a string or string[] of variants.
 * If onlyMatched is true, returns only those that matched (no fill-in from rest).
 */
export function orderByNames<T extends { _id: string; username?: string; fullName?: string }>(
  list: T[],
  orderNames: (string | string[])[],
  options?: OrderByNamesOptions
): T[] {
  const ordered: T[] = [];
  const used = new Set<string>();
  for (const nameOrVariants of orderNames) {
    const variants = Array.isArray(nameOrVariants) ? nameOrVariants : [nameOrVariants];
    const found = list.find(
      (m) => !used.has(m._id) && variants.some((name) => nameMatchesModel(m, name))
    );
    if (found) {
      ordered.push(found);
      used.add(found._id);
    }
  }
  if (options?.onlyMatched) return ordered;
  const rest = list.filter((m) => !used.has(m._id));
  return [...ordered, ...rest];
}

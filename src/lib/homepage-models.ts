/** Fixed model names for homepage sections (order = display order). Matching is partial — any word in the model's username or fullName matching any word in the target name. */
export const NEW_FACES_NAMES = [
  "Ophélie Philogène",
  "Moutoucomarapoule Ladli",
  "Emmy Kelianne Durhône",
  "HOAREAU Léanne",
  "Miles Williams",
  "Mary Grace Tracy John",
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

/** True if any word of `modelName` appears in `target` words (case/accent-insensitive). */
function partialMatch(modelName: string, target: string): boolean {
  const modelWords = normalize(modelName).split(/\s+/).filter(Boolean);
  const targetWords = normalize(target).split(/\s+/).filter(Boolean);
  // Match if modelName contains any word from target, or target contains any word from modelName
  return (
    modelWords.some((mw) => targetWords.some((tw) => tw.length > 2 && (mw.includes(tw) || tw.includes(mw)))) ||
    targetWords.some((tw) => modelWords.some((mw) => mw.length > 2 && (tw.includes(mw) || mw.includes(tw))))
  );
}

/**
 * Order models so that those whose username or fullName partially matches any name in `orderNames`
 * appear first (in the order they appear in `orderNames`), then the rest follow.
 */
export function orderByNames<T extends { _id: string; username?: string; fullName?: string }>(
  list: T[],
  orderNames: string[]
): T[] {
  const ordered: T[] = [];
  const used = new Set<string>();
  for (const name of orderNames) {
    const found = list.find(
      (m) =>
        !used.has(m._id) &&
        (partialMatch(m.username || "", name) ||
          partialMatch(m.fullName || "", name) ||
          // Also try exact lowercase match as a fallback
          normalize(m.username || "") === normalize(name) ||
          normalize(m.fullName || "") === normalize(name))
    );
    if (found) {
      ordered.push(found);
      used.add(found._id);
    }
  }
  const rest = list.filter((m) => !used.has(m._id));
  return [...ordered, ...rest];
}

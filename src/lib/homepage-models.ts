/** Fixed model names for homepage sections (order = display order). Match by username or fullName (case-insensitive). */
export const NEW_FACES_NAMES = ["OPHELIE", "LADLI", "EMMY DRH", "ROSEDELEANNE", "MEGHA", "MILES"];
export const TRENDING_NAMES = ["RITISA", "MARY KETH", "LAKSHANA", "IVAN 09", "SAMANTA", "KIARA"];
export const LATEST_MODELS_COUNT = 16;

function nameMatches(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Order models so that those in `orderNames` appear first in that order, then the rest. */
export function orderByNames<T extends { _id: string; username?: string; fullName?: string }>(
  list: T[],
  orderNames: string[]
): T[] {
  const ordered: T[] = [];
  const used = new Set<string>();
  for (const name of orderNames) {
    const found = list.find((m) => nameMatches(m.username || "", name) || nameMatches(m.fullName || "", name));
    if (found && !used.has(found._id)) {
      ordered.push(found);
      used.add(found._id);
    }
  }
  const rest = list.filter((m) => !used.has(m._id));
  return [...ordered, ...rest];
}

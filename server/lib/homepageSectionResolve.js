import User from "../models/User.js";

export const MODEL_FIELDS =
  "_id fullName username profilePhoto portfolio categories country city height weight dressSize shoeSize gender dateOfBirth bio instagram role createdAt updatedAt";
export const MODEL_BASE = { status: "approved", profileComplete: true, role: "model" };

function normalizeName(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\u0300-\u036f/g, "")
    .trim();
}

function findOneByName(all, normQuery, usedIds) {
  let user = all.find(
    (u) =>
      !usedIds.has(u._id.toString()) &&
      (normQuery === normalizeName(u.username || "") || normQuery === normalizeName(u.fullName || ""))
  );
  if (user) return user;
  const words = normQuery.split(/\s+/).filter((w) => w.length >= 3);
  return (
    all.find((u) => {
      if (usedIds.has(u._id.toString())) return false;
      const un = normalizeName(u.username || "");
      const fn = normalizeName(u.fullName || "");
      return words.every((w) => un.includes(w) || fn.includes(w));
    }) || null
  );
}

export const NEW_FACES_USERNAMES = [
  "Ophélie Philogène",
  "Moutoucomarapoule Ladli",
  "Emmy Kelianne Durhône",
  ["HOAREAU Léanne", "HOAREAU LÉANNE", "Léanne HOAREAU", "Leanne Hoareau", "Rosedeleanne", "Rose de Leanne"],
  "Miles Williams",
  ["Mary Grace Tracy John", "Mary Grace", "Mary Grace Tracy"],
];

export const TRENDING_USERNAMES = [
  "Ritisha Khedoo",
  "Gulbul Mary-keth Taylor Alicia Goder",
  "Kiara Delnard",
  "Samanta Luchoo",
  "Lea Ferhat-Huckel",
  "Victoria Ruth Claire Walys Philippe",
];

export const CATEGORY_USERNAMES = {
  bold:       ["Lea Ferhat-Huckel"],
  bikini:     ["Gwendoline"],
  mature:     ["Chaland Geneviève"],
  glamour:    ["Megha Luchmun"],
  commercial: ["Victoria Ruth Claire Walys Philippe"],
  fitness:    ["Johanna Boyer"],
};

export function resolveWithVariants(all, nameOrVariantsList) {
  const result = [];
  const usedIds = new Set();
  for (const nameOrVariants of nameOrVariantsList) {
    const variants = Array.isArray(nameOrVariants) ? nameOrVariants : [nameOrVariants];
    let user = null;
    for (const q of variants) {
      const s = String(q).trim();
      if (!s) continue;
      user = findOneByName(all, normalizeName(s), usedIds);
      if (user) break;
    }
    if (user) {
      result.push(user);
      usedIds.add(user._id.toString());
    }
  }
  return result;
}

export function resolveNames(all, usernames) {
  const result = [];
  const usedIds = new Set();
  for (const name of usernames) {
    const q = String(name).trim();
    if (!q) continue;
    const user = findOneByName(all, normalizeName(q), usedIds);
    if (user) {
      result.push(user);
      usedIds.add(user._id.toString());
    }
  }
  return result;
}

async function getAllApproved() {
  return User.find({ ...MODEL_BASE }).select(MODEL_FIELDS).limit(300).lean();
}

export async function resolveNewFacesDefault() {
  const all = await getAllApproved();
  return resolveWithVariants(all, NEW_FACES_USERNAMES);
}

export async function resolveTrendingDefault() {
  const all = await getAllApproved();
  return resolveNames(all, TRENDING_USERNAMES);
}

export async function resolveCategoryDefault(slug) {
  const usernames = CATEGORY_USERNAMES[slug.toLowerCase()] || [];
  if (!usernames.length) return [];
  const all = await getAllApproved();
  return resolveNames(all, usernames);
}

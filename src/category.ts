import base64url from "base64url/dist/base64url";
import { deflate, inflate } from "pako";
import localForage from "localforage";

export interface Category {
  title: string;
  words: string[];
  custom?: boolean;
}

const separator = "|";

export const defaultCategories: Category[] = require("./defaultCategories.json");
export const defaultCategoriesByTitle = new Map<string, Category>();
for (const cat of defaultCategories) {
  defaultCategoriesByTitle.set(cat.title, cat);
}

export function canonicaliseCategory(categoryObj: Category): Category {
  categoryObj.title = categoryObj.title.trim();
  categoryObj.words = categoryObj.words
    .map(word => word.trim())
    .filter(x => !!x)
    .sort();
  return categoryObj;
}

export function categoryToString(categoryObj: Category): string {
  const canonicalCategory = canonicaliseCategory(categoryObj);
  return (
    canonicalCategory.title +
    separator +
    canonicalCategory.words.join(separator)
  );
}

export function stringToCategory(categoryString: string): Category {
  const words = categoryString.split(separator);
  const title = words.shift() || "";

  return {
    title,
    words
  };
}

export function compressCategory(categoryObj: Category): Uint8Array {
  const categoryString = categoryToString(categoryObj);
  const compressedCategoryString = new Buffer(deflate(categoryString));
  return compressedCategoryString;
}

export function decompressCategory(
  compressedCategoryString: Uint8Array
): Category {
  const decompressedBuffer = inflate(compressedCategoryString);
  const decompressedString = new Buffer(decompressedBuffer).toString();
  return stringToCategory(decompressedString);
}

export function encodeCategory(categoryObj: Category): string {
  return base64url.encode(new Buffer(compressCategory(categoryObj)));
}

export function decodeCategory(encodedCategory: string): Category {
  const base64decoded = base64url.toBuffer(encodedCategory);
  return decompressCategory(base64decoded);
}

function getStore(): LocalForage {
  return localForage.createInstance({
    name: "charades"
  });
}

async function getStoredCategoryTitles(): Promise<string[]> {
  const store = getStore();
  return store.getItem<string[]>("categoryTitles");
}

async function getStoredHashForCategory(
  categoryTitle: string
): Promise<string> {
  const store = getStore();
  return store.getItem<string>(`hash:${categoryTitle}`);
}

export async function getStoredCategory(categoryTitle): Promise<Category> {
  if (defaultCategoriesByTitle.get(categoryTitle)) {
    return defaultCategoriesByTitle.get(categoryTitle);
  }

  const store = getStore();
  const compressedCategoryString = await store.getItem<Uint8Array>(
    `full:${categoryTitle}`
  );
  return decompressCategory(compressedCategoryString);
}

export function getDefaultCategoryTitles(): string[] {
  const defaultTitles = defaultCategories.map(cat => cat.title);
  return defaultTitles.sort();
}

export async function getAvailableCategoryTitles(): Promise<string[]> {
  const storedTitles = await getStoredCategoryTitles();
  const defaultTitles = getDefaultCategoryTitles();
  return defaultTitles.sort();
}

export function compareCategory(cat1: Category, cat2: Category): boolean {
  if (cat1.title !== cat2.title) {
    return false;
  }

  if (cat1.words.length !== cat2.words.length) {
    return false;
  }

  for (let i = 0; i < cat1.words.length; ++i) {
    if (cat1.words[i] !== cat2.words[i]) {
      return false;
    }
  }

  return true;
}

export async function saveNewCategory(category: Category) {
  // Check if it's an existing one by checking the hash
}

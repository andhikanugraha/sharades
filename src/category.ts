export interface Category {
  title: string;
  words: string[];
}

const separator = "|";

export function canonicaliseCategory(categoryObj: Category): Category {
  categoryObj.title = categoryObj.title.trim();
  categoryObj.words = categoryObj.words
    .map((word) => word.trim())
    .filter((x) => !!x)
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
    words,
  };
}

async function compressCategory(categoryObj: Category): Promise<Uint8Array> {
  const { deflate } = await import("pako");
  const categoryString = categoryToString(categoryObj);
  const compressedCategoryString = new Buffer(deflate(categoryString));
  return compressedCategoryString;
}

async function decompressCategory(
  compressedCategoryString: Uint8Array
): Promise<Category> {
  const { inflate } = await import("pako");
  const decompressedBuffer = inflate(compressedCategoryString);
  const decompressedString = new Buffer(decompressedBuffer).toString();
  return stringToCategory(decompressedString);
}

export async function encodeCategory(categoryObj: Category): Promise<string> {
  const { encode } = (await import("base64url")).default;
  return encode(new Buffer(await compressCategory(categoryObj)));
}

export async function decodeCategory(
  encodedCategory: string
): Promise<Category> {
  const { toBuffer } = (await import("base64url")).default;
  const base64decoded = toBuffer(encodedCategory);
  return await decompressCategory(base64decoded);
}

async function getStore(): Promise<LocalForage> {
  const localForage = await import("localforage");
  return localForage.createInstance({
    name: "charades",
  });
}

export async function hashEncodedCategory(encodedCategory: string) {
  return encodedCategory.substr(0, 32);
}

export async function listStoredCategories() {
  const store = await getStore();
  const categories: Category[] = [];
  store.iterate<string, void>(async (value) => {
    try {
      const decodedCategory = await decodeCategory(value);
      categories.push(decodedCategory);
    } finally {
      // empty
    }
  });

  return categories;
}

export async function updateCategory(
  oldEncodedCategory: string,
  newCategory: Category
) {
  await removeCategory(oldEncodedCategory);
  return saveCategory(newCategory);
}

export async function removeCategory(encodedCategory) {
  const store = await getStore();
  const hash = await hashEncodedCategory(encodedCategory);
  await store.removeItem(`full:${hash}`);
}

export async function saveCategory(category: Category) {
  const encodedCategory = await encodeCategory(category);
  const hash = await hashEncodedCategory(encodedCategory);
  const store = await getStore();
  await store.setItem(`full:${hash}`, encodedCategory);
}

export async function getDefaultCategoryTitles(): Promise<string[]> {
  const defaultCategories: Category[] = (await import("./defaultCategories"))
    .default;
  const defaultTitles = defaultCategories.map((cat) => cat.title);
  return defaultTitles.sort();
}

export async function getDefaultCategoryByTitle(
  title: string
): Promise<Category> {
  const defaultCategories: Category[] = (await import("./defaultCategories"))
    .default;
  return defaultCategories.find((v) => v.title === title);
}

export async function getAvailableCategoryTitles(): Promise<string[]> {
  const defaultTitles = await getDefaultCategoryTitles();
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

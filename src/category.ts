import base64url from "base64url/dist/base64url";
import pako from "pako";

export interface Category {
  title: string;
  words: string[];
}

const separator = "|";

export function categoryToString(categoryObj: Category): string {
  return categoryObj.title + separator + categoryObj.words.join(separator);
}

export function stringToCategory(categoryString: string): Category {
  const words = categoryString.split(separator);
  const title = words.shift() || "";

  return {
    title,
    words
  };
}

export function encodeCategory(categoryObj: Category): string {
  const categoryString = categoryToString(categoryObj);
  const compressedCategoryString = new Buffer(pako.deflate(categoryString));
  return base64url.encode(compressedCategoryString);
}

export function decodeCategory(encodedCategory: string): Category {
  const base64decoded = base64url.toBuffer(encodedCategory);
  const decompressedBuffer = pako.inflate(base64decoded);
  const decompressedString = new Buffer(decompressedBuffer).toString();
  return stringToCategory(decompressedString);
}

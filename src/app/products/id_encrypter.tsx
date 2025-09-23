import Hashids from "hashids";

const hashids = new Hashids("my-secret-salt", 8);

// Encode string or number
export function encodeId(value: string | number): string {
  if (typeof value === "number") {
    return hashids.encode(value);
  }

  // Convert string to array of char codes
  const charCodes = Array.from(value).map((c) => c.charCodeAt(0));
  return hashids.encode(charCodes);
}

// Decode string or number
export function decodeId(hash: string): string | number {
  const decoded = hashids.decode(hash) as number[];

  if (decoded.length === 1) {
    // Single number
    return decoded[0];
  }

  // Convert char codes back to string
  return decoded.map((n) => String.fromCharCode(n)).join("");
}

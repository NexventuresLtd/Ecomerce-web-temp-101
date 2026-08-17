import Hashids from "hashids";

const hashids = new Hashids("my-secret-salt", 8);

// Encode string or number
export function encodeId(value: string | number): string {
  if (value === null || value === undefined) return "";
  const num = typeof value === "number" ? value : (!isNaN(Number(value)) && String(value).trim() !== "" ? Number(value) : NaN);
  if (!isNaN(num)) {
    return hashids.encode(num);
  }

  // Convert string to array of char codes
  const charCodes = Array.from(String(value)).map((c) => c.charCodeAt(0));
  return hashids.encode(charCodes);
}

// Decode string or number
export function decodeId(hash: string): string | number {
  if (!hash) return hash;
  if (!isNaN(Number(hash))) {
    return Number(hash);
  }
  const decoded = hashids.decode(hash) as number[];

  if (decoded && decoded.length === 1) {
    return decoded[0];
  }
  if (decoded && decoded.length > 1) {
    return decoded.map((n) => String.fromCharCode(n)).join("");
  }

  return hash;
}


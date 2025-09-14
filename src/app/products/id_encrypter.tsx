import Hashids from "hashids";

const hashids = new Hashids("my-secret-salt", 8); // salt + min length

// Encode numeric ID
export function encodeId(id: number): string {
    console.log(hashids.encode(id))
  return hashids.encode(id);
}

// Decode back
export function decodeId(hash: string): number {
  const [decoded] = hashids.decode(hash) as number[];
  return decoded;
}


/**
 * AES-128-CBC decryption using the browser's native Web Crypto API.
 * Mirrors the Python pycryptodome encrypt_any_data() on the backend:
 *   key  = SECRET_KEY_DATA.ljust(16, '\0')[:16]  (first 16 chars, zero-padded)
 *   mode = AES.MODE_CBC
 *   wire = base64(iv) + ":" + base64(ciphertext)
 */

function _deriveKey(): Uint8Array {
  const raw = (import.meta.env.VITE_SECRET_KEY_DATA as string) ?? "";
  const key = new Uint8Array(16);
  for (let i = 0; i < Math.min(raw.length, 16); i++) {
    key[i] = raw.charCodeAt(i);
  }
  return key;
}

function _b64ToBytes(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

export async function decryptPayload(encrypted: string): Promise<any> {
  const [ivB64, ctB64] = encrypted.split(":");
  if (!ivB64 || !ctB64) throw new Error("Invalid encrypted format");

  const keyBytes = _deriveKey();
  const cryptoKey = await crypto.subtle.importKey(
    "raw", keyBytes, { name: "AES-CBC" }, false, ["decrypt"]
  );

  const iv         = _b64ToBytes(ivB64);
  const ciphertext = _b64ToBytes(ctB64);

  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv }, cryptoKey, ciphertext
  );

  return JSON.parse(new TextDecoder().decode(plainBuffer));
}

/**
 * Accepts an axios response.data object.
 * If it has { encrypted_data: "..." } decrypts and returns the inner object.
 * Otherwise returns the data as-is (graceful fallback).
 */
export async function unwrap(data: any): Promise<any> {
  if (data && typeof data.encrypted_data === "string") {
    return decryptPayload(data.encrypted_data);
  }
  return data;
}

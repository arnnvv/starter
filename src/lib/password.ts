import { hash, verify } from "@node-rs/argon2";
import { sha1 } from "./sha";
import { encodeHexLowerCase } from "./encoding";

export const hashPassword = async (password: string): Promise<string> =>
  await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

export const verifyPasswordHash = async (
  hash: string,
  password: string,
): Promise<boolean> => await verify(hash, password);

export async function verifyPasswordStrength(
  password: string,
): Promise<boolean> {
  if (password.length < 8 || password.length > 255) return false;

  const hash = encodeHexLowerCase(
    await sha1(new TextEncoder().encode(password)),
  );
  const hashPrefix = hash.slice(0, 5);
  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${hashPrefix}`,
  );
  const data = await response.text();
  const items = data.split("\n");
  for (const item of items) {
    const hashSuffix = item.slice(0, 35).toLowerCase();
    if (hash === hashPrefix + hashSuffix) {
      return false;
    }
  }
  return true;
}

export function generateRandomPassword(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) =>
    ("0" + (byte & 0xff).toString(16)).slice(-2),
  ).join("");
}

const base64urlAlphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const base32LowerCaseAlphabet = "abcdefghijklmnopqrstuvwxyz234567";
const base32UpperCaseAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const alphabetLowerCase = "0123456789abcdef";
const base64Alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const base64urlDecodeMap = {
  "0": 52,
  "1": 53,
  "2": 54,
  "3": 55,
  "4": 56,
  "5": 57,
  "6": 58,
  "7": 59,
  "8": 60,
  "9": 61,
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25,
  a: 26,
  b: 27,
  c: 28,
  d: 29,
  e: 30,
  f: 31,
  g: 32,
  h: 33,
  i: 34,
  j: 35,
  k: 36,
  l: 37,
  m: 38,
  n: 39,
  o: 40,
  p: 41,
  q: 42,
  r: 43,
  s: 44,
  t: 45,
  u: 46,
  v: 47,
  w: 48,
  x: 49,
  y: 50,
  z: 51,
  "-": 62,
  _: 63,
};

enum EncodingPadding {
  Include = 0,
  None = 1,
}

enum DecodingPadding {
  Required = 0,
  Ignore = 1,
}

function encodeBase32_internal(
  bytes: Uint8Array,
  alphabet: string,
  padding: EncodingPadding,
): string {
  let result = "";
  for (let i = 0; i < bytes.byteLength; i += 5) {
    let buffer = 0n;
    let bufferBitSize = 0;
    for (let j = 0; j < 5 && i + j < bytes.byteLength; j++) {
      buffer = (buffer << 8n) | BigInt(bytes[i + j]);
      bufferBitSize += 8;
    }
    if (bufferBitSize % 5 !== 0) {
      buffer = buffer << BigInt(5 - (bufferBitSize % 5));
      bufferBitSize += 5 - (bufferBitSize % 5);
    }
    for (let j = 0; j < 8; j++) {
      if (bufferBitSize >= 5) {
        result +=
          alphabet[Number((buffer >> BigInt(bufferBitSize - 5)) & 0x1fn)];
        bufferBitSize -= 5;
      } else if (bufferBitSize > 0) {
        result +=
          alphabet[Number((buffer << BigInt(6 - bufferBitSize)) & 0x3fn)];
        bufferBitSize = 0;
      } else if (padding === EncodingPadding.Include) {
        result += "=";
      }
    }
  }
  return result;
}

function encodeBase64_internal(
  bytes: Uint8Array,
  alphabet: string,
  padding: EncodingPadding,
): string {
  let result = "";
  for (let i = 0; i < bytes.byteLength; i += 3) {
    let buffer = 0;
    let bufferBitSize = 0;
    for (let j = 0; j < 3 && i + j < bytes.byteLength; j++) {
      buffer = (buffer << 8) | bytes[i + j];
      bufferBitSize += 8;
    }
    for (let j = 0; j < 4; j++) {
      if (bufferBitSize >= 6) {
        result += alphabet[(buffer >> (bufferBitSize - 6)) & 0x3f];
        bufferBitSize -= 6;
      } else if (bufferBitSize > 0) {
        result += alphabet[(buffer << (6 - bufferBitSize)) & 0x3f];
        bufferBitSize = 0;
      } else if (padding === EncodingPadding.Include) {
        result += "=";
      }
    }
  }
  return result;
}

function decodeBase64_internal(
  encoded: string,
  decodeMap: Record<string, number>,
  padding: DecodingPadding,
): Uint8Array {
  const result = new Uint8Array(Math.ceil(encoded.length / 4) * 3);
  let totalBytes = 0;
  for (let i = 0; i < encoded.length; i += 4) {
    let chunk = 0;
    let bitsRead = 0;
    for (let j = 0; j < 4; j++) {
      if (padding === DecodingPadding.Required && encoded[i + j] === "=") {
        continue;
      }
      if (
        padding === DecodingPadding.Ignore &&
        (i + j >= encoded.length || encoded[i + j] === "=")
      ) {
        continue;
      }
      if (j > 0 && encoded[i + j - 1] === "=") {
        throw new Error("Invalid padding");
      }
      if (!(encoded[i + j] in decodeMap)) {
        throw new Error("Invalid character");
      }
      chunk |= decodeMap[encoded[i + j]] << ((3 - j) * 6);
      bitsRead += 6;
    }
    if (bitsRead < 24) {
      let unused: number;
      if (bitsRead === 12) {
        unused = chunk & 0xffff;
      } else if (bitsRead === 18) {
        unused = chunk & 0xff;
      } else {
        throw new Error("Invalid padding");
      }
      if (unused !== 0) {
        throw new Error("Invalid padding");
      }
    }
    const byteLength = Math.floor(bitsRead / 8);
    for (let i = 0; i < byteLength; i++) {
      result[totalBytes] = (chunk >> (16 - i * 8)) & 0xff;
      totalBytes++;
    }
  }
  return result.slice(0, totalBytes);
}

export function encodeBase64urlNoPadding(bytes: Uint8Array): string {
  return encodeBase64_internal(bytes, base64urlAlphabet, EncodingPadding.None);
}

export function encodeBase32LowerCaseNoPadding(bytes: Uint8Array): string {
  return encodeBase32_internal(
    bytes,
    base32LowerCaseAlphabet,
    EncodingPadding.None,
  );
}

export function encodeHexLowerCase(data: Uint8Array): string {
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += alphabetLowerCase[data[i] >> 4];
    result += alphabetLowerCase[data[i] & 0x0f];
  }
  return result;
}

export function encodeBase64(bytes: Uint8Array): string {
  return encodeBase64_internal(bytes, base64Alphabet, EncodingPadding.Include);
}

export function decodeBase64urlIgnorePadding(encoded: string): Uint8Array {
  return decodeBase64_internal(
    encoded,
    base64urlDecodeMap,
    DecodingPadding.Ignore,
  );
}

export function encodeBase32UpperCaseNoPadding(bytes: Uint8Array): string {
  return encodeBase32_internal(
    bytes,
    base32UpperCaseAlphabet,
    EncodingPadding.None,
  );
}

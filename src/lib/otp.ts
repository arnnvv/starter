import { encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";

export const generateRandomOTP = (): string => {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  const code = encodeBase32UpperCaseNoPadding(bytes);
  return code;
};

export const generateRandomRecoveryCode = (): string => {
  const recoveryCodeBytes = new Uint8Array(10);
  crypto.getRandomValues(recoveryCodeBytes);
  const recoveryCode = encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
  return recoveryCode;
};
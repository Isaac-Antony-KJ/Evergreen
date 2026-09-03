import { randomBytes } from "crypto";

/**
 * Cryptographically random, URL-safe token. 32 bytes (256 bits) encodes to
 * 43 base64url characters — long enough that guessing one is not a
 * realistic attack, short enough to sit comfortably in a URL.
 */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

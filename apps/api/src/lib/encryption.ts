import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'

export function encryptKey(plaintext: string, masterKey: string): string {
  const iv = randomBytes(16)
  const salt = randomBytes(32)
  const key = scryptSync(masterKey, salt, 32)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return Buffer.concat([salt, iv, authTag, encrypted]).toString('base64')
}

export function decryptKey(ciphertext: string, masterKey: string): string {
  const data = Buffer.from(ciphertext, 'base64')
  const salt = data.subarray(0, 32)
  const iv = data.subarray(32, 48)
  const authTag = data.subarray(48, 64)
  const encrypted = data.subarray(64)
  const key = scryptSync(masterKey, salt, 32)
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}
// CRITICAL: Never return decrypted keys via API — only test connection server-side
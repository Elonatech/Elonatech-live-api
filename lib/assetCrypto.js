const crypto = require("crypto");

// The signature and stamp images are stored encrypted. The key lives only in
// the server's environment (CERT_ASSETS_KEY on Render), never in the database
// or the repository, so access to MongoDB alone shows nothing readable.
//
// Make a key with:
//   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

const getKey = () => {
  const raw = process.env.CERT_ASSETS_KEY;
  if (!raw) {
    const error = new Error("CERT_ASSETS_KEY is not set");
    error.code = "NO_ASSET_KEY";
    throw error;
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    const error = new Error("CERT_ASSETS_KEY must be 32 bytes, base64-encoded");
    error.code = "BAD_ASSET_KEY";
    throw error;
  }
  return key;
};

const keyIsConfigured = () => {
  try {
    getKey();
    return true;
  } catch {
    return false;
  }
};

// AES-256-GCM: encrypts and also detects any tampering
const encrypt = (plain) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const data = Buffer.concat([cipher.update(plain), cipher.final()]);
  return { data, iv, tag: cipher.getAuthTag() };
};

const decrypt = ({ data, iv, tag }) => {
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
};

// "ok", "missing" or "invalid", so the admin screen can say what is actually wrong
const keyProblem = () => {
  try {
    getKey();
    return "ok";
  } catch (error) {
    return error.code === "BAD_ASSET_KEY" ? "invalid" : "missing";
  }
};

module.exports = { encrypt, decrypt, keyIsConfigured, keyProblem };

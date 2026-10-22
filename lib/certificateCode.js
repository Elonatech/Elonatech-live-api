const crypto = require("crypto");

// Certificate codes look like  ETMPDP-7K4P9XQ2-C3
//   ETMPDP    fixed prefix
//   7K4P9XQ2  random body — never a counter, so codes can't be guessed in order
//   C3        two check characters worked out from the body, so a mistyped or
//             damaged code is rejected before the database is touched
//
// 0/O, 1/I and L are left out of the alphabet so a code can still be read
// off a printed certificate and typed in by hand.
const PREFIX = "ETMPDP";
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const BASE = ALPHABET.length;
const BODY_LENGTH = 8;

const CODE_PATTERN = new RegExp(
  `^${PREFIX}-[${ALPHABET}]{${BODY_LENGTH}}-[${ALPHABET}]{2}$`
);

// Position-weighted sum, so swapping two neighbouring characters changes it.
const checkCharacters = (body) => {
  let sum = 0;
  for (let i = 0; i < body.length; i += 1) {
    sum += (ALPHABET.indexOf(body[i]) + 1) * (i + 3);
  }
  const value = sum % (BASE * BASE);
  return ALPHABET[Math.floor(value / BASE)] + ALPHABET[value % BASE];
};

const generateCode = () => {
  let body = "";
  for (let i = 0; i < BODY_LENGTH; i += 1) {
    body += ALPHABET[crypto.randomInt(BASE)];
  }
  return `${PREFIX}-${body}-${checkCharacters(body)}`;
};

// Tolerates lowercase and stray spaces (typed or pasted), then checks the
// shape and the check characters. Returns the clean code, or null if invalid.
const normalizeCode = (input) => {
  const code = String(input || "").replace(/\s+/g, "").toUpperCase();
  if (!CODE_PATTERN.test(code)) return null;
  const [, body, check] = code.split("-");
  return checkCharacters(body) === check ? code : null;
};

module.exports = { generateCode, normalizeCode, PREFIX };

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz"
const NUMBERS = "0123456789"
const SPECIAL = "!@#$%^&*"
const ALL = `${UPPERCASE}${LOWERCASE}${NUMBERS}${SPECIAL}`

function randomChar(pool: string) {
  return pool[Math.floor(Math.random() * pool.length)] ?? "A"
}

function shuffle(value: string) {
  return value
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
}

export function generateTemporaryPassword(length = 12) {
  const base = [
    randomChar(UPPERCASE),
    randomChar(LOWERCASE),
    randomChar(NUMBERS),
    randomChar(SPECIAL),
  ]

  while (base.length < length) {
    base.push(randomChar(ALL))
  }

  return shuffle(base.join(""))
}

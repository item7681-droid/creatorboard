export function requireEnv(name: string) {
  const value = process.env[name];
  if (!value || value.startsWith("YOUR_")) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

export function hasEnv(name: string) {
  const value = process.env[name];
  return Boolean(value && !value.startsWith("YOUR_"));
}

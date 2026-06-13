const missing = process.argv.slice(2).filter((name) => {
  const value = process.env[name];
  return !value || value.startsWith("YOUR_");
});

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

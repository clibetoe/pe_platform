const intervalMs = Number(process.env.KEEPALIVE_INTERVAL_MS ?? 55_000);

function resolveTargetUrl() {
  const explicitUrl = process.env.KEEPALIVE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (explicitUrl) return explicitUrl;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    try {
      const parsed = new URL(apiUrl);
      if (parsed.hostname.includes("-8000.")) {
        parsed.hostname = parsed.hostname.replace("-8000.", "-3000.");
        parsed.pathname = "/";
        parsed.search = "";
        parsed.hash = "";
        return parsed.toString();
      }
    } catch {
      // Fall through to localhost.
    }
  }

  return "http://localhost:3000/";
}

async function probe(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  const startedAt = Date.now();
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "user-agent": "pe-platform-keepalive/1.0",
      },
    });

    const elapsedMs = Date.now() - startedAt;
    console.log(`${new Date().toISOString()} ${response.status} ${url} ${elapsedMs}ms`);
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    const message = error instanceof Error ? error.message : String(error);
    console.log(`${new Date().toISOString()} ERROR ${url} ${elapsedMs}ms ${message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function main() {
  const targetUrl = resolveTargetUrl();
  console.log(`Keepalive started for ${targetUrl} every ${Math.round(intervalMs / 1000)}s`);

  while (true) {
    await probe(targetUrl);
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
export function normalizeBasePath(value?: string): string {
  const trimmed = withoutTrailingSlash(value?.trim() ?? "");

  if (!trimmed || trimmed === "/") {
    return "";
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function withBasePath(pathname: string, basePath = ""): string {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedPath = normalizePath(pathname);

  if (!normalizedBasePath) {
    return normalizedPath;
  }

  return normalizedPath === "/" ? normalizedBasePath : `${normalizedBasePath}${normalizedPath}`;
}

export function stripBasePath(pathname: string, basePath = ""): string | null {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedPath = normalizePath(pathname);

  if (!normalizedBasePath) {
    return normalizedPath;
  }

  if (normalizedPath === normalizedBasePath) {
    return "/";
  }

  if (normalizedPath.startsWith(`${normalizedBasePath}/`)) {
    return normalizedPath.slice(normalizedBasePath.length);
  }

  return null;
}

export function buildSiteUrl(siteUrl: string, basePath: string, pathname: string): string {
  const origin = withoutTrailingSlash(siteUrl);
  return new URL(withBasePath(pathname, basePath), `${origin}/`).toString();
}

export function appBaseUrl(siteUrl: string, basePath: string): string {
  const origin = withoutTrailingSlash(siteUrl);
  const normalizedBasePath = normalizeBasePath(basePath);

  return normalizedBasePath ? `${origin}${normalizedBasePath}` : origin;
}

export function withoutTrailingSlash(value: string): string {
  return value.length > 1 && value.endsWith("/") ? value.slice(0, -1) : value;
}

function normalizePath(pathname: string): string {
  const value = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (value.length > 1 && value.endsWith("/")) {
    return value.slice(0, -1);
  }

  return value;
}

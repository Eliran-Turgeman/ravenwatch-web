const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function siteHref(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}` || "/";
}

export function currentRoutePath(pathname = window.location.pathname) {
  const withoutBase =
    basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))
      ? pathname.slice(basePath.length)
      : pathname;
  const normalized = withoutBase.replace(/\/+$/, "");
  return normalized || "/";
}

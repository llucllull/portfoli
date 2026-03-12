export function resolveLang(obj: any, lang: string): any {
  if (obj == null) return obj;

  if (Array.isArray(obj)) {
    return obj.map((v) => resolveLang(v, lang));
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const keys = Object.keys(obj);

  const isLangObject =
    keys.length > 0 && keys.every((k) => ['es', 'en', 'ca'].includes(k));

  if (isLangObject) {
    return obj[lang] ?? obj['es'] ?? obj[keys[0]] ?? '';
  }

  const result: any = {};

  for (const key of keys) {
    result[key] = resolveLang(obj[key], lang);
  }

  return result;
}

export function titleToFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/'/g, '') // remove apostrophes
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
    + '.jpg';
}

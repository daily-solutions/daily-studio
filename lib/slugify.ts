export const slugify = (name: string) =>
  name.trim().toLowerCase().replace(/ /g, '-');

import { portfolioSchema } from './model.ts';
import { getMessage, type MessageTree } from '../i18n/index.ts';

export function flattenMessages(input: unknown, prefix = ''): Record<string, string> {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new Error(`Invalid translation object: ${prefix}`);
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string' && value.trim()) result[path] = value;
    else if (value && typeof value === 'object' && !Array.isArray(value))
      Object.assign(result, flattenMessages(value, path));
    else throw new Error(`Translation leaves must be nonempty strings: ${path}`);
  }
  return result;
}

export function validateDictionaries(dictionaries: Record<string, MessageTree>, baseLocale = 'en') {
  if (!dictionaries[baseLocale]) throw new Error(`Missing base dictionary: ${baseLocale}`);
  const base = flattenMessages(dictionaries[baseLocale]);
  const keys = Object.keys(base).sort();
  const placeholders = (value: string) => {
    if (/\{\{|\}\}/.test(value.replace(/\{\{\w+\}\}/g, '')))
      throw new Error(`Invalid interpolation syntax: ${value}`);
    return [...new Set([...value.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]))].sort();
  };
  for (const [locale, dictionary] of Object.entries(dictionaries)) {
    const messages = flattenMessages(dictionary);
    if (JSON.stringify(Object.keys(messages).sort()) !== JSON.stringify(keys))
      throw new Error(`Translation keys differ for ${locale}`);
    for (const key of keys) {
      if (JSON.stringify(placeholders(messages[key])) !== JSON.stringify(placeholders(base[key])))
        throw new Error(`Translation interpolations differ for ${locale}: ${key}`);
    }
  }
  return keys;
}

export function validateContent(input: unknown, dictionary: MessageTree) {
  const data = portfolioSchema.parse(input);
  flattenMessages(dictionary);
  const check = (key: string) => getMessage(dictionary, key);
  const unique = (entries: { id: string; order?: number }[], label: string) => {
    if (new Set(entries.map((entry) => entry.id)).size !== entries.length)
      throw new Error(`Duplicate identifiers: ${label}`);
    const orders = entries.filter((entry) => entry.order !== undefined).map((entry) => entry.order);
    if (new Set(orders).size !== orders.length) throw new Error(`Duplicate order: ${label}`);
  };
  const collections = [
    'organizations',
    'expertise',
    'experience',
    'education',
    'developmentGroups',
    'development',
    'practiceGroups',
    'practices',
    'navigation',
  ] as const;
  for (const collection of collections) unique(data[collection], collection);
  unique(data.profile.links, 'profile.links');
  const organizations = new Set(data.organizations.map((entry) => entry.id));
  const experienceIds = new Set(data.experience.map((entry) => entry.id));
  const developmentGroups = new Set(data.developmentGroups.map((entry) => entry.id));
  const practiceGroups = new Set(data.practiceGroups.map((entry) => entry.id));
  const reference = (set: Set<string>, value: string) => {
    if (!set.has(value)) throw new Error(`Unresolved reference: ${value}`);
  };
  check(data.profile.locationKey);
  data.profile.links.forEach((entry) => check(entry.contentKey));
  const sectionIds = new Set([
    'about',
    'expertise',
    'experience',
    'education',
    'development',
    'practice',
    'contact',
  ]);
  data.navigation.forEach((entry) => {
    reference(sectionIds, entry.id);
    check(entry.contentKey);
  });
  data.expertise.forEach((entry) => {
    check(`${entry.contentKey}.title`);
    check(`${entry.contentKey}.description`);
    entry.experienceIds.forEach((value) => reference(experienceIds, value));
  });
  data.experience.forEach((entry) => {
    reference(organizations, entry.organizationId);
    check(`${entry.contentKey}.role`);
    check(`${entry.contentKey}.summary`);
    unique(entry.responsibilities, entry.id);
    unique(entry.outcomes, `${entry.id}.outcomes`);
    entry.responsibilities.forEach((item) => check(item.contentKey));
    entry.outcomes.forEach((item) => check(item.contentKey));
    if (
      entry.publicationStatus === 'published' &&
      !entry.responsibilities.some((item) => item.placement === 'primary')
    )
      throw new Error(`Published experience needs visible responsibilities: ${entry.id}`);
  });
  data.education.forEach((entry) => {
    reference(organizations, entry.organizationId);
    check(`${entry.contentKey}.title`);
    check(`learningKinds.${entry.kind}`);
  });
  [...data.developmentGroups, ...data.practiceGroups].forEach((entry) =>
    check(`${entry.contentKey}.title`),
  );
  data.development.forEach((entry) => {
    reference(developmentGroups, entry.groupId);
    if (entry.issuerId) reference(organizations, entry.issuerId);
    check(`${entry.contentKey}.title`);
    check(`learningKinds.${entry.kind}`);
  });
  data.practices.forEach((entry) => {
    reference(practiceGroups, entry.groupId);
    if (entry.contentKey) check(entry.contentKey);
  });
  return data;
}

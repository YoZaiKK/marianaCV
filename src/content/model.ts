import { z } from 'astro/zod';

const id = z.string().regex(/^[a-z][a-z0-9-]*$/);
const contentKey = z.string().regex(/^[a-zA-Z][a-zA-Z0-9.]*$/);
export const datePointSchema = z.discriminatedUnion('precision', [
  z.object({ precision: z.literal('year'), value: z.string().regex(/^\d{4}$/) }).strict(),
  z
    .object({ precision: z.literal('month'), value: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/) })
    .strict(),
]);
export const periodSchema = z
  .object({ start: datePointSchema, end: datePointSchema.nullable(), isCurrent: z.boolean() })
  .strict()
  .superRefine((period, context) => {
    if (period.isCurrent && period.end)
      context.addIssue({ code: 'custom', message: 'Current periods cannot have an end date.' });
    if (!period.isCurrent && !period.end)
      context.addIssue({
        code: 'custom',
        message: 'Completed periods need an end date; do not imply Present.',
      });
    if (period.end && period.end.value.slice(0, 4) < period.start.value.slice(0, 4))
      context.addIssue({ code: 'custom', message: 'End year precedes start year.' });
    if (
      period.end?.precision === 'month' &&
      period.start.precision === 'month' &&
      period.end.value < period.start.value
    )
      context.addIssue({ code: 'custom', message: 'End month precedes start month.' });
  });
const published = {
  id,
  contentKey,
  order: z.number().int().positive(),
  publicationStatus: z.enum(['draft', 'published']),
};
const organization = z.object({ id, name: z.string().min(1) }).strict();
const responsibility = z
  .object({
    id: z.string().min(1),
    contentKey,
    placement: z.enum(['primary', 'additional']),
    order: z.number().int().positive(),
  })
  .strict();
const experience = z
  .object({
    ...published,
    organizationId: id,
    period: periodSchema,
    responsibilities: z.array(responsibility),
    outcomes: z.array(z.object({ id, contentKey, order: z.number().int().positive() }).strict()),
  })
  .strict();
const education = z
  .object({
    ...published,
    organizationId: id,
    kind: z.enum(['degree', 'diploma']),
    period: periodSchema,
    academicAverage: z.number().nonnegative().nullable(),
  })
  .strict();
const group = z.object(published).strict();
const development = z
  .object({
    ...published,
    groupId: id,
    kind: z.enum(['dc3', 'introductoryTraining', 'training', 'workshop']),
    issuerId: id.nullable(),
    date: datePointSchema.nullable(),
  })
  .strict();
const practice = z
  .object({
    ...published,
    contentKey: contentKey.nullable(),
    groupId: id,
    name: z.string().min(1).nullable(),
    instrumentNames: z.array(z.string().min(1)).optional(),
    languageCode: z.string().optional(),
    levelCode: z.string().optional(),
  })
  .strict()
  .refine(
    (entry) => Boolean(entry.name) !== Boolean(entry.contentKey),
    'Provide a proper name or a translation key, not both.',
  );

export const portfolioSchema = z
  .object({
    schemaVersion: z.literal(1),
    profile: z
      .object({
        name: z.string().min(1),
        email: z.email(),
        phone: z.object({ display: z.string().min(1), visible: z.boolean() }).strict(),
        locationKey: contentKey,
        resumeUrl: z
          .string()
          .regex(/^\/resume\/[a-z0-9-]+\.pdf$/)
          .nullable(),
        portraitUrl: z.string().min(1).nullable(),
        links: z.array(
          z
            .object({
              id,
              url: z
                .url()
                .refine((value) => value.startsWith('https://'), 'Profile links must use HTTPS'),
              contentKey,
            })
            .strict(),
        ),
      })
      .strict(),
    navigation: z.array(z.object({ id, contentKey }).strict()),
    organizations: z.array(organization),
    expertise: z.array(
      z
        .object({
          ...published,
          experienceIds: z.array(id),
          accent: z.enum(['sage', 'lilac', 'pink']),
        })
        .strict(),
    ),
    experience: z.array(experience),
    education: z.array(education),
    developmentGroups: z.array(group),
    development: z.array(development),
    practiceGroups: z.array(group),
    practices: z.array(practice),
  })
  .strict();

export type DatePoint = z.infer<typeof datePointSchema>;
export type Period = z.infer<typeof periodSchema>;
export type PortfolioData = z.infer<typeof portfolioSchema>;
export type Experience = PortfolioData['experience'][number];
export type PublishedEntry = { order: number; publicationStatus: 'draft' | 'published' };

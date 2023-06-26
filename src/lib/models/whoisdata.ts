import { z } from 'zod';

// The received format from API has non-standard shape so `zod`
// cannot use its `.datetime` method
function parseDateString(value: string): Date | '' {
  try {
    return new Date(value);
  } catch (e) {
    return '';
  }
}

const identity = z.object({
  name: z.string(),
  organization: z.string(),
  street_address: z.string(),
  city: z.string(),
  region: z.string(),
  country: z.string(),
  zip_code: z.string(),
  phone: z.string(),
  email: z.string(),
});

export const whoisData = z.object({
  domain: z.string().optional(),
  create_date: z.string().transform(parseDateString).optional(),
  update_date: z.string().transform(parseDateString).optional(),
  expire_date: z.string().transform(parseDateString).optional(),
  domain_age: z.number().optional(),
  registrar: z
    .object({
      name: z.string(),
      url: z.string(),
    })
    .optional(),
  registrant: identity.optional(),
  admin: identity.optional(),
  tech: identity.optional(),
  billing: identity.optional(),
  nameservers: z.array(z.string()).optional(),
});

export type WhoisData = z.infer<typeof whoisData>;

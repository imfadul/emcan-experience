/**
 * Contact-form contract shared by the client form and the server route, so
 * validation runs identically on both sides. Option values are stable keys; their
 * labels live in messages (contactForm.options.*) so they translate.
 */

export interface ContactPayload {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  selectedCompany: string;
  inquiryType: string;
  projectType: string;
  projectLocation: string;
  projectStage: string;
  message: string;
  preferredContact: string;
  consent: boolean;
  /** Anti-spam honeypot — must stay empty. */
  website: string;
}

export type ContactField = keyof ContactPayload;
export type ContactErrorCode = 'required' | 'email' | 'tooShort' | 'consent';
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

export const CONTACT_OPTIONS = {
  selectedCompany: ['group', 'consultants', 'alomran', 'energy', 'rama'],
  inquiryType: ['new-project', 'consultation', 'tender', 'partnership', 'careers', 'general'],
  projectType: ['factory', 'warehouse', 'logistics', 'cold-storage', 'energy', 'infrastructure', 'other'],
  projectStage: ['concept', 'feasibility', 'design', 'tender', 'construction', 'operation'],
  preferredContact: ['email', 'phone', 'whatsapp'],
} as const;

export const EMPTY_CONTACT: ContactPayload = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  selectedCompany: '',
  inquiryType: '',
  projectType: '',
  projectLocation: '',
  projectStage: '',
  message: '',
  preferredContact: 'email',
  consent: false,
  website: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns a map of field → error code. Empty map means valid. */
export function validateContact(p: Partial<ContactPayload>): ContactErrors {
  const e: ContactErrors = {};

  if (!p.fullName?.trim()) e.fullName = 'required';
  else if (p.fullName.trim().length < 2) e.fullName = 'tooShort';

  if (!p.email?.trim()) e.email = 'required';
  else if (!EMAIL_RE.test(p.email.trim())) e.email = 'email';

  if (!p.selectedCompany) e.selectedCompany = 'required';
  if (!p.inquiryType) e.inquiryType = 'required';

  if (!p.message?.trim()) e.message = 'required';
  else if (p.message.trim().length < 10) e.message = 'tooShort';

  if (!p.consent) e.consent = 'consent';

  return e;
}

/** True when the honeypot was filled (bot) — caller should accept silently. */
export function isSpam(p: Partial<ContactPayload>): boolean {
  return Boolean(p.website && p.website.trim().length > 0);
}

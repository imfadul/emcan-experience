import { NextResponse } from 'next/server';
import { validateContact, isSpam, type ContactPayload } from '@/lib/contact';

export const runtime = 'nodejs';

const FIELDS: (keyof ContactPayload)[] = [
  'fullName',
  'company',
  'email',
  'phone',
  'country',
  'selectedCompany',
  'inquiryType',
  'projectType',
  'projectLocation',
  'projectStage',
  'message',
  'preferredContact',
];

/** Trim and whitelist fields before forwarding (honeypot/consent never forwarded raw). */
function clean(body: Partial<ContactPayload>) {
  const out: Record<string, string> = {};
  for (const f of FIELDS) out[f] = String(body[f] ?? '').trim().slice(0, 4000);
  return out;
}

export async function POST(req: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = (await req.json()) as Partial<ContactPayload>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot → accept silently so bots get no signal.
  if (isSpam(body)) return NextResponse.json({ ok: true });

  const errors = validateContact(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const endpoint = process.env.LEADS_ENDPOINT_URL;
  const cleaned = clean(body);
  const payload = {
    ...cleaned,
    secret: process.env.LEADS_SHARED_SECRET ?? '',
    submittedAt: new Date().toISOString(),
  };

  // No endpoint configured: simulate in dev, fail loudly in production.
  if (!endpoint) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[contact] LEADS_ENDPOINT_URL not set — lead not forwarded (dev):', {
        email: cleaned.email,
        inquiryType: cleaned.inquiryType,
      });
      return NextResponse.json({ ok: true, forwarded: false });
    }
    console.error('[contact] LEADS_ENDPOINT_URL is not configured');
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
    if (!res.ok || data.ok === false) {
      console.error('[contact] endpoint responded with error', res.status);
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] forward failed', err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}

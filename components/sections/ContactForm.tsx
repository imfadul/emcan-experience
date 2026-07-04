'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  CONTACT_OPTIONS,
  EMPTY_CONTACT,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactPayload,
} from '@/lib/contact';
import { CONTACT } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Field, TextInput, Textarea, Select, Checkbox } from '@/components/ui/Field';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const t = useTranslations('contact');
  const tf = useTranslations('contactForm');
  const [form, setForm] = useState<ContactPayload>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends ContactField>(key: K, value: ContactPayload[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const errText = (field: ContactField) => {
    const code = errors[field];
    return code ? tf(`errors.${code}`) : undefined;
  };

  const opts = (group: keyof typeof CONTACT_OPTIONS) =>
    CONTACT_OPTIONS[group].map((v) => ({ value: v, label: tf(`options.${group}.${v}`) }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return; // double-submit guard

    const found = validateContact(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      // Move focus to the first invalid control.
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      setStatus(res.ok && data.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <section id="contact" className="scroll-mt-24 border-t border-line/10 bg-carbon">
        <div className="shell py-section text-center">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-headline font-bold">{tf('success.title')}</h2>
          <p className="mx-auto mt-5 max-w-xl text-mist">{tf('success.body')}</p>
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setForm(EMPTY_CONTACT);
                setStatus('idle');
              }}
            >
              {tf('success.again')}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line/10 bg-carbon">
      <div className="shell grid gap-12 py-section lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-4 text-headline font-bold">{t('title')}</h2>
          <p className="mt-5 text-lg leading-relaxed text-mist">{t('lede')}</p>

          <dl className="mt-10 space-y-5 border-t border-line/10 pt-8">
            <div>
              <dt className="eyebrow text-xs text-muted">{t('info.address')}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-mist">{CONTACT.address}</dd>
            </div>
            <div>
              <dt className="eyebrow text-xs text-muted">{t('info.phone')}</dt>
              <dd className="mt-1.5 text-sm text-mist" dir="ltr">
                <a href={CONTACT.phone.href} className="transition-colors hover:text-fg">
                  {CONTACT.phone.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-xs text-muted">{t('info.email')}</dt>
              <dd className="mt-1.5 text-sm text-mist" dir="ltr">
                <a href={CONTACT.email.href} className="transition-colors hover:text-fg">
                  {CONTACT.email.display}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-xs text-muted">{t('info.hours')}</dt>
              <dd className="mt-1.5 text-sm text-mist">
                {t('info.hoursValue', { time: CONTACT.hoursTime })}
              </dd>
            </div>
          </dl>
        </div>

        <form ref={formRef} noValidate onSubmit={onSubmit} className="lg:col-span-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="fullName" label={tf('fields.fullName')} required error={errText('fullName')}>
              <TextInput
                id="fullName"
                name="fullName"
                autoComplete="name"
                value={form.fullName}
                invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                onChange={(e) => set('fullName', e.target.value)}
              />
            </Field>
            <Field id="company" label={tf('fields.company')}>
              <TextInput
                id="company"
                name="company"
                autoComplete="organization"
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
              />
            </Field>

            <Field id="email" label={tf('fields.email')} required error={errText('email')}>
              <TextInput
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={form.email}
                invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                onChange={(e) => set('email', e.target.value)}
              />
            </Field>
            <Field id="phone" label={tf('fields.phone')}>
              <TextInput
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </Field>

            <Field id="country" label={tf('fields.country')}>
              <TextInput
                id="country"
                name="country"
                autoComplete="country-name"
                value={form.country}
                onChange={(e) => set('country', e.target.value)}
              />
            </Field>
            <Field id="selectedCompany" label={tf('fields.selectedCompany')} required error={errText('selectedCompany')}>
              <Select
                id="selectedCompany"
                name="selectedCompany"
                placeholder={tf('placeholders.select')}
                options={opts('selectedCompany')}
                value={form.selectedCompany}
                invalid={!!errors.selectedCompany}
                aria-describedby={errors.selectedCompany ? 'selectedCompany-error' : undefined}
                onChange={(e) => set('selectedCompany', e.target.value)}
              />
            </Field>

            <Field id="inquiryType" label={tf('fields.inquiryType')} required error={errText('inquiryType')}>
              <Select
                id="inquiryType"
                name="inquiryType"
                placeholder={tf('placeholders.select')}
                options={opts('inquiryType')}
                value={form.inquiryType}
                invalid={!!errors.inquiryType}
                aria-describedby={errors.inquiryType ? 'inquiryType-error' : undefined}
                onChange={(e) => set('inquiryType', e.target.value)}
              />
            </Field>
            <Field id="projectType" label={tf('fields.projectType')}>
              <Select
                id="projectType"
                name="projectType"
                placeholder={tf('placeholders.select')}
                options={opts('projectType')}
                value={form.projectType}
                onChange={(e) => set('projectType', e.target.value)}
              />
            </Field>

            <Field id="projectLocation" label={tf('fields.projectLocation')}>
              <TextInput
                id="projectLocation"
                name="projectLocation"
                value={form.projectLocation}
                onChange={(e) => set('projectLocation', e.target.value)}
              />
            </Field>
            <Field id="projectStage" label={tf('fields.projectStage')}>
              <Select
                id="projectStage"
                name="projectStage"
                placeholder={tf('placeholders.select')}
                options={opts('projectStage')}
                value={form.projectStage}
                onChange={(e) => set('projectStage', e.target.value)}
              />
            </Field>

            <Field id="preferredContact" label={tf('fields.preferredContact')} className="sm:col-span-2">
              <Select
                id="preferredContact"
                name="preferredContact"
                placeholder={tf('placeholders.select')}
                options={opts('preferredContact')}
                value={form.preferredContact}
                onChange={(e) => set('preferredContact', e.target.value)}
              />
            </Field>

            <Field id="message" label={tf('fields.message')} required error={errText('message')} className="sm:col-span-2">
              <Textarea
                id="message"
                name="message"
                value={form.message}
                invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                onChange={(e) => set('message', e.target.value)}
              />
            </Field>
          </div>

          {/* Honeypot — hidden from users & AT */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              value={form.website}
              onChange={(e) => set('website', e.target.value)}
            />
          </div>

          <div className="mt-6">
            <Checkbox
              id="consent"
              checked={form.consent}
              invalid={!!errors.consent}
              onChange={(c) => set('consent', c)}
            >
              {tf('consent')}
            </Checkbox>
            {errors.consent && (
              <p role="alert" className="mt-1 text-xs text-red-400">
                {tf('errors.consent')}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button type="submit" size="lg" disabled={status === 'submitting'}>
              {status === 'submitting' ? tf('states.submitting') : tf('states.submit')}
            </Button>
            <p aria-live="polite" className="text-sm">
              {status === 'error' && <span className="text-red-400">{tf('states.error')}</span>}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

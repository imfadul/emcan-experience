import { setRequestLocale } from 'next-intl/server';
import { Cinematic } from '@/components/cinematic/Cinematic';
import { GroupIntro } from '@/components/sections/GroupIntro';
import { Milestones } from '@/components/sections/Milestones';
import { EcosystemLifecycle } from '@/components/sections/EcosystemLifecycle';
import { Sectors } from '@/components/sections/Sectors';
import { Capabilities } from '@/components/sections/Capabilities';
import { ProjectsExplorer } from '@/components/sections/ProjectsExplorer';
import { DeliveryLifecycle } from '@/components/sections/DeliveryLifecycle';
import { WhyEmcan } from '@/components/sections/WhyEmcan';
import { Leadership } from '@/components/sections/Leadership';
import { Credentials } from '@/components/sections/Credentials';
import { Sustainability } from '@/components/sections/Sustainability';
import { ContactForm } from '@/components/sections/ContactForm';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* Cinematic journey (Phase 2/3) */}
      <Cinematic />

      {/* Corporate homepage (Phase 4) — light theme, see .corporate-zone in globals.css */}
      <div className="corporate-zone bg-bg text-fg">
        <GroupIntro />
        <Milestones />
        <EcosystemLifecycle />
        <Sectors />
        <Capabilities />
        <ProjectsExplorer />
        <DeliveryLifecycle />
        <WhyEmcan />
        <Leadership />
        <Credentials />
        <Sustainability />
        <ContactForm />
      </div>
    </>
  );
}

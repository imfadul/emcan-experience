import type { CompanyId } from '@/lib/config';

/**
 * Group leadership — REAL, sourced from the live emcan.sa production site (names,
 * titles, companies, photos). Bio copy lives in messages/*.json so it translates
 * (see cinematic's pattern); this file holds only structural, non-text data.
 * Photos are self-hosted under /public/team (no photo → initials avatar, matching
 * how the source site itself handles missing headshots).
 */
export interface LeadershipMember {
  id: string;
  /** Undefined for the Chairman, who leads the group rather than one company. */
  company?: CompanyId;
  photo?: string;
}

export const CHAIRMAN: LeadershipMember = {
  id: 'bashawri',
  photo: '/team/chairman-bashawri.png',
};

export const DIRECTORS: LeadershipMember[] = [
  { id: 'rafei', company: 'consultants' },
  { id: 'amin', company: 'alomran', photo: '/team/haitham-amin.png' },
  { id: 'alryati', company: 'energy', photo: '/team/ramadan-alryati.png' },
  { id: 'alfayoumi', company: 'rama' },
];

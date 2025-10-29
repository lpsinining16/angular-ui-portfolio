/**
 * This file extracts all the interfaces from your original api.ts
 * It's good practice to keep models separate from services.
 */

export interface NavLink {
  id: number; // The backend now provides an ID
  label: string;
  fragment: string;
  isContact?: boolean;
}

export interface NavLinkMenu {
  label: string;
  fragment: string;
  isContact?: boolean;
}

export interface Profile {
  name: string;
  headline: string;
  brandName: string;
  summary: string;
  about: string;
  about2: string;
  about3: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  cvUrl: string;
  profilePhoto: string;
}

export interface Skill {
  id: number; // The backend now provides an ID
  category: string;
  technologies: string[];
}

export interface IconSkill {
  name: string;
  iconClass: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  animationDelay: string;
}

export interface CoreFunction {
  function: string;
  description: string;
}

export interface System {
  title: string;
  summary?: string;
  tags: string[];
  link: string;
  coreFunctions?: CoreFunction[];
}

export interface Project {
  id: number; // The backend now provides an ID
  title: string;
  type: 'professional' | 'personal';
  company: string;
  link?: string;
  description: string;
  technologies: string[];
  systems: System[];
}

export interface WorkExperience {
  id: number; // The backend now provides an ID
  title: string;
  company: string;
  duration: string;
  points: string[];
  isDevRole: boolean;
}

/**
 * This is the standardized response format from our Express API.
 * We use a generic <T> so we can reuse it for all data types.
 */
export interface ApiResponse<T> {
  status: string;
  data: T;
  meta?: {
    count: number;
  };
  message?: string;
}

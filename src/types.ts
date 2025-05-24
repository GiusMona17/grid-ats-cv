// Section types
export type SectionType = 'profile' | 'experience' | 'skills' | 'education' | 'interests' | 'apps' | 'custom';

// App data
export interface AppItem {
  name: string;
  color: string;
  icon?: string;
}

// Profile section data
export interface ProfileData {
  name: string;
  tagline: string;
  email: string;
  website?: string;
  websiteLabel?: string;
  profileImage: string;
  apps: AppItem[];
  interests: string[];
}

// Experience data
export interface JobItem {
  company: string;
  title: string;
  period: string;
  current?: boolean;
  logo?: string;
  logoBackground: string;
  responsibilities: string[];
}

export interface ExperienceData {
  years: string;
  jobs: JobItem[];
}

// Skills data
export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

// Education data
export interface EducationItem {
  degree: string;
  type: string;
  institution?: string;
  period: string;
  logo?: string;
}

export interface EducationData {
  schools: EducationItem[];
}

// Section data union type
export type SectionData =
  | ProfileData
  | ExperienceData
  | SkillsData
  | EducationData
  | Record<string, unknown>; // For custom sections

// CV Section
export interface CVSectionItem {
  id: string;
  type: SectionType;
  title: string;
  content: SectionData;
  width?: number;
  height?: number;
  gridColumn?: string;
  gridRow?: string;
  position?: {
    x: number;
    y: number;
  };
  order: number;
}

// Complete CV Data
export interface CVData {
  title: string;
  subtitle: string;
  sections: CVSectionItem[];
  theme?: string;
}

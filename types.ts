
export interface Skill {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  demoLink?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  role: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  content: string | null;
  technologies: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  published: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  media: ProjectMedia[];
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  projects?: Project[];
  _count?: {
    projects: number;
  };
}

export interface ProjectMedia {
  id: string;
  projectId: string;
  type: MediaType;
  url: string;
  altText: string | null;
  order: number;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  THUMBNAIL = "THUMBNAIL",
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

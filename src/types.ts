export type ResourceType = 'pdf' | 'word' | 'powerpoint' | 'image' | 'video' | 'link';
export type LessonIcon = 'globe' | 'code' | 'message' | 'mail' | 'book';
export type AnnouncementType = 'تطبيق' | 'واجب' | 'تصحيح واجب';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
  viewUrl?: string;
  pdfUrl?: string;
  pptUrl?: string;
  docUrl?: string;
  icon?: LessonIcon;
  year: number;
  branch: string;
  term: number;
  domain: string;
  unit: string;
  teacher: string;
}

export interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  description: string;
  url?: string;
  year?: number;
  branch?: string;
  term?: number;
  createdAt: string;
  teacher: string;
}

export interface Teacher { id: string; name: string; email: string; role: 'admin' | 'teacher'; active: boolean; }
export interface Settings { platformName: string; teacherName: string; logo: string; email: string; phone: string; }

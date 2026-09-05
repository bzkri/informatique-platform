import type { Announcement, Domain, Resource, Settings, Teacher, Unit } from './types';

export const branches: Record<number, string[]> = {
  1: ['جذع مشترك علوم وتكنولوجيا', 'جذع مشترك آداب'],
  2: ['علوم تجريبية', 'رياضيات', 'تقني رياضي', 'تسيير واقتصاد', 'لغات أجنبية', 'آداب وفلسفة'],
  3: ['علوم تجريبية', 'رياضيات', 'تقني رياضي', 'تسيير واقتصاد', 'لغات أجنبية', 'آداب وفلسفة']
};

const webDomain = 'المجال التعلمي III : تقنيات الويب';
export const demoResources: Resource[] = [
  { id:'web-1', title:'المتصفح', description:'التعرف على المتصفح واستعماله للوصول إلى موارد الويب.', type:'link', url:'https://developer.mozilla.org/ar/', viewUrl:'https://developer.mozilla.org/ar/', pdfUrl:'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', icon:'globe', year:1, branch:'جذع مشترك علوم وتكنولوجيا', term:1, domain:webDomain, unit:'المتصفح', teacher:'الأستاذ محمد' },
  { id:'web-2', title:'إنشاء صفحة ويب', description:'إنشاء أول صفحة باستعمال HTML وبنية الوسوم الأساسية.', type:'link', url:'https://developer.mozilla.org/en-US/docs/Learn/HTML', viewUrl:'https://developer.mozilla.org/en-US/docs/Learn/HTML', icon:'code', year:1, branch:'جذع مشترك علوم وتكنولوجيا', term:1, domain:webDomain, unit:'إنشاء صفحة ويب', teacher:'الأستاذ محمد' },
  { id:'web-3', title:'استغلال أدوات التواصل', description:'التعرف على أدوات التواصل الرقمي وقواعد استعمالها.', type:'link', url:'https://www.unicef.org/end-violence/how-to-stop-cyberbullying', viewUrl:'https://www.unicef.org/end-violence/how-to-stop-cyberbullying', icon:'message', year:1, branch:'جذع مشترك علوم وتكنولوجيا', term:1, domain:webDomain, unit:'استغلال أدوات التواصل', teacher:'الأستاذ محمد' },
  { id:'web-4', title:'البريد الإلكتروني', description:'إنشاء الرسائل وإرسالها وتنظيم البريد الإلكتروني بأمان.', type:'link', url:'https://support.google.com/mail/', viewUrl:'https://support.google.com/mail/', icon:'mail', year:1, branch:'جذع مشترك علوم وتكنولوجيا', term:1, domain:webDomain, unit:'البريد الإلكتروني', teacher:'الأستاذ محمد' },
  { id:'algo-1', title:'مدخل إلى الخوارزميات', description:'درس مبسط حول مفهوم الخوارزمية ومراحل حل المسائل.', type:'pdf', url:'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', pdfUrl:'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', icon:'book', year:1, branch:'جذع مشترك علوم وتكنولوجيا', term:1, domain:'المجال التعلمي I : الخوارزميات والبرمجة', unit:'مبادئ الخوارزميات', teacher:'الأستاذ محمد' }
];

export const demoAnnouncements: Announcement[] = [
  { id:'a1', type:'واجب', title:'واجب تقنيات الويب', description:'أنشئ صفحة ويب بسيطة تتضمن عنوانًا وفقرة ورابطًا.', year:1, branch:'جذع مشترك علوم وتكنولوجيا', term:1, createdAt:'2026-08-20', teacher:'الأستاذ محمد' },
  { id:'a2', type:'تطبيق', title:'تطبيق حول البريد الإلكتروني', description:'تطبيق قصير حول كتابة رسالة إلكترونية سليمة.', year:1, branch:'جذع مشترك علوم وتكنولوجيا', term:1, createdAt:'2026-08-18', teacher:'الأستاذ محمد' },
  { id:'a3', type:'تصحيح واجب', title:'تصحيح واجب الخوارزميات', description:'التصحيح النموذجي للواجب السابق متاح الآن.', url:'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', createdAt:'2026-08-15', teacher:'الأستاذ محمد' }
];

export const demoTeachers: Teacher[] = [
  { id:'1', name:'الأستاذ محمد', email:'admin@example.com', role:'admin', active:true },
  { id:'2', name:'الأستاذة أمينة', email:'teacher@example.com', role:'teacher', active:true }
];

export const demoDomains: Domain[] = [
  { id:'domain-web', name:webDomain, year:1, branch:'جذع مشترك علوم وتكنولوجيا', term:1 },
  { id:'domain-algo', name:'المجال التعلمي I : الخوارزميات والبرمجة', year:1, branch:'جذع مشترك علوم وتكنولوجيا', term:1 }
];

export const demoUnits: Unit[] = [
  { id:'unit-browser', domainId:'domain-web', name:'المتصفح' },
  { id:'unit-html', domainId:'domain-web', name:'إنشاء صفحة ويب' },
  { id:'unit-communication', domainId:'domain-web', name:'استغلال أدوات التواصل' },
  { id:'unit-email', domainId:'domain-web', name:'البريد الإلكتروني' },
  { id:'unit-algo', domainId:'domain-algo', name:'مبادئ الخوارزميات' }
];

export const defaultSettings: Settings = { platformName:'منصة مادة المعلوماتية', teacherName:'الأستاذ محمد', logo:'💻', email:'teacher@example.com', phone:'0550 00 00 00' };

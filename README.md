# منصة مادة المعلوماتية

منصة عربية RTL مبنية بـ React وTypeScript وVite لعرض موارد مادة المعلوماتية حسب السنة والشعبة والفصل والمجال والوحدة، مع لوحة إدارة متعددة الأساتذة وSupabase.

## التشغيل الفوري (الوضع التجريبي)

يتطلب Node.js 20 أو أحدث:

```bash
npm install
npm run dev
```

عند غياب متغيرات Supabase يعمل التطبيق تلقائيًا ببيانات عربية تجريبية، وتحفظ تعديلات لوحة الإدارة في `localStorage`. بيانات الدخول التجريبية معبأة مسبقًا (`admin@example.com` / `demo123`).

## إعداد Supabase

1. أنشئ مشروعًا مجانيًا في Supabase.
2. من SQL Editor نفّذ بالترتيب للمشروع الجديد:
   - `supabase/schema.sql`
   - `supabase/rls.sql`
   - `supabase/content_upgrade.sql`
   - `supabase/seed.sql`
   - `supabase/migrations/202603_curriculum_teacher_admin.sql`

   للمشروع الموجود مسبقًا يكفي تنفيذ ملف الترقية الأخير بعد ملفات الترقية السابقة التي لم تُنفّذ بعد.
3. أنشئ مستخدمًا من Authentication، ثم اجعله أدمن بتنفيذ التعليمة الموضحة آخر `seed.sql` مع UUID الصحيح.
4. انسخ `.env.example` إلى `.env.local` وأضف القيم العامة فقط:

```env
VITE_SUPABASE_URL=https://PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=PUBLIC_ANON_KEY
```

لا تضع `service_role` أو أي سر إداري في الواجهة أو المستودع. سياسات RLS تحمي الجداول، وتسمح للأستاذ بإدارة محتواه وللأدمن بإدارة الجميع. حاوية `resources` عامة للقراءة ومقيدة للكتابة.

لنشر العمليات الإدارية الآمنة اتبع `supabase/functions/admin-users/README.md`. تغيير كلمة مرور المستخدم الحالي يتم مباشرة عبر جلسة Supabase، أما حذف مستخدم أو تغيير كلمة مرور مستخدم آخر فيمر حصريًا عبر Edge Function بعد التحقق من دور الأدمن.

> الملفات حتى 50MB يمكن رفعها إلى Storage. للملفات الكبيرة ألصق رابط مشاركة عام من Google Drive في حقل رابط المورد.

## أنواع المعاينة

- PDF والصور: معاينة داخلية.
- الفيديو: تضمين YouTube أو فتح الرابط.
- Word وPowerPoint: فتح عبر عارض Microsoft Office العام لأن المتصفح لا يعرضهما مباشرة.
- الروابط: فتح في نافذة جديدة.
- يتوفر زر تنزيل/فتح مباشر لكل مورد.

## البناء

```bash
npm run build
npm run preview
```

## النشر على GitHub Pages

ملف `.github/workflows/deploy.yml` يبني وينشر تلقائيًا عند الدفع إلى `main` أو `master`. إعداد `base: './'` في Vite يجعل الأصول تعمل تحت مسار أي مستودع.

1. من إعدادات المستودع اختر **Pages → Source: GitHub Actions**.
2. أضف `VITE_SUPABASE_URL` و`VITE_SUPABASE_ANON_KEY` إلى **Actions secrets** إن أردت الوضع المتصل؛ وإلا ستُنشر النسخة التجريبية.
3. ادفع الملفات إلى المستودع؛ لا تنشئ هذه المهمة مستودعًا تلقائيًا.

## البنية

- `src/`: الواجهة، البيانات التجريبية، لوحة الإدارة وعميل Supabase.
- `supabase/`: المخطط وسياسات RLS والبيانات الأولية.
- `.github/workflows/`: مسار النشر.

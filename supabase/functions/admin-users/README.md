# admin-users Edge Function

تنفّذ إنشاء حساب أستاذ، حذف مستخدم Auth، وتغيير كلمة مرور مستخدم آخر من الخادم فقط. تتحقق أولًا من JWT للمستدعي ومن أن ملفه `admin` ونشط.

## النشر

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy admin-users
```

`SUPABASE_URL` و`SUPABASE_ANON_KEY` و`SUPABASE_SERVICE_ROLE_KEY` متاحة افتراضيًا داخل Edge Functions المستضافة. إذا كانت بيئتك تتطلب ضبط السر يدويًا:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

لا تضع قيمة `service_role` في ملفات `.env` الخاصة بـ Vite أو GitHub Actions أو أي ملف في المستودع.

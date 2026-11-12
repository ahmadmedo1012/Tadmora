# مركز توثيق أُلارا

هذا المجلد هو التوثيق الحيّ لمشروع **أُلارا** — منصّة تعليم ذكي
**مستقلّة** (مساحة العرض «مساحة عمل أُلارا التجريبية» = بيانات اصطناعية
موسومة، لا هوية جامعة المنصّة).

> **قاعدة الذهب:** الشيفرة هي مصدر الحقيقة. إذا اختلفت وثيقة عن السلوك
> الفعلي فالشيفرة تفوز — ويرجى تصحيح الوثيقة في نفس التغيير.

> **موجة الصفر-أثر (2/4):** أشجار الحقب المتقاعدة (archive/redesign/
> history/releases/research/screenshots/superpowers/brand/legal) والأدلة
> المرقّمة والمراجع المولّدة حُذفت من الشجرة — لا تُخفى. ما تبقى هنا هو
> التوثيق التشغيلي الحيّ فقط.

## الإصدار والنشر

| الوثيقة | المحتوى |
|---|---|
| [RELEASE.md](RELEASE.md) | كيف تُشحن أُلارا: الويب + التطبيق، فرع واحد، ما الذي يفعّل النشر أين |
| [api/openapi.json](api/openapi.json) | عقد الـAPI المولّد من الشيفرة (`npm run api:openapi`) — المصدر الذي تُولَّد منه عملاء الواجهة والموبايل |
| [api/mobile-auth.md](api/mobile-auth.md) | عقد المصادقة بين التطبيق والخلفية |

## الوحدات المتخصصة (`modules/`)

خريطة تقنية لكل قطاع: مساراته، صفحاته، الـendpoints، النماذج، ونقاط التعديل.

| الوثيقة | القطاع |
|---|---|
| [modules/student.md](modules/student.md) | قطاع الطالب |
| [modules/teacher.md](modules/teacher.md) | قطاع الأستاذ |
| [modules/admin.md](modules/admin.md) | المسجل العام |
| [modules/quality.md](modules/quality.md) | ضمان الجودة |
| [modules/owner.md](modules/owner.md) | المالك |
| [modules/platform.md](modules/platform.md) | المشترك: المصادقة، السمات، الإشعارات، نظام التصميم |

## المعمارية والتصميم

| الوثيقة | المحتوى |
|---|---|
| [architecture/hosting-decision.md](architecture/hosting-decision.md) | قرار الاستضافة الموثّق |
| [architecture/multi-institution/](architecture/multi-institution/) | خطة التعدّد المؤسسي: القرارات، جرد نطاق البيانات، مراحل الترحيل |
| [design/](design/) | مراجع نظام التصميم + مخرجات بوابات الـCSS (مثل `css-coverage.json`) |

## التشغيل والجوال

| الوثيقة | المحتوى |
|---|---|
| [ops/](ops/) | سجلات التنفيذ والتقادم: LEDGER، خطة الـcodemod، سجل إعادة التسمية |
| [runbooks/operator-pilot-guide.md](runbooks/operator-pilot-guide.md) | دليل مشغّل التجربة الطيار |
| [mobile/](mobile/) | توثيق تطبيق الجوال: البناء المحلي، التسليم، جرد المسارات، التدقيق الساكن |
| [load-test.md](load-test.md) | اختبار الحمل (k6): الأمر والعتبات المقبولة |

## مسارات قراءة مقترحة

- **أريد فهم المشروع:** ابدأ من `README.md` في الجذر، ثم `RELEASE.md`.
- **سأطور ميزة:** `AGENTS.md` في الجذر (العقد التشغيلي) ← وحدة القطاع من
  `modules/` ← `scripts/README.md` لبوابات ما قبل الدفع.
- **أدير أو أنشر:** `RELEASE.md` ← `ops/` ← `runbooks/`.

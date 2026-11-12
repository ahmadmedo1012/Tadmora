# LEDGER — سجل التقدم الوحيد (ULARA Ω)

> ملف واحد، إضافة فقط، يُحدَّث كل ≤ 45 دقيقة ويُدفع. يقرؤه المالك والوكيل بعد أي انقطاع.
> العقد: ✅ = مخرج طرفي فعلي · ⚠️ = غير مُتحقَّق · ⛔ = بانتظار المالك.

---

## Done (مع الإثبات)

### Phase 0 — الأساس والقياس (cycle 1, 2026-11-12)

**الاستنساخ والحالة**: نسخة عمل نظيفة `main @ 2806a21` (نقطة مرجع البرنامج الرئيسي نفسها). `git status` نظيف بعد `npm ci` (557 حزمة جذر + 237 عمل فرعي، كاش دافئ).

**1) إعادة قياس حقائق §1 — الفروق عن البرنامج الرئيسي:**

| المقياس | البرنامج الرئيسي ادّعى | القياس الفعلي @2806a21 | الحكم |
|---|---|---|---|
| ملفات متتبَّعة | 2,647 | `git ls-files \| wc -l` = **2647** | ✅ مطابق |
| ملفات md | 441 | **441** | ✅ مطابق |
| ملفات docs/ | 585 | **585** | ✅ مطابق |
| archive+redesign | 193 | **422** (archive/redesign معًا) | ⚠️ الرقم الأصلي غامض |
| `.git` | ≈133MB | **127M** (استنساخ عمق 50) | ⚠️ أخف من المدّعى |
| مجلدات scripts/rNNN | 15 | **14** | ⚠️ فرق 1 |
| Footer.tsx | 540 سطر | **540** سطر (`wc -l`) | ✅ مطابق |
| footer.css | 784 سطر | **784** سطر | ✅ مطابق |
| `--fu` في footer.css | — | **83** تكرار · **9** `position:absolute` | ✅ البنية الهشّة مؤكدة |
| heron | 55,004 في 598 ملف | **55,061 في 599 ملف** | ⚠️ نمو طفيف |
| Tadmora/TADMORA/تادمورا/tadmora | 157/118/257/357 ملف | **157/118/257/357 ملف** | ✅ مطابق |
| tdmr | 138 ملف | **138 ملف / 376 إشارة** | ✅ مطابق |
| Madarek/مدارك | 163 | **60/39 ملف** (99 معًا) | ⚠️ الرقم الأصلي مجموع مختلف |
| Zawia/الزاوية | 94 | **46/75 ملف** (121 معًا) | ⚠️ فرق التجميع |
| projectId في app.config.ts | أصفار | `00000000-0000-0000-0000-000000000000` (سطر 131) | ✅ مؤكد |
| سقف PDF | 4 MiB | `/api/v1/status` → `maxPdfUploadBytes: 4194304` | ✅ مؤكد |
| الملفات الثقيلة | — | imagery-sheet.png 2.1MB · sample.pdf 996KB · 3 mp4 lectures ~900KB لكل منها | ✅ مؤكد |

**2) قياس الأساس `verify.sh --fast`** (أمر: `bash scripts/verify.sh --fast`):
```
✓ tsc (frontend)
✓ vitest 3037 passed
✓ bundle gate — 758.7 KB gz / سقف 770 KB · entry 66.1/92 · pdf 95.7/110
✓ css ratchet importantDeclarations:52
verify.sh: FAST PASS
```

**3) الإنتاج حيّ ومطابق لـ main** (أمر: `curl https://tadmora.vercel.app/api/v1/status`):
```
{"ok":true,"db":{"ok":true,"latencyMs":537},...,"buildId":"2806a2178ef4"} HTTP:200 في 1.22s
```
`buildId 2806a21` = main الحالي حرفيًا.

**4) فحص اسم ULARA (§5 شرط Phase 0):**

| الفحص | النتيجة | الأداة |
|---|---|---|
| ulara.com | ⛔ **محجوز** (A: 76.223.54.146, 13.248.169.48 — مركّن) | `getent hosts` |
| ulara.ly / .app / .io / .dev / .net | ✅ **NXDOMAIN** — بلا سجلات، متاحة على الأرجح للتسجيل | Google DoH `dns.google/resolve` (Status:3) |
| npm `ulara` + `@ulara/core` | ✅ متاحان (404 من registry) | `npm view` |
| مستخدم GitHub `ulara` | ⛔ محجوز (user id 3639262) — لا يؤثر: إعادة تسمية الريبو تكون `ahmadmedo1012/ulara` تحت حساب المالك | GitHub API (authed) |
| مستودعات GitHub باسم ulara | 21 مستودع صغيرًا (أولها إطار PHP شخصي) — لا شيء في التعليم | GitHub search API |
| علامة تجارية (WIPO Global Brand DB) | ⚠️ **لا يمكن الاستعلام من الصندوق** — يلزم فحص يدوي من المالك: https://branddb.wipo.int → بحث «ulara» + «أولارا» في فئة التعليم/البرمجيات (Nice 9/41) | — |

**5) أدوات §2 — حالة التثبيت:**

| الأداة | الحالة | البديل المستخدم |
|---|---|---|
| gstack | ⚠️ مستنسخ إلى `~/.claude/skills/gstack` كاملًا (المهارات مقروءة كمنهجية)؛ `./setup` تعطّل (يطلب Bun 1.4.2، الصندوق فيه 1.3.14، والعمليات الخلفية تُقتل بين الاستدعاءات) | اتباع منهجية /review و/qa يدويًا + agent-browser المدمج للفحص المتصفحي |
| impeccable | ⚠️ `npx impeccable install` انتهت مهلته (شبكة بطيئة) | منهجية audit يدوية + عامل frontend-styling-expert المدمج |
| ui-ux-pro-max | ⚠️ غير مثبت (نفس القيد) | نظام التصميم يُقاس ببوابات الريبو نفسها (stylelint ratchet + a11y) |
| ponytail | ⚠️ إضافة Claude Code غير قابلة للتثبيت هنا | الانضباط يُطبَّق يدويًا: لا اعتمادية جديدة دون تبرير، لا كود ميت |

**6) اكتشافات جوهرية غيّرت خطة 1-A** (كلها من GitHub API + الكود):

- **الدخول على الإنتاج يعمل فعلًا**: تشغيل deploy-smoke رقم **#5** (workflow_dispatch @ 727b34c، 2026-11-11T23:38Z) **أخضر بالكامل** بما فيه «Login ×3 test accounts (student · teacher · registrar)» + «student dashboard 200». كلمات المرور مُدوّرة ومحفوظة كـ Secrets (SMOKE_PW_STUDENT/TEACHER/REGISTRAR) — تعليق السير العمل: «production hardening retired the published shared demo password». أي أن فشل `12345678` على الإنتاج **مقصود أمنيًا** وليس عطلًا.
- `ensureTestAccounts` opt-in عبر `TADMORA_TEST_ACCOUNTS=1` ولا يستدعيه `api/index.ts` إطلاقًا (فقط `backend/src/index.ts` للـ self-host) + أمر build في vercel.json بلا seed ⇒ **الإنتاج لا يعيد ضبط كلمات العرض أبدًا** — 1-A(b) محقق بنيويًا.
- تمييز أخطاء الواجهة (1-A(d)) موجود: 429 مميَّز في AuthPage (سطر 54)، رسائل الخادم العربية حرفيًا (401 بيانات خاطئة · 403 معطّل «هذا الحساب معطّل — تواصل مع إدارة المنصّة» · مقفل «الحساب مقفل مؤقتاً — حاول مرة أخرى بعد قليل» · توقيت متساوٍ عبر burnDummyVerify يمنع تسريب وجود الحساب). تحسين صغير متبقٍ: الزمن المتبقي في رسالة القفل.
- `backend/scripts/provision-owner.mjs` موجود ومكتمل (معاملة واحدة، AuditLog، تسليم كلمة مرة واحدة، `--suspend-demo-owner`) — دليل المالك يُكتب في Blocked-Owner.
- **تنبيه منهجي مُثبِت**: ظهر أثناء القياس ما بدا خلل YAML («branches: ain]» في deploy-smoke.yml) — الفحص بالبايتات الخام (`python3` قراءة ثنائية + أداة Read + أداة Edit بالنص الحرفي) أثبت أن الملف يحتوي `[main]` سليمًا، وأن **العرض الطرفي لهذه البيئة يبتلع `[m` كتسلسل ANSI** فيشوّه `[main]` إلى `ain]` في المخرجات المعروضة فقط. لا خلل في الريبو. كل قراءة مستقبلية لأقواس مربعة تُتحقق بالبايتات لا بالعرض.
- **القضية #8 مفتوحة بلا تشخيص** (فشل التشغيل #4 «Login ×3» @ aa7629b، 23:17) بينما #5 نجح بعدها بـ 21 دقيقة — أُغلق مع تعليق بالإثبات.

---

## In progress

- **PR هذا الدورة**: `ula/phase0-baseline` — LEDGER (هذا الملف) فقط. (ادّعاء إصلاح «branches: ain]» سُحب: أثر عرض لا خلل حقيقي — انظر المنهجية أعلاه.)

## Next (مرتّب)

1. **1-C الفوتر** (المسار الأكثر انفتاحًا): سكربت كشف التداخل البرمجي (Playwright، 8 عروض × فاتح/داكن × RTL) → إعادة بناء Footer بـ Grid/Flex → مكوّن `<Brand>` موحّد.
2. **1-B انهيار الموبايل**: إضافة job `android-smoke` إلى mobile.yml (emulator API 34 + Maestro + logcat gate) ثم تشخيص S1–S5 من أثر فعلي.
3. **1-A المتبقي (صغير)**: رسالة القفل بالزمن المتبقي + دليل المالك النهائي لـ provision-owner (يُجمع في Blocked-Owner) — كل الجوهر الآخر محقق سلفًا.
4. **Phase 2 تحضيرًا للبوابة A**: `shared/brand.json` + سكربت التحويل + الشعار (يُبنى بالتوازي مع 1-C، لا يُنفَّذ قبل «نعم»).
5. Phase 3 التنظيف بعد أخضر 1-A/1-B/1-C.

## Blocked-Owner

1. **تدوير GitHub PAT** — ظهر الرمز في محادثة بشرية ⇒ يُعدّ مكشوفًا. المطلوب: GitHub → Settings → Developer settings → Fine-grained tokens → تدوير رمز `ahmadmedo1012/Tadmora` وتسليم الجديد عبر قناة خاصة. (الرمز الحالي يعمل وسنستمر به حتى التدوير.)
2. **فحص WIPO اليدوي للاسم**: https://branddb.wipo.int — ابحث «ulara» و«أولارا» في فئات التعليم/البرمجيات. النطاقات `.ly/.app/.io/.dev/.net` بلا سجلات DNS وجاهزة للتسجيل؛ `ulara.com` محجوز.
3. **بوابة A (الاسم)**: «نعم/لا» على اعتماد ULARA + الخطوات الخارجية (إعادة تسمية الريبو/Vercel/Neon/EAS — قائمة الأوامر الدقيقة ستُرفق عند طلبها).
4. **بوابة B (إعادة التاريخ)**: «نعم/لا» — لن تُطلب قبل اكتمال Phase 3.
5. **حساب مالك حقيقي على الإنتاج** (اختياري الآن — الدخول يعمل بحسابات الدخان المدوّرة): من جهاز المالك، من مجلد backend، مع DATABASE_URL الخاص بـ Neon:
   ```
   DATABASE_URL="<من Neon>" node scripts/provision-owner.mjs --email <بريد المالك> --yes --suspend-demo-owner
   ```
   (يطبع كلمة مرور مولَّدة مرة واحدة — تُخزَّن ثم تُدار من داخل التطبيق. `--dry-run` أولًا للمعاينة.)
6. **EAS project + EXPO_TOKEN** (لـ 1-B/OTA) و**جهاز iOS** لالتقاط تقرير الانهيار عند الوصول إليه.

## Decisions

- **1-A ليس P0 مفتوحًا كما وُصف**: القياس أثبت أن التصلب الأمني السابق (تدوير الكلمات إلى Secrets + smoke يثبت الدخول أخضر) حسم الجوهر. ما تبقى شكلي (زمن القفل + الدليل). يُعاد ترتيب الأولويات: 1-C ثم 1-B هما جبهتي P0 الحقيقيتين.
- القضية #8 تُغلق بتعليق إثباتي (API) — ليست كتابة على الإنتاج ولا تتطلب بوابة.
- درس مقاسة: «الإثبات قبل الادعاء» نجح — أداة Edit (مطابقة حرفية) منعت دفع إصلاح لخلل غير موجود كان سيبدو التزامًا زائفًا.
- أرقام §1 ذات الفروق (heron 55061/599 · .git 127M · rNNN 14 · Madarek 99) تُعتمد أرقام هذا القياس كأساس جديد.

---

## Done (مع الإثبات) — cycle 2 (2026-11-12)

### 1-C إعادة بناء الفوتر — مكتملة على فرع `ula/1c-footer`

**أداة القبول الجديدة**: `scripts/brand/footer-overlap.mjs` (Playwright، إقلاع Vite ذاتي + قتل مجموعة العمليات — لا عمليات خلفية في صندوق يقتلها). الكشف: D1 فيض أفقي · D2 محتوى خارج صندوق الفوتر · D3 تداخل زوجي بين عناصر محتوى مرئية (الزخارف aria-hidden معفاة). المصفوفة: 8 عروض × فاتح/داكن × RTL.

**القياس قبل** (على main @ 2806a21):
```
FAIL — 118 defect(s) · report: /tmp/footer-before/footer-overlap.json
104× D2 a.fo-legal-link (يفلت 5–102px في كل عرض/سمة) · 8× D2 fo-legal-p/a · 6× D1 .fo-wordmark-reg
ارتفاع متقلب: 622px@1024 → 1239px@390
```

**إعادة البناء** (فرع `ula/1c-footer`، مفوّل داخليًا، تحققتُ من كل بواباته بنفسي):
- `Footer.tsx` +228/−398 و`footer.css` +377/−630 (صافي −423 سطرًا)
- صفر `--fu` (كانت 83) · صفر `position:absolute` للمحتوى (كانت 9) · صفر ارتفاعات مثبتة · صفر هوامش سالبة عبر الحدود
- Grid ثلاثي الأعمدة متجاوب (1/2/3 أعمدة) · Flex+wrap للصف القانوني · شريط الحبر بتدفق طبيعي
- كل المحتوى العربي والروابط محفوظة حرفيًا · `<Logo variant="stacked">` من نظام العلامة الموحّد الموجود · أُبقي `.fo-footer`/`.fo-in` + `data-spec="footer.root|footer.in"` (عقد اختبار mobile-overflow) · أُحذفت 86 سمة data-spec تقابلية مع تقاعد غايتها

**القياس بعد** (أمر: `node scripts/brand/footer-overlap.mjs --out /tmp/footer-verify`):
```
OK 320×light … OK 1920×dark (16/16 خلية)
PASS — zero defects · report: /tmp/footer-verify/footer-overlap.json
```
ارتفاع مستقر محتوى-قيادي: 980–1212 سطح المكتب · 1874–1976 جوال (تكديس).

**البوابات (أعدت تشغيلها بنفسي)**: `verify.sh --fast` PASS كامل (vitest 3037 · حزمة 757.7/770KB gz · css ratchet 52 مثبت) · البوابات التصميمية الثلاث (motion/icons/colors) OK · e2e r305 mobile-overflow 18/18 عبر `TADMORA_E2E_EXECUTABLE` (آلية الريبو المعتمدة لصناديق بلا `playwright install`).

### جراحة Conformance (ضمن 1-C)

- حُذف `mapping/footer.json` + `mapping/footer-r343.json` (خروج قسم الفوتر من المصفوفة — غايته كانت مطابقة الموقع المرجعي المعتزلة بالبرنامج)
- حُذف مدخل footer من `coverage-review.json` (سبب وجوده — «طوبولوجيا المرجع المجمد» — هو ما اعتزل)
- `run.mjs` أصبح يحترم `TADMORA_E2E_EXECUTABLE` (نفس عرف playwright.config — CI لا يضبط المتغير فسلوكه بتّي التكافؤ)
- **المصفوفة الكاملة الجديدة** (أمر: `node scripts/conformance/run.mjs --gate --scroll --interact` مع Vite ذاتيًا):
```
TOTAL 63365/67403 = 94.009% · ratchet floor: 93.1% · gate: PASS (EXIT 0)
```
- **ratchet رُفع 93.1 → 93.9** (الأرضية الصادقة 94.009 مطروحًا هامش تباين CI الموثق ~0.13؛ تُرفع إلى min(3 تشغيلات CI) عند توفرها). القانون «السقف يرتفع فقط» محفوظ.

## In progress

- PR 1-C: بعد دمج هذا التقرير في الفرع — الدفع والـ PR وانتظار CI.

## Next (مرتّب)

1. دمج PR 1-C ثم **1-B انهيار الموبايل** (job android-smoke في mobile.yml: emulator API 34 + رحلة Maestro + بوابة logcat، ثم تشخيص S1–S5 من أثر فعلي).
2. **1-A المتبقي (صغير)**: رسالة القفل بالزمن المتبقي.
3. **Phase 2 تحضيرًا للبوابة A**: `shared/brand.json` + سكربت التحويل + الشعار الجديد (بناء بالتوازي، تنفيذ بعد «نعم»).
4. تدقيق فجوات توحيد `<Logo>` (مواضع 手 SVG خارج نظام brand) + بوابة lint للشعار.

## Decisions (cycle 2)

- قسم الفوتر خرج من مصفوفة Conformance بالكامل في نفس موجة إعادة البناء — إبقاؤه يعني إعادة تجميد مواصفات لمطابقة أنفسنا (عمل بلا غاية).
- أداة `footer-overlap.mjs` تُدخل الريبو (جزء من PR 1-C) — تصبح بوابة قابلة لإعادة التشغيل من أي بيئة.

### تكملة 1-C — بوابة الشعار الموحّد (cycle 2b)

**تدقيق مصدر الشعار الواحد** (قياس كامل): 15 موضعًا لتوقيع قوس العلامة `A8 8 0 0 1 24 15` — كلها مشروعة (مصدرا mark.ts للويب والموبايل · إعادة صياغة brand-assets.mjs الموثقة · التوائم المولَّدة في public/brand + shared/brand بفحص انجراف icons:check · اختبار التثبيت r323). **صفر نسخ يدوية**. الويب: 14 مستهلكًا عبر `<Logo>` (وAuthPage يستخدم mark)؛ الهندسة تُستورد كثوابت فقط في صفحة المواصفات BrandPage. الموبايل: منفذ Logo مولَّد من نفس التوكنات (tokens:check يثبّته). Topbar لا يحمل علامة أصلًا (Sidebar يحمل القفل) — لا فجوة.

**بوابة جديدة `scripts/brand/logo-gate.sh`**: ① توقيع القوس خارج المقاعد المشروعة = فشل ② استيراد ثوابت MARK_* خارج نظام brand وصفحة المواصفات والاختبارات = فشل. **اختُبرت بالطفرة بالاتجاهين** (نسخة يدوية مزروعة → فشل ✅ · استيراد مزروع → فشل ✅ · الحالة النظيفة → نجاح ✅). اكتُشف خلال البناء خلل صعود المجلد (سكربت في scripts/brand/ يحتاج ../.. لا ..) كان يجعل البوابة تمر فراغًا — أُصلح والاختبار الطفري هو ما كشفه (درس: بوابة بلا اختبار طفري = بوابة بلا دليل).

**الربط**: خطوة جديدة في verify.sh (3.6) + سطر في CI Design gates بعد check-icons.sh. `verify.sh --fast` PASS كامل.

## Done — cycle 3 جزء (1-B التأليف، فرع `ula/1b-android-smoke` مدفوع بلا PR بعد)

- **job `android-smoke`** في mobile.yml (+286 سطرًا، صفر حذف من الوظائف القائمة): PG مضمّن → ترحيل 31 → بذر → backend :4000 → APK release بمفتاح مؤقت → محاكي API 34 عبر reactivecircus → رحلة Maestro خماسية الأدوار → logcat دائمًا → بوابة انهيار (FATAL EXCEPTION|ReactNativeJS.*Error|SIGABRT|Invariant Violation).
- **رحلة smoke-role.yaml** بكل محددات مؤصلة في المصدر (جدول ملف:سطر عند المفوّض) + 5 رحلات دورية سابقة (first-open + role-*) دُفعت مع الفرع.
- **حارس S3** في app.config.ts: projectId أصفار ⇒ حذف كامل لإضافة expo-updates وكتلة updates (تحقق: expo prebuild بلا أي أثر تحديثات).
- **تحقق محلي شامل**: typecheck نظيف · jest 1171 ✅ · expo export 7.5MB ✅ · مسار الـ backend كاملًا حيًا في الصندوق (بما فيه دخول الأدوار الخمسة عبر 12345678) · maestro check-syntax OK · YAML سليم.
- **التجربة انطلقت**: mobile workflow run #8 (workflow_dispatch على الفرع — push لا يشغّل mobile.yml إلا على main بسبب مرشح branches).
- **ملاحظة ratchet**: تثبيت 93.9 فشل على CI (قاس 93.8) — أعيد التثبيت 93.8 على قياس CI نفسه وفق بروتوكول السابقة (commit fe68ff7).

## In progress

- PR #12 (1-C كاملًا): بانتظار CI بعد إعادة تثبيت ratchet + بوابة الشعار.
- mobile run #8 (android-smoke التجريبية الأولى تاريخيًا): قيد التشغيل.

---

## Done (مع الإثبات) — cycle 4: الاستئناف وإنهاء Phase 1 (2026-11-12)

**الاستئناف بعد انقطاع السياق** (وفق §0.1): قراءة هذا الملف + `git log -20` + `git status` → main @ `9c7821fd` (بعد دمج PR #11)، وثلاثة فروع Phase 1 مدفوعة من الدورة السابقة (1c/1a/1b) وPR #12 مفتوح. **لم يُعَد أي عمل** — تابعنا من نقطة التوقف.

**المراجعة قبل كل دمج** (انضباط /review يدوي — gstack غير قابل للتشغيل في هذا الصندوق):
- 1-C: قُرئ `footer-overlap.mjs` (تعريفات D1/D2/D3 صريحة) و`footer.css` الجديد — كل مواضع `--fu`/`position:absolute` الباقية في تعليقات التوثيق فقط، و`.fo-fstrip` صار تدفقًا طبيعيًا؛ `Footer.tsx` 370 سطرًا بمحتوى محفوظ حرفيًا.
- 1-A: diff كامل (auth.service.ts +21/-1 مع 3 اختبارات قواعد عربية: 60ث→دقيقة واحدة · 14د→14 دقيقة · أقل من دقيقة→تقريب لأعلى).
- 1-B: mobile.yml android-smoke (+286: PG مضمّن→backend :4000→APK release→محاكي API 34→Maestro→بوابة logcat) · scorecard.mjs في CI (تقرير فقط) · حارس S3 (حذف expo-updates عند projectId الأصفار، يرتفع تلقائيًا عند معرّف حقيقي).

**الدمجات الثلاث** (بوابة الدمج = CI أخضر على رأس الفرع + `mergeable_state=clean`؛ أمر الدمج: `PUT /pulls/N/merge {"merge_method":"merge"}`):

| PR | المحتوى | CI على الرأس | الدمج | حذف الفرع |
|---|---|---|---|---|
| #12 | 1-C الفوتر | 27/27 success (على 83a1502d) — Build/Tests/DB/E2E/Design/Conformance/Lint/Typecheck/Size/deadcode | ✅ merged → `087ed398` | ✅ |
| #13 | 1-A(d) زمن القفل | run CI #78 success | ✅ merged → `98655694` | ✅ |
| #14 | 1-B آلة التشخيص + scorecard + S3 | run CI #80 success | ✅ merged → `bc89025b` | ✅ |

قاعدة «PR واحد مفتوح كحد أقصى» متبنّاة حرفيًا: التسلسل 12→13→14 بلا تراكب.

**ما بعد الدمج على main** (تشغيل تلقائي عند push، أمر القياس: `GET /actions/runs?branch=main`):
```
CI #79 · Size gate #79 · deadcode #79 · Deploy (Vercel) #6 · Deploy smoke #6 — completed success (13:00Z)
```
أي: **الإنتاج نُشر بالفوتر الجديد ورسالة القفل الجديدة، ودخان النشر (تسجيل دخول الأدوار الثلاثة + لوحة الطالب) أخضر بعد النشر**.

**Mobile #9 — أول تشغيل فعلي لـ android-smoke على main** (id=43225258321، push @ bc89025b، بدأ 13:13:34Z): run #8 السابق على الفرع أُلغي قبل الاكتمال، فالرقم المرجعي التشغيلي الأول هو هذا. مدة السقف 50 دقيقة؛ نتيجته تُقرأ في الدورة القادمة (نجاح → خطوة نحو معيار «3 تشغيلات متتالية بلا FATAL»؛ فشل → **أول أثر نهيار مرصود تاريخيًا** يفتح التشخيص الفعلي S1–S5 من logcat artifact لا من الفرضيات).

**ملاحظة بيئة (للدورات القادمة)**: العمليات الخلفية في هذا الصندوق تُقتل بين استدعاءات الوكيل (npm ci محلي عبر nohup لم يُكمل — 7.9M جزئية ثم مات). الاتكال على CI كمصدر الإثبات، وأي أمر محلي طويل يجب أن يكون ذاتي الاكتمال داخل استدعاء واحد.

## In progress (cycle 4)

- **Mobile #9** (android-smoke على main، id=43225258321): قيد التشغيل — نتيجته أول بند في الدورة القادمة.

## Next (cycle 4، مرتّب)

1. قراءة نتيجة Mobile #9: نجاح → إعادة التشغيل حتى 3 متتالية (معيار قبول 1-B) · فشل → سحب logcat artifact وتشخيص S1–S5 من الأثر الفعلي.
2. أول قياس للوحة §7 من `scorecard.mjs` (اشتغل ضمن CI #79) — نسخ نتيجته إلى هنا كأساس لوحة القياس.
3. Phase 2 تحضيرًا للبوابة A: `shared/brand.json` + سكربت التحويل + الشعار الجديد (بلا تنفيذ قبل «نعم» المالك).
4. حلقة الكمال §4: رحلات الأدوار الخمسة e2e ويب + تدقيق بصري للصفحات (منهجية impeccable audit يدويًا) + `/cso` أمنيًا (منهجية STRIDE يدويًا).
5. iOS (لا emulator على Linux): نفس ما وثّقه البرنامج — بناء Hermes + telemetry + خطوات المالك الثلاث لالتقاط تقرير الانهيار + شاشة «نسخ تقرير الخطأ».

## Decisions (cycle 4)

- أسلوب الدمج: merge-commit (توافقًا مع تاريخ الريبو)؛ بوابة الدمج = CI أخضر + clean؛ لا دمج على تعطّل.
- الإثبات يعتمد CI في هذه البيئة (القيود أعلاه) — مخرجات API هي الدليل الطرفي.
- آلية الاستمرار بين الدورات: مهمة مجدولة (cron) كل ساعتين في بيئة الوكيل تقرأ هذا الملف و`git log -20` و`git status` وتتابع من «Next». تُعطَّل بأمر المالك. الاعتماد المخزّن في `~/.config/ulara/gh-token` (خارج الشجرة، لا يُطبع أبدًا).

### لوحة القياس §7 — أول قياس آلي (من CI #81، Build job، main @ bc89025b، 2026-11-12T13:16Z)

مخرجات `node scripts/scorecard.mjs` كما طبعتها الوظيفة (سجل التشغيل 43225258816):

| المقياس | الحد | المقاس | الحكم | الإثبات/الأداة |
|---|---|---|---|---|
| tracked files | < 1,000 | 2651 | ⚠️ Phase-3 pending | `git ls-files \| wc -l` |
| md files | < 40 | 442 | ⚠️ over | `git ls-files '*.md' \| wc -l` |
| docs/ files | ≤ ~15 | 586 | ⚠️ over | `git ls-files 'docs/**' \| wc -l` |
| .git size | < 15MB (post Gate B) | 31.5MB | ⚠️ | du of .git (إعادة التاريخ هي البوابة B) |
| JS bundle (gz) | ≤ 770KB | 757.7 KB | ✅ | `node scripts/check-bundle-size.mjs` |
| no-trace gate | 0 (post Gate A) | 60026 | ⚠️ pre-rename | `git grep -IiE 'tadmora\|…'` — سطح إعادة التسمية المتبقي |
| npm audit high/critical (prod) | 0 | ? | ⚠️ instrument | `npm audit --omit=dev` |
| login on production (web+mobile roles) | success, proven | deploy-smoke run #5 green (2026-11-11) | ✅ | workflow Deploy smoke — Login ×3 + dashboard 200 |
| mobile crashes in emulator | 0 على 3 تشغيلات متتالية × 5 أدوار | android-smoke job — أول تشغيل جارٍ | ⚠️ | workflow Mobile → android-smoke |
| footer overlap / horizontal overflow | 0 @ 320–1920 × l/d | PASS — zero defects (16 خلية) | ✅ | `node scripts/brand/footer-overlap.mjs` |
| conformance ratchet floor | صعود رتيب | 93.8% | ✅ | `scripts/conformance/ratchet.json` (بوابة CI) |
| axe a11y serious/critical | 0 · تباين ≥ 4.5:1 · لمس ≥ 44px | instrument pending | ⚠️ | Phase 4: بوابة axe |
| Lighthouse (موبايل 4G) home/login/dashboards | P≥90 A≥95 BP≥95 SEO≥95 | instrument pending | ⚠️ | Phase 4: Lighthouse CI |
| console errors in journeys | 0 | e2e journeys assert zero console errors | ⚠️ | يُتحقق في tests/e2e (التقاط console لكل رحلة) |

**قراءة اللوحة**: أخضر اليوم = الحزمة · الفوتر (16/16) · الدخول على الإنتاج · ratchet 93.8. الأصفر كله مرتبط بأطوار لاحقة مبرمجة (Phase 3 التنظيف · البوابة A إعادة التسمية · البوابة B التاريخ · أدوات Phase 4) — لا بند أحمر مضروم.

### إخفاق E2E عابر ومعالجته (بروتوكول §0.3 — flake مُثبَت)

- CI #82 (حدث push) على نفس الـSHA فشل بمواصفة واحدة: `r305-shell-heron.e2e.ts:284` — `TimeoutError: page.waitForFunction: Timeout 8000ms exceeded` (محاولة + retry)، بينما **156 نجحت** في نفس الوظيفة.
- نفس المحتوى نجح كاملًا في CI #81 (main @ bc89025b) وCI #83 (pull_request على نفس الـSHA) — والتغيير في PR #15 مستندي فقط ⇒ **flake مُثبَت**.
- الإجراء الحرفي للعقد: إعادة تشغيل واحدة لوظائف الوظيفة الفاشلة — `POST /actions/runs/43225448304/rerun-failed-jobs` → HTTP 201.

---

## Done (مع الإثبات) — cycle 5 (2026-11-12)

**الاستئناف بعد حذف الجدولة**: طلب المالك حذف مهمة الـ cron (526606 — حُذفت عبر API، HTTP success) ومتابعة العمل في جلسة تفاعلية «بعدد وكلاء فرعيين». استؤنف من «Next» بلا إعادة عمل. **تنبيه أمني متكرر: ظهر الـ PAT مرة أخرى في محادثة بشرية ⇒ يلزم التدوير (Blocked-Owner 1).**

### البند الأول في Next: قراءة نتيجة Mobile #9 (android-smoke)

**النتيجة: cancelled — والأثر الجنائي فُقد، والسبب البنيوي وُجد وأُصلح:**
```
steps: 14 Emulator + Maestro five-role journey → completed/FAILURE (13:40:44→13:48:27)
       15 Capture logcat (always) → in_progress → علقت 23 دقيقة (13:48→14:11:58)
       16/17 crash gate + upload → pending (لم تُشغَّل قط)
job conclusion: cancelled · run conclusion: cancelled · cancelled_by: None
job logs: HTTP 200 → BlobNotFound (سجلات الوظائف الملغاة تُمحى — حاولنا مرتين)
```
- **العلة الهندسية (مُثبَتة من الخطوات الزمنية)**: خطوة «Capture logcat» تعمل **بعد** تفكيك reactivecircus للمحاكي ⇒ `adb logcat -d` يعلق بلا جهاز حتى مهلة الوظيفة (50د) فيُلغى كل شيء ويضيع الأثر بالضبط عند أول فشل حقيقي.
- **سبب فشل رحلة Maestro نفسها: غير معروف** (بلا أثر) — التشغيل القادم يحمل الأثر المحصَّن.
- CI #82 attempt 2 (rerun-flake من cycle 4): انتهى cancelled (إلغاء تزامني آلي) — وflake مُثبَت أصلًا من #81/#83 الأخضرتين على المحتوى نفسه؛ القضية تبقى مغلقة.

### الوكلاء الفرعيون الثلاثة (worktrees متوازية + node_modules symlink، منافذ 5181/5182 معزولة)

| الوكيل | الفرع → PR → الدمج | المضمون (إثبات) |
|---|---|---|
| **2-a** brand kit | `ula/2a-brand-kit` → PR #16 → **merged `1f1e5bc2`** | **تحضير البوابة A كاملًا**: `shared/brand.json` (مصدر الاسم الواحد: أُلارا/Ulara/slug/domain/scheme/bundle_id/storage_prefix + لوحة الألوان مثبتة على design-tokens) · `scripts/brand/ulara-kit.mjs` مولِّد حتمي · 10 SVG (علامة U-وعائية شبكة 32، ضربة حبر واحدة، حجر برتقالي واحد، **صفر أقواس** — التوقيع الممنوع مستحيل بنيويًا؛ lockups عربي/لاتيني أفقي/عمودي، favicon 16/32 مؤلَّف للـ16px، appicon-1024، OG 1200×630 RTL) · 7/7 اختبارات node · logo-gate PASS · فحص عرض Playwright عند 16px على الخلفيتين (غير فارغ، U مقروء، تمركز appicon). CI على PR #16: CI/Size/deadcode أخضر (حدثا push+PR) |
| **2-b** axe gate | `ula/2b-axe-gate` → PR #17 → **merged `b2454b8e`** | **بند §7 «axe instrument pending» صار مقيسًا**: `scripts/brand/a11y-gate.mjs` (إقلاع Vite ذاتي :5182 + chromium + حقن axe.min.js المرفوع من @axe-core/react — **صفر اعتماديات جديدة، صفر قواعد معطلة**)، مصفوفة `/` · `/auth` · `/404` × فاتح/داكن × 390/1280، RTL. **القياس الأول: 25 serious / 0 critical — كلها على الواجهة الرئيسية** (`/auth` و`/404` نظيفتان تمامًا). أرضية ratchet مثبتة (25/0، السقف لا يهبط) · wiring: verify.sh خطوة 3.7 (fast) + CI (e2e job) + scorecard يقرأ التقرير. verify.sh --fast: FAST PASS. CI على PR #17 أخضر — **البوابة اشتغلت على CI فعلًا** |
| **2-c** smoke hardening | `ula/2c-smoke-hardening` → PR #18 → **merged `83c1de35`** | إصلاح علة #9 أعلاه: logcat + adb-devices تُلتقطان **داخل** سكربت المحاكي (الجهاز حي) بمهلة `timeout 60` مع بديل إعلامي عند الفشل · حذف خطوة adb اللاحقة العالقة · مهلة الوظيفة 50→65 · رفع adb-devices.txt ضمن الأثر. **زائد**: identity-gate كانت **تفشل على main نفسه** (6 تسريبات: scorecard.mjs يتهجّى أنماط القياس نفسها + LEDGER يقتبس أرقام §1) — ضُمّا للقائمة البيضاء بمبرر في ترويسة البوابة → PASS. YAML سليم (python yaml) |

قاعدة «PR واحد مفتوح» ملتزمة حرفيًا: 16 → 17 → 18 متتابعة بلا تراكب.

### قياسات لوحة §7 — تغيّرات هذه الدورة

| المقياس | قبل | بعد | الإثبات |
|---|---|---|---|
| axe serious/critical | instrument pending ⚠️ | **25S/0C مقيسًا، 0 فوق الأرضية** (12 خلية) — `/auth` و`/404` صفر | `node scripts/brand/a11y-gate.mjs` محليًا + CI e2e job على PR #17 |
| بوابة الهوية (scorecard no-trace الداخلية) | identity-gate فاشلة على main (6) | PASS (مقعدا قياس/سجل موثقان) | `bash scripts/brand/identity-gate.sh` |
| android-smoke forensics | تضيع عند أي فشل رحلة | تنجو (التقاط داخل السكربت + مهلة 60د + رفع الحالة) | mobile.yml @ 83c1de35 |
| الباقي | — | بلا تغيير وظيفي (الحزمة 757.7KB ✅ عبر 3 PRs) | CI/Size/deadcode أخضر ×3 |

**قائمة حرق §4 (مزروعة من قياس 2-b):** color-contrast فاتح فقط على `/` (13 عقدة: map.finding1f–4f، problem.indextext.1–4، platform.img1، .lp-numeral) · aria-prohibited-attr `.wr` (aria-label على span عام) · aria-hidden-focus (جوال: `.pm-dots`، platform.row2) · scrollable-region-focusable (جوال: `.hro-work`، `.wy-track`).

## In progress (cycle 5)

- **Mobile 43245122721** (main @ 83c1de35): android-smoke بأثر محصَّن — أول بند في الدورة القادمة (نجاح → 2 إضافيان للسلسلة الثلاثية · فشل → **android-smoke-forensics يُرفع الآن مهما حدث** → تشخيص S1–S5 من logcat فعلي).
- **Deploy smoke 43245298721** (workflow_dispatch على main بعد الدمجات): نتيجته تُقرأ في الدورة القادمة (آخر أخضر 13:00Z @ 98655694).
- CI/Size/deadcode على main @ 83c1de35 (running).

## Next (مرتّب)

1. قراءة Mobile 43245122721 + Deploy smoke 43245298721.
2. حرق قائمة a11y الـ25 (أولًا color-contrast على الواجهة الرئيسية الفاتحة — العقد الـ13 معروفة المحددات)؛ الأرضية تُخفَّض مع كل حرق (لا ترتفع أبدًا).
3. Phase 2 عند «نعم» المالك: عدة الاسم جاهزة (تغيير `shared/brand.json` + توليد) — يجهَّز codemod التحويل الشامل أثناء الانتظار.
4. أدوات §7 المتبقية: Lighthouse CI · npm audit high/critical (scorecard يطبع ؟ — تفعيل القياس في CI).
5. iOS: خطوات المالك الثلاث + شاشة «نسخ تقرير الخطأ» داخل التطبيق.

## Decisions (cycle 5)

- **البيئة المحلية استُعيدت**: npm ci (13s جذر + 12s workspaces، كاش دافئ) أعاد vite/playwright/chromium/axe.min.js للحياة (إقلاع Vite في 2s) — الوكلاء تحققوا محليًا مرة أخرى؛ CI يبقى مصدر إثبات الدمج.
- **flake useScrollRestoration مُوثّق عبر worktrees**: فشل 1/3036 في بيئة 2-a ونجح كاملًا في بيئة 2-b + 7/7 معزولة — نفس المحتوى، نتائج مختلفة = flake (كل PRs خضراء دونه).
- نمط worktree + symlink node_modules للمقارَنة الفرعية آمن وفعّال (منافذ معزولة تمنع التصادم).
- scorecard يقرأ تقرير a11y من /tmp — على CI يطبع pending بتصميم صادق (وظيفة build ≠ وظيفة e2e)؛ تحسين لاحق: تمرير التقرير بين الوظائف.
- دخان النشر يُطلق يدويًا عند دمجات لا تلمس مساراته — إثبات إنتاج دوري بلا انتظار مرشّح.

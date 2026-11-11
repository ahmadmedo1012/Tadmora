-- Phase Ω — DEMO IDENTITY NEUTRALIZATION (idempotent data migration)
--
-- TADMORA is an independent multi-tenant University Operating System: not
-- any university's website, no institutional affiliations. This migration
-- converts the two demo tenants out of the retired fictional-university /
-- invented-campus era (r188: «جامعة تادمورا التجريبية» + «مؤسسة الأندلس
-- التعليمية», a 25-faculty catalogue across the synthetic campuses حرم
-- المعرفة · حرم الابتكار · حرم البيان) into clearly-labeled NEUTRAL
-- WORKSPACES with an honest three-faculty set:
--
--   · «مساحة عمل تادمورا التجريبية» (slug tadmora-demo — keeps the legacy
--     row id inst-zawia-showcase, a stable FK anchor, never public identity)
--   · «مساحة عمل تجريبية ثانية» (slug alandalus-demo)
--
-- Every statement is guarded by a WHERE on the OLD value (the r188
-- pattern), so:
--   · an ESTABLISHED database is converted in place — rows are UPDATED,
--     never deleted-and-recreated, with exactly ONE deliberate class of
--     deletions: the retired 25-faculty catalogue rows themselves (their
--     dependents are first re-parented onto the kept rows, so no user or
--     demo data is ever destroyed);
--   · a FRESH database (faculties arrive only from the Phase Ω seed)
--     no-ops on every statement.
--
-- The three keeper rows are re-mapped onto the rows the old seed created
-- (row ids and every FK stay stable):
--   كلية تقنية المعلومات @ حرم المعرفة  →  كلية علوم الحاسوب   @ افتراضي
--   كلية الهندسة       @ حرم المعرفة  →  كلية الهندسة        @ افتراضي
--   كلية الاقتصاد      @ حرم المعرفة  →  كلية إدارة الأعمال   @ افتراضي
-- city 'افتراضي' is the demo-workspace marker: the workspaces are virtual —
-- no city, no campus, no location claim.

-- ── 1. Institution renames (guarded by the r188-era names) ──────────
UPDATE "Institution"
SET "name" = 'مساحة عمل تادمورا التجريبية',
    "nameEn" = 'Tadmora Experimental Workspace'
WHERE "slug" = 'tadmora-demo'
  AND "name" = 'جامعة تادمورا التجريبية';

UPDATE "Institution"
SET "name" = 'مساحة عمل تجريبية ثانية',
    "nameEn" = 'A Second Experimental Workspace'
WHERE "slug" = 'alandalus-demo'
  AND "name" = 'مؤسسة الأندلس التعليمية';

-- ── 2. Keeper faculty re-maps (guarded by the r188 (name, city) rows) ──
UPDATE "Faculty"
SET "name" = 'كلية علوم الحاسوب', "nameEn" = 'Computer Science', "city" = 'افتراضي'
WHERE "institutionId" = 'inst-zawia-showcase'
  AND "name" = 'كلية تقنية المعلومات' AND "city" = 'حرم المعرفة';

UPDATE "Faculty"
SET "nameEn" = 'Engineering', "city" = 'افتراضي'
WHERE "institutionId" = 'inst-zawia-showcase'
  AND "name" = 'كلية الهندسة' AND "city" = 'حرم المعرفة';

UPDATE "Faculty"
SET "name" = 'كلية إدارة الأعمال', "nameEn" = 'Business Administration', "city" = 'افتراضي'
WHERE "institutionId" = 'inst-zawia-showcase'
  AND "name" = 'كلية الاقتصاد' AND "city" = 'حرم المعرفة';

-- Second-workspace faculty: no real-city claim.
UPDATE "Faculty"
SET "city" = 'افتراضي'
WHERE "institutionId" = (SELECT "id" FROM "Institution" WHERE "slug" = 'alandalus-demo')
  AND "name" = 'كلية تقنية المعلومات' AND "city" = 'طرابلس';

-- ── 3. Retire the invented-campus catalogue (the remaining 22 rows) ──
-- Every remaining demo-tenant row in a synthetic campus city is deleted —
-- but ONLY after its dependents are re-parented onto the CS keeper row, so
-- no department, student profile, scoped-admin scope, question category,
-- exam template, leadership appointment or invite code is ever destroyed.
-- Department ("facultyId", "name") is unique, so a moving department whose
-- name already exists under the keeper is suffixed with its retiring
-- faculty's name (in practice the seeded set never collides; the suffix
-- keeps the write total, never partial).
DO $$
DECLARE
  cs_faculty_id TEXT;
  f RECORD;
BEGIN
  -- Nothing to retire (fresh database seeded by the Phase Ω seed): no-op.
  IF NOT EXISTS (
    SELECT 1
    FROM "Faculty" fa
    JOIN "Institution" i ON i."id" = fa."institutionId"
    WHERE i."slug" = 'tadmora-demo'
      AND fa."city" IN ('حرم المعرفة', 'حرم الابتكار', 'حرم البيان')
  ) THEN
    RETURN;
  END IF;

  -- The CS keeper row (renamed in section 2 above).
  SELECT fa."id" INTO cs_faculty_id
  FROM "Faculty" fa
  JOIN "Institution" i ON i."id" = fa."institutionId"
  WHERE i."slug" = 'tadmora-demo'
    AND fa."name" = 'كلية علوم الحاسوب' AND fa."city" = 'افتراضي'
  LIMIT 1;

  -- Fail closed: without the keeper the catalogue stays untouched (the
  -- statement set above is already applied; a later manual pass decides).
  IF cs_faculty_id IS NULL THEN
    RETURN;
  END IF;

  FOR f IN
    SELECT fa."id" AS fid, fa."name" AS fname
    FROM "Faculty" fa
    JOIN "Institution" i ON i."id" = fa."institutionId"
    WHERE i."slug" = 'tadmora-demo'
      AND fa."city" IN ('حرم المعرفة', 'حرم الابتكار', 'حرم البيان')
      AND fa."id" <> cs_faculty_id
    ORDER BY fa."createdAt" ASC, fa."id" ASC
  LOOP
    -- (a) departments move under the CS keeper; a colliding name is
    --     suffixed first so the unique (facultyId, name) key never splits.
    UPDATE "Department" d
    SET "name" = d."name" || ' — ' || f.fname
    WHERE d."facultyId" = f.fid
      AND EXISTS (
        SELECT 1 FROM "Department" x
        WHERE x."facultyId" = cs_faculty_id AND x."name" = d."name" AND x."id" <> d."id"
      );
    UPDATE "Department" d
    SET "facultyId" = cs_faculty_id
    WHERE d."facultyId" = f.fid;

    -- (b) every other dependent re-points at the CS keeper (preserving the
    --     row's meaning instead of relying on the SET-NULL FK actions).
    UPDATE "StudentProfile" sp  SET "facultyId" = cs_faculty_id WHERE sp."facultyId" = f.fid;
    UPDATE "QuestionCategory" qc SET "facultyId" = cs_faculty_id WHERE qc."facultyId" = f.fid;
    UPDATE "ExamTemplate" et    SET "facultyId" = cs_faculty_id WHERE et."facultyId" = f.fid;
    UPDATE "User" u             SET "scopeFacultyId" = cs_faculty_id WHERE u."scopeFacultyId" = f.fid;
    UPDATE "TeacherProfile" tp  SET "positionFacultyId" = cs_faculty_id WHERE tp."positionFacultyId" = f.fid;
    UPDATE "InviteCode" ic      SET "facultyId" = cs_faculty_id WHERE ic."facultyId" = f.fid;

    -- (c) the retired catalogue row itself (childless by construction).
    DELETE FROM "Faculty" WHERE "id" = f.fid;
  END LOOP;
END $$;

-- ── 4. Demo content carrying the retired identity (guarded) ─────────
UPDATE "ResearchPaper"
SET "title" = 'تأثير استراتيجية الصف المعكوس على تحصيل طلاب الهندسة في مساحة عمل تادمورا التجريبية'
WHERE "title" = 'تأثير استراتيجية الصف المعكوس على تحصيل طلاب الهندسة في جامعة تادمورا التجريبية';

UPDATE "ResearchPaper"
SET "title" = 'تحليل أمن تطبيقات الجوّال المصرفية',
    "abstract" = 'فحص أمني لأبرز ثلاثة تطبيقات مصرفية تجريبية، تحت أربعة محاور: تشفير الاتصال، إدارة الجلسة، تخزين البيانات الحساسة، ومقاومة الهندسة العكسية. تقدّم الدراسة توصيات عملية لرفع المستوى الأمني.'
WHERE "title" = 'تحليل أمن تطبيقات الجوّال المصرفية الليبية';

UPDATE "TrainingTrack"
SET "summary" = 'كيف تستفيد من نموذج الصف المعكوس الذي تعتمده المنصّة لرفع التحصيل.'
WHERE "summary" = 'كيف تستفيد من نموذج الصف المعكوس الذي تعتمده الجامعة لرفع التحصيل.';

UPDATE "TrainingTrack"
SET "summary" = 'مسار متخصص ضمن مسارات العرض المتقدمة.'
WHERE "summary" = 'مسار متخصص ضمن رؤية الجامعة التجريبية المستقبلية.';

UPDATE "TrainingLesson"
SET "title" = 'تجربتنا مع الإنجليزية في بيئة العرض',
    "contentMarkdown" = 'في تجارب العرض على المنصة باستخدام استراتيجية الصف المعكوس، حقق الطلاب: 40% تحسنًا في الاستيعاب، 70% زيادة في المشاركة، 90% تحقيقًا لأهداف التعلم. الالتزام بالمنهج هو المفتاح.'
WHERE "title" = 'تجربتنا مع الإنجليزية في جنوب ليبيا';

UPDATE "TrainingLesson"
SET "contentMarkdown" = replace("contentMarkdown", 'دراسات جامعة برينستون أثبتت', 'دراسات علمية أثبتت')
WHERE "contentMarkdown" LIKE '%جامعة برينستون%';

-- Only the SEEDED demo teacher's profile (teacher@test.ly) — never a real
-- user's certifications.
UPDATE "TeacherProfile" tp
SET "certifications" = '[
  {"title":"دكتوراه في علوم الحاسوب","issuer":"جهة منح أكاديمية — بيانات عرض","year":2014},
  {"title":"Oracle Certified Professional","issuer":"جهة اعتماد تقني — بيانات عرض","year":2018},
  {"title":"تدريب الذكاء الاصطناعي للتعليم","issuer":"برنامج تدريب — بيانات عرض","year":2023}
]'::jsonb
WHERE EXISTS (SELECT 1 FROM "User" u WHERE u."id" = tp."userId" AND u."email" = 'teacher@test.ly')
  AND (tp."certifications"::text LIKE '%مانشستر%' OR tp."certifications"::text LIKE '%Stanford%');

UPDATE "Job"
SET "location" = 'عن بُعد', "salary" = '2,500$'
WHERE "company" = 'شركة تقنية المعرفة' AND "location" = 'حرم المعرفة · حضوري';

UPDATE "Job"
SET "company" = 'بنك تجاري — بيانات عرض', "location" = 'هجين', "salary" = '3,200$'
WHERE "company" = 'البنك التجاري الليبي' AND "location" = 'طرابلس · هجين';

UPDATE "Job"
SET "company" = 'حاضنة تقنية — بيانات عرض', "location" = 'عن بُعد'
WHERE "company" = 'ليبيا تك هاب' AND "location" = 'مصراتة · عن بُعد';

UPDATE "MoocCourse"
SET "organization" = 'مزوّد دورات مفتوحة'
WHERE "organization" IN ('شراكة Coursera', 'شراكة Udemy');

UPDATE "Notification"
SET "title" = 'تم نشر بحثك في مكتبة مساحة العمل'
WHERE "title" = 'تم نشر بحثك في مكتبة الجامعة';

UPDATE "Notification"
SET "body" = 'انضم إلى الندوة يوم 12 يونيو مع نخبة من خبراء التقنية'
WHERE "body" LIKE '%متحدثين من Stanford%';

UPDATE "QuestionCategory"
SET "description" = 'بنك أسئلة هندسة البرمجيات — موحد لكليات الهندسة وعلوم الحاسوب'
WHERE "slug" = 'software-engineering';

UPDATE "ExamTemplate"
SET "title" = 'اختبار موحد — أساسيات هندسة البرمجيات (كلية علوم الحاسوب)'
WHERE "title" = 'اختبار موحد — أساسيات هندسة البرمجيات (كلية تقنية المعلومات)';

UPDATE "Announcement"
SET "title" = 'بدء التسجيل في الدورات الصيفية',
    "body" = 'يفتح قسم علوم الحاسوب التسجيل في الدورات الصيفية اعتبارًا من الأسبوع القادم. المقاعد محدودة.'
WHERE "title" = 'بدء التسجيل في دورات الأندلس الصيفية';

UPDATE "Announcement"
SET "body" = 'تستضيف كلية علوم الحاسوب محاضرة عن بُعد مع أحد خبراء الذكاء الاصطناعي يوم الخميس عبر منصّة تادمورا. الحضور مفتوح لجميع طلاب الكلية.'
WHERE "title" = 'محاضرة افتراضية مع خبير عالمي في الذكاء الاصطناعي'
  AND "body" LIKE '%البروفيسور أندرو نج%';

UPDATE "Competition"
SET "description" = 'تستقبل مساحة العمل البحوث الطلابية في مجال الذكاء الاصطناعي وتطبيقاته. الفائز يحصل على منحة لحضور مؤتمر دولي.',
    "prize" = 'منحة مؤتمر دولي + 2,000$'
WHERE "title" = 'مسابقة أفضل بحث طلابي في الذكاء الاصطناعي';

UPDATE "Competition"
SET "prize" = '5,000$ + فرصة تدريب'
WHERE "title" = 'هاكاثون تادمورا الأول' AND "prize" = '5,000 د.ل + فرصة تدريب';

UPDATE "Competition"
SET "title" = 'تحدي البرمجة الثاني',
    "description" = 'مسابقة برمجة لمتدربي مساحة العمل الثانية — حل ثلاث مسائل خوارزمية خلال 48 ساعة. الفائز يحصل على شهادة تفوق ودورة متقدمة مجانية.'
WHERE "title" = 'تحدي الأندلس للبرمجة الأول';

UPDATE "CampusEvent"
SET "location" = 'القاعة الكبرى — بث مباشر'
WHERE "title" = 'يوم المهنة 2026' AND "location" = 'القاعة الكبرى — الحرم الجامعي الرئيسي';

UPDATE "CampusEvent"
SET "title" = 'ندوة: مستقبل التعليم الرقمي',
    "description" = 'ندوة حوارية حول رؤية التعليم 2030 وكيف تبني المؤسسات مسارها الخاص على منصّة تادمورا.'
WHERE "title" = 'ندوة: مستقبل التعليم في ليبيا';

UPDATE "CampusEvent"
SET "location" = 'المكتبة المركزية — بيانات عرض'
WHERE "title" = 'ورشة عمل: مهارات البحث العلمي' AND "location" = 'مكتبة الجامعة المركزية';

UPDATE "CampusEvent"
SET "title" = 'ملتقى تقني تجريبي',
    "description" = 'ملتقى نصف يوم يعرض مشاريع متدربي مساحة العمل الثانية في البرمجة وتحليل البيانات، مع جلسة أسئلة وأجوبة مع مدرّبي القسم.',
    "location" = 'قاعة رئيسية — بيانات عرض'
WHERE "title" = 'ملتقى الأندلس التقني';

-- The seeded second-workspace offering room (upsert key stays stable).
UPDATE "CourseOffering"
SET "room" = 'قاعة تجريبية أ'
WHERE "room" = 'قاعة الأندلس أ';

-- The seeded second-workspace community post (guard on the exact seeded
-- (author, body) pair — a real user's post is never touched).
UPDATE "Post"
SET "hashtags" = array_replace("hashtags", 'الأندلس', 'دعم')
WHERE "body" = 'فتحت ساعات الدعم لمقرر البرمجة يوم الخميس'
  AND "hashtags" @> ARRAY['الأندلس']::text[];

-- ULARA REBRAND — the demo workspace + seeded content move to the ULARA
-- identity (guarded, idempotent data migration).
--
-- DEPENDENCY (ordering is load-bearing): this migration runs IMMEDIATELY
-- AFTER 20261111000000_r_omega_demo_neutralization (Phase Ω) on every
-- established database. Because of that, every guard below is DUAL: it
-- matches the pre-Ω value OR the post-Ω value of the same row, so the
-- statements are correct whether the row was last written by the r188
-- seed/migration, by the Ω migration, or by the pre-rebrand seed — and
-- they no-op entirely on a database the Ω-era seed already brought to
-- the Ω state (fresh installs seeded by the NEW ULARA seed already carry
-- the target values, so every guard misses and the migration is a no-op:
-- a fresh seeded DB and a rebranded established DB converge on the same
-- rows).
--
-- What is renamed (everything the product surface can display):
--   · Institution row inst-zawia-showcase: slug tadmora-demo → ulara-demo
--     (the ROW ID IS NEVER CHANGED — it is the stable FK anchor every
--     test and FK depends on), name → «مساحة عمل أُلارا التجريبية»,
--     nameEn → 'Ulara Experimental Workspace'.
--   · Seeded content still carrying the retired brand after Ω: MOOC
--     organizations, the research-paper title/abstract, the onboarding
--     training track title + lesson bodies, the plagiarism-policy exam
--     question, the platform-launch announcement (title + bodies), the
--     first hackathon competition title, the digital-education seminar
--     description, lecture poster art path, the certificate issuer, and
--     the demo workspace's synced UniversityFact sheet.
--   · The second workspace (alandalus-demo) carries no retired-brand
--     strings and is deliberately untouched.
--
-- What is NEVER touched (deliberate exclusions — see the codemod spec):
--   · User rows — including the real owner account and every
--     @demo.tadmora.ly pilot-cohort email. The demo email domain is a
--     LOAD-BEARING data key (the registrar's «حذف بيانات العرض» sweep
--     selects User.email ENDS WITH '@demo.tadmora.ly'); renaming it in
--     the database would orphan that sweep and diverge established
--     databases from fresh seeds. Retiring that domain is a separate,
--     owner-decided data migration.
--   · AuditLog, LoginEvent, PasswordResetToken, _prisma_migrations —
--     history and security tables stay byte-identical.
--
-- Re-run safety: every statement guards on the exact OLD value, so a
-- second apply hits zero rows.

-- ── 1. Institution identity (the labeled demo workspace) ────────────
-- Guards cover the r188-era university label AND the Ω-era workspace
-- label (Ω renamed «جامعة …» → «مساحة عمل …» but kept the retired
-- brand word; this migration finishes the job).
UPDATE "Institution"
SET "name" = 'مساحة عمل أُلارا التجريبية'
WHERE "slug" IN ('tadmora-demo', 'ulara-demo')
  AND "name" IN ('جامعة تادمورا التجريبية', 'مساحة عمل تادمورا التجريبية');

UPDATE "Institution"
SET "nameEn" = 'Ulara Experimental Workspace'
WHERE "slug" IN ('tadmora-demo', 'ulara-demo')
  AND "nameEn" IN ('Tadmora Demo University', 'Tadmora Experimental Workspace');

-- The slug rename itself — guarded against a would-be unique collision
-- (if a ulara-demo row already exists, the rename is skipped rather than
-- failing the migration; the name statements above have already healed
-- whichever row owns the label).
UPDATE "Institution"
SET "slug" = 'ulara-demo'
WHERE "slug" = 'tadmora-demo'
  AND NOT EXISTS (SELECT 1 FROM "Institution" WHERE "slug" = 'ulara-demo');

-- ── 2. Seeded content still carrying the retired brand after Ω ──────

-- The platform MOOC provider label (two seeded rows; no shadda in this
-- spelling — guarded on the exact seeded value).
UPDATE "MoocCourse"
SET "organization" = 'منصة أُلارا'
WHERE "organization" = 'منصة تادمورا';

-- The flagship seeded research paper: title (dual guard — r188 wrote the
-- «جامعة …» title, Ω renamed it to the «مساحة عمل …» form, both still
-- carry the retired brand) + the abstract's platform mention.
UPDATE "ResearchPaper"
SET "title" = 'تأثير استراتيجية الصف المعكوس على تحصيل طلاب الهندسة في مساحة عمل أُلارا التجريبية'
WHERE "title" IN (
  'تأثير استراتيجية الصف المعكوس على تحصيل طلاب الهندسة في جامعة تادمورا التجريبية',
  'تأثير استراتيجية الصف المعكوس على تحصيل طلاب الهندسة في مساحة عمل تادمورا التجريبية'
);

UPDATE "ResearchPaper"
SET "abstract" = replace("abstract", 'بمنصة تادمورا', 'بمنصة أُلارا')
WHERE "abstract" LIKE '%بمنصة تادمورا%';

-- The onboarding training track title (upsert key is the slug
-- 'platform-onboarding' — the title is display data).
UPDATE "TrainingTrack"
SET "title" = 'كيف تستخدم منصّة أُلارا'
WHERE "title" = 'كيف تستخدم منصّة تادمورا';

-- Training lesson bodies: the welcome lesson and the AI-in-education
-- lesson both mention the platform; one replace covers every occurrence.
UPDATE "TrainingLesson"
SET "contentMarkdown" = replace("contentMarkdown", 'منصّة تادمورا', 'منصّة أُلارا')
WHERE "contentMarkdown" LIKE '%منصّة تادمورا%';

-- The seeded plagiarism-policy exam question.
UPDATE "Question"
SET "prompt" = 'ما النسبة القصوى المقبولة للتشابه (الانتحال) في البحث العلمي على منصّة أُلارا؟'
WHERE "prompt" = 'ما النسبة القصوى المقبولة للتشابه (الانتحال) في البحث العلمي على منصّة تادمورا؟';

-- The pinned platform-launch announcement: title (exact guard) + every
-- announcement body that still names the platform (the launch body and
-- the AI-lecture body Ω rewrote — both carry the same phrase).
UPDATE "Announcement"
SET "title" = 'أُلارا: انطلاق نظام تشغيل الجامعة'
WHERE "title" = 'تادمورا: انطلاق نظام تشغيل الجامعة';

UPDATE "Announcement"
SET "body" = replace("body", 'منصّة تادمورا', 'منصّة أُلارا')
WHERE "body" LIKE '%منصّة تادمورا%';

-- The first hackathon (Ω neutralized its prize; the title keeps the
-- retired brand until here).
UPDATE "Competition"
SET "title" = 'هاكاثون أُلارا الأول'
WHERE "title" = 'هاكاثون تادمورا الأول';

-- The digital-education seminar description (the Ω-written text).
UPDATE "CampusEvent"
SET "description" = replace("description", 'منصّة تادمورا', 'منصّة أُلارا')
WHERE "description" LIKE '%منصّة تادمورا%';

-- Lecture poster art: the canonical asset is /brand/mark.svg (the
-- retired-brand twin asset is deleted from the web build; any lecture
-- row still pointing at it would 404 its poster).
UPDATE "Lecture"
SET "posterUrl" = '/brand/mark.svg'
WHERE "posterUrl" = '/brand/tadmora-mark.svg';

-- Completion certificates issued by the pre-rebrand code carry the
-- retired issuer label; the issuer is the PLATFORM's own name (never
-- user-authored content), so established rows converge on the new label.
UPDATE "Certificate"
SET "issuer" = 'منصّة أُلارا التعليميّة'
WHERE "issuer" = 'منصّة تادمورا التعليميّة';

-- ── 3. The demo workspace's synced public fact sheet ───────────────
-- UniversityFact rows converge automatically on the next daily sync
-- (runSync upserts by (institutionId, key)), but the migration makes
-- the rename deterministic and immediate. Dual guards: the r188-era
-- source values and the Ω-era source values.
UPDATE "UniversityFact"
SET "value" = 'مساحة عمل أُلارا التجريبية'
WHERE "institutionId" = 'inst-zawia-showcase'
  AND "key" = 'name.ar'
  AND "value" IN ('جامعة تادمورا التجريبية', 'مساحة عمل تادمورا التجريبية');

UPDATE "UniversityFact"
SET "value" = 'Ulara Experimental Workspace'
WHERE "institutionId" = 'inst-zawia-showcase'
  AND "key" = 'name.en'
  AND "value" IN ('Tadmora Demo University', 'Tadmora Experimental Workspace');

UPDATE "UniversityFact"
SET "value" = 'https://demo.ulara.ly'
WHERE "institutionId" = 'inst-zawia-showcase'
  AND "key" = 'website'
  AND "value" = 'https://demo.tadmora.ly';

UPDATE "UniversityFact"
SET "value" = 'info@demo.ulara.ly'
WHERE "institutionId" = 'inst-zawia-showcase'
  AND "key" = 'email.primary'
  AND "value" = 'info@demo.tadmora.ly';

/**
 * Scheduled-jobs HTTP surface (`GET /api/v1/jobs/daily`).
 *
 * The in-process setInterval ticker (backend/src/scheduler.ts) runs only
 * in the long-process entry (backend/src/index.ts — the classic single
 * web-service deployment). On a serverless platform there is no
 * long-lived process, so the platform's cron invokes this route instead:
 * vercel.json's `crons` entry hits it once a day carrying
 * `Authorization: Bearer <CRON_SECRET>`; CRON_SECRET is provisioned to
 * the SAME value as INTERNAL_SERVICE_TOKEN (one internal secret, two
 * transport shapes — the Bearer form the platform cron sends and the
 * x-internal-service-token header operators use). Fail-closed when the
 * token is unset: exactly the milestones service-token contract.
 *
 * The two jobs are the SAME pair the in-process scheduler runs daily:
 *   1. runScheduledSyncs — the configured institutions' fact sync
 *      (today only the demo tenant; unconfigured institutions plan
 *      nothing — an honest no-op on fresh databases);
 *   2. runLoginEventRetentionSweep — LoginEvent telemetry pruning.
 * Both are idempotent and never reject by contract; the route always
 * answers with an honest per-job summary (200 — job failures are part
 * of the payload, not transport errors).
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import { env } from '../../env.js';
import { logger } from '../../logger.js';
import { runLoginEventRetentionSweep, runScheduledSyncs } from '../../scheduler.js';
import { AppError } from '../../lib/errors.js';

const router = Router();

/**
 * Cron/service-token auth middleware — the milestones guard's transport
 * twin: accepts EITHER `Authorization: Bearer <token>` (the shape the
 * platform cron sends) OR `x-internal-service-token: <token>` (the
 * operator shape). Both sides are SHA-256 hashed to fixed-length
 * digests before timingSafeEqual — the comparison is constant-time and
 * independent of either side's length. Fail-closed when
 * INTERNAL_SERVICE_TOKEN is unset.
 *
 * Exported for unit testing (the milestones serviceAuthMiddleware
 * precedent — fake req/next without booting a server).
 */
export function cronAuthMiddleware(
  req: { header(name: string): string | undefined },
  _res: unknown,
  next: (err?: unknown) => void,
): void {
  const expected = env.INTERNAL_SERVICE_TOKEN;
  if (!expected) {
    return next(AppError.forbidden('Service token required'));
  }
  const bearer = req.header('authorization');
  const presented = bearer?.startsWith('Bearer ')
    ? bearer.slice('Bearer '.length)
    : req.header('x-internal-service-token');
  if (!presented) {
    return next(AppError.forbidden('Service token required'));
  }
  try {
    const a = createHash('sha256').update(presented, 'utf8').digest();
    const b = createHash('sha256').update(expected, 'utf8').digest();
    if (!timingSafeEqual(a, b)) {
      return next(AppError.forbidden('Service token required'));
    }
    next();
  } catch {
    next(AppError.forbidden('Service token required'));
  }
}

router.get('/daily', cronAuthMiddleware as import('express').RequestHandler, async (_req, res, next) => {
  try {
    const startedAt = Date.now();
    // The two jobs touch DISJOINT tables (UniversityFact syncs vs
    // LoginEvent pruning) and never reject by contract — running them
    // concurrently halves the cold-start wall time, which matters on
    // platforms whose function budget is capped (a cold first query can
    // wake the database compute: 2–4s before the first row moves).
    const [syncPlan, retention] = await Promise.all([
      runScheduledSyncs('cron'),
      runLoginEventRetentionSweep('cron'),
    ]);
    const summary = {
      ranAt: new Date().toISOString(),
      durationMs: Date.now() - startedAt,
      sync: { planned: syncPlan.length, institutions: syncPlan.map((p) => p.institutionId) },
      retention: { ran: retention.ran, reason: retention.ran ? undefined : retention.reason },
    };
    logger.info(summary, '[jobs/daily] scheduled jobs completed');
    res.json({ data: summary });
  } catch (err) {
    next(err);
  }
});

export default router;

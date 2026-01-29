import { coachingRouter } from "./routers/coaching";
import { gamificationRouter } from "./routers/gamification";
import { habitsRouter } from "./routers/habits";
import { healthRouter } from "./routers/health";
import { notificationsRouter } from "./routers/notifications";
import { progressRouter } from "./routers/progress";
import { router } from "./trpc";

/**
 * Root router combining all feature routers
 * Add new routers here as they are implemented
 */
export const appRouter = router({
  health: healthRouter,
  coaching: coachingRouter,
  habits: habitsRouter,
  progress: progressRouter,
  notifications: notificationsRouter,
  gamification: gamificationRouter,
  // Future routers:
  // auth: authRouter,
  // pods: podsRouter,
  // srs: srsRouter,
});

export type AppRouter = typeof appRouter;

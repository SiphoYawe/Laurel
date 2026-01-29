import { coachingRouter } from "./routers/coaching";
import { healthRouter } from "./routers/health";
import { router } from "./trpc";

/**
 * Root router combining all feature routers
 * Add new routers here as they are implemented
 */
export const appRouter = router({
  health: healthRouter,
  coaching: coachingRouter,
  // Future routers:
  // auth: authRouter,
  // habits: habitsRouter,
  // gamification: gamificationRouter,
  // pods: podsRouter,
  // srs: srsRouter,
});

export type AppRouter = typeof appRouter;

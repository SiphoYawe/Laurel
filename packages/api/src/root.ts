import { healthRouter } from "./routers/health";
import { router } from "./trpc";

/**
 * Root router combining all feature routers
 * Add new routers here as they are implemented
 */
export const appRouter = router({
  health: healthRouter,
  // Future routers:
  // auth: authRouter,
  // habits: habitsRouter,
  // coaching: coachingRouter,
  // gamification: gamificationRouter,
  // pods: podsRouter,
  // srs: srsRouter,
});

export type AppRouter = typeof appRouter;

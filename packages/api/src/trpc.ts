import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

/**
 * Context type definition
 * Will be extended with user session, database client, etc.
 */
export type Context = {
  // User ID from auth session
  userId?: string;
};

/**
 * tRPC initialization
 * Configured with superjson for Date and other type serialization
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

/**
 * Protected procedure - requires authenticated user
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId, // Narrowed type
    },
  });
});

export { TRPCError };

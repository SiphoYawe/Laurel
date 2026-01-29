/**
 * Database Schema
 * Export all schema definitions from here
 * Schemas will be added as features are implemented
 */

export const SCHEMA_VERSION = "0.2.0";

// User-related schemas
export * from "./users";

// Habit-related schemas (Epic 2)
export * from "./habits";
export * from "./coaching";

// Future schemas:
// export * from "./gamification";
// export * from "./pods";
// export * from "./srs";

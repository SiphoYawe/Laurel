/**
 * Calendar Utilities
 * Story 3-3: Streak Calendar Visualization (GitHub-style)
 */

/**
 * Color scale for completion counts
 */
export const CALENDAR_COLORS = {
  0: "#e5e5e5", // No completions - Light gray
  1: "#c6e2c8", // 1 completion - Light Sage
  2: "#7CB07F", // 2-3 completions - Medium Sage
  4: "#2D5A3D", // 4+ completions - Forest Green
} as const;

/**
 * Get color based on completion count
 */
export function getColorForCount(count: number): string {
  if (count === 0) return CALENDAR_COLORS[0];
  if (count === 1) return CALENDAR_COLORS[1];
  if (count <= 3) return CALENDAR_COLORS[2];
  return CALENDAR_COLORS[4];
}

/**
 * Get CSS class for completion count (Tailwind)
 */
export function getColorClassForCount(count: number): string {
  if (count === 0) return "bg-gray-200 dark:bg-gray-700";
  if (count === 1) return "bg-[#c6e2c8] dark:bg-[#4a7d4a]";
  if (count <= 3) return "bg-sage dark:bg-sage/80";
  return "bg-forest-green dark:bg-forest-green/90";
}

/**
 * Get text description for completion count
 */
export function getCountDescription(count: number): string {
  if (count === 0) return "No completions";
  if (count === 1) return "1 completion";
  return `${count} completions`;
}

/**
 * Format date for display
 */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date as YYYY-MM-DD for keys
 */
export function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get start of week (Monday)
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get end of week (Sunday)
 */
export function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

/**
 * Get array of dates for a week starting from given Monday
 */
export function getWeekDates(weekStart: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
}

/**
 * Generate weeks for calendar view
 */
export function generateWeeks(endDate: Date, numberOfWeeks: number): Date[][] {
  const weeks: Date[][] = [];
  const currentWeekStart = getStartOfWeek(endDate);

  for (let i = numberOfWeeks - 1; i >= 0; i--) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weeks.push(getWeekDates(weekStart));
  }

  return weeks;
}

/**
 * Get month label for a date
 */
export function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short" });
}

/**
 * Check if date is first day of month
 */
export function isFirstOfMonth(date: Date): boolean {
  return date.getDate() === 1;
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
}

/**
 * Day names for row labels
 */
export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/**
 * Day names abbreviated for small screens
 */
export const DAY_NAMES_SHORT = ["M", "T", "W", "T", "F", "S", "S"] as const;

export interface CalendarDay {
  date: Date;
  dateKey: string;
  completionCount: number;
  isToday: boolean;
  isFuture: boolean;
  completions?: Array<{
    habitId: string;
    habitTitle: string;
    completedAt: string;
  }>;
}

export interface CalendarWeek {
  weekStart: Date;
  days: CalendarDay[];
}

/**
 * Build calendar data structure from completions
 */
export function buildCalendarData(
  weeks: Date[][],
  completionsByDate: Record<
    string,
    Array<{ habitId: string; habitTitle: string; completedAt: string }>
  >
): CalendarWeek[] {
  return weeks.map((weekDates) => ({
    weekStart: weekDates[0],
    days: weekDates.map((date) => {
      const dateKey = formatDateKey(date);
      const completions = completionsByDate[dateKey] || [];
      return {
        date,
        dateKey,
        completionCount: completions.length,
        isToday: isToday(date),
        isFuture: isFuture(date),
        completions,
      };
    }),
  }));
}

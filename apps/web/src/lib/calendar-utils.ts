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
 * Category colors for habit blocks
 */
export const CATEGORY_COLORS: Record<string, string> = {
  study: "#2D5A3D", // Forest Green
  reading: "#7CB07F", // Sage
  exercise: "#E8A54B", // Warm Amber
  health: "#E8A54B",
  mindfulness: "#7CB07F",
  other: "#6B6B6B", // Gray
} as const;

/**
 * Get color for a category
 */
export function getCategoryColor(category?: string): string {
  if (!category) return CATEGORY_COLORS.other;
  return CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS.other;
}

/**
 * Time slot configuration
 */
export const TIME_CONFIG = {
  startHour: 6, // 6 AM
  endHour: 23, // 11 PM
  slotMinutes: 30,
  pixelsPerHour: 60,
  pixelsPerMinute: 1,
} as const;

/**
 * Generate time slots for calendar
 */
export function generateTimeSlots(): Array<{ hour: number; minute: number; label: string }> {
  const slots: Array<{ hour: number; minute: number; label: string }> = [];
  const startHour: number = TIME_CONFIG.startHour;
  const endHour: number = TIME_CONFIG.endHour;
  const slotMinutes: number = TIME_CONFIG.slotMinutes;

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotMinutes) {
      const isPM = hour >= 12;
      // For 12-hour format: 0 -> 12, 13 -> 1, etc.
      const displayHour = hour > 12 ? hour - 12 : hour;
      const label = minute === 0 ? `${displayHour} ${isPM ? "PM" : "AM"}` : "";
      slots.push({ hour, minute, label });
    }
  }

  return slots;
}

/**
 * Calculate position and height for a habit block
 */
export function calculateBlockPosition(
  targetTime: string,
  durationMinutes: number = 30
): { top: number; height: number } {
  const [hours, minutes] = targetTime.split(":").map(Number);
  const startOffset = (hours - TIME_CONFIG.startHour) * 60 + minutes;
  const minHeight = 24; // Minimum height for visibility

  return {
    top: startOffset * TIME_CONFIG.pixelsPerMinute,
    height: Math.max(durationMinutes * TIME_CONFIG.pixelsPerMinute, minHeight),
  };
}

/**
 * Get current time position for indicator line
 */
export function getCurrentTimePosition(): number | null {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  if (hours < TIME_CONFIG.startHour || hours > TIME_CONFIG.endHour) {
    return null;
  }

  return (hours - TIME_CONFIG.startHour) * 60 + minutes;
}

/**
 * Format time for display (HH:MM to 12-hour format)
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const isPM = hours >= 12;
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
}

/**
 * Get month calendar grid (6 weeks x 7 days)
 */
export function getMonthGrid(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Get the Monday before or on the first day
  const startDate = getStartOfWeek(firstDay);

  const weeks: Date[][] = [];
  // eslint-disable-next-line prefer-const -- currentDate is mutated via setDate
  let currentDate = new Date(startDate);

  // Generate 6 weeks
  for (let week = 0; week < 6; week++) {
    const weekDates: Date[] = [];
    for (let day = 0; day < 7; day++) {
      weekDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(weekDates);

    // Stop if we've passed the last day and it's a full week
    if (currentDate > lastDay && currentDate.getDay() === 1) {
      break;
    }
  }

  return weeks;
}

/**
 * Check if date is in given month
 */
export function isInMonth(date: Date, month: number): boolean {
  return date.getMonth() === month;
}

/**
 * Get formatted month/year header
 */
export function getMonthYearHeader(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
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

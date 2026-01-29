import { format, subDays, startOfWeek, getDay, isSameDay, isToday } from "date-fns";
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  useWindowDimensions,
} from "react-native";
import Svg, { Rect } from "react-native-svg";

import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from "../../lib/theme";

/**
 * Completion data for a single day
 */
export interface DayCompletionData {
  date: Date;
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
  habits: Array<{
    name: string;
    completed: boolean;
  }>;
}

/**
 * StreakCalendar component props
 */
interface StreakCalendarProps {
  /** Completion data keyed by date string (YYYY-MM-DD) */
  completionData?: Record<string, DayCompletionData>;
  /** Number of weeks to display (default: 12) */
  weeksToShow?: number;
  /** Callback when a day is pressed */
  onDayPress?: (data: DayCompletionData) => void;
}

/**
 * Theme colors for the heatmap
 */
const heatmapColors = {
  empty: colors.gray[100], // 0% completion
  level1: "#C8E6C9", // 1-25% completion (light sage)
  level2: colors.laurel.sage, // 26-50% completion
  level3: "#4CAF50", // 51-75% completion (medium green)
  level4: colors.laurel.forest, // 76-100% completion
  border: colors.gray[200],
  today: colors.laurel.amber,
};

/**
 * Day labels for the left side (M, W, F)
 */
const DAY_LABELS = ["", "M", "", "W", "", "F", ""];

/**
 * Cell size and gap constants
 */
const CELL_SIZE = 16;
const CELL_GAP = 2;

/**
 * Generate mock completion data for development
 */
function generateMockData(weeksToShow: number): Record<string, DayCompletionData> {
  const data: Record<string, DayCompletionData> = {};
  const today = new Date();
  const daysToGenerate = weeksToShow * 7;

  const habitNames = [
    "Morning meditation",
    "Exercise",
    "Read for 30 minutes",
    "Drink 8 glasses of water",
    "Write in journal",
  ];

  for (let i = 0; i < daysToGenerate; i++) {
    const date = subDays(today, i);
    const dateKey = format(date, "yyyy-MM-dd");

    // Generate random completion data with some patterns
    // More likely to have completions on recent days
    const recentBonus = Math.max(0, 1 - i / daysToGenerate);
    const baseCompletionChance = 0.3 + recentBonus * 0.4;

    const habits = habitNames.map((name) => ({
      name,
      completed: Math.random() < baseCompletionChance,
    }));

    const completedCount = habits.filter((h) => h.completed).length;
    const totalCount = habits.length;
    const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    data[dateKey] = {
      date,
      completedCount,
      totalCount,
      completionPercentage,
      habits,
    };
  }

  return data;
}

/**
 * Get the color for a cell based on completion percentage
 */
function getCellColor(percentage: number, isCurrentDay: boolean): string {
  if (isCurrentDay) {
    return heatmapColors.today;
  }
  if (percentage === 0) {
    return heatmapColors.empty;
  }
  if (percentage <= 25) {
    return heatmapColors.level1;
  }
  if (percentage <= 50) {
    return heatmapColors.level2;
  }
  if (percentage <= 75) {
    return heatmapColors.level3;
  }
  return heatmapColors.level4;
}

/**
 * Tooltip component for day details
 */
interface TooltipProps {
  visible: boolean;
  data: DayCompletionData | null;
  onClose: () => void;
}

function Tooltip({ visible, data, onClose }: TooltipProps) {
  if (!data) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.tooltipOverlay} onPress={onClose}>
        <View style={styles.tooltipContainer}>
          <View style={styles.tooltipHeader}>
            <Text style={styles.tooltipDate}>{format(data.date, "EEEE, MMMM d")}</Text>
            <Text style={styles.tooltipPercentage}>
              {Math.round(data.completionPercentage)}% complete
            </Text>
          </View>

          <View style={styles.tooltipDivider} />

          <Text style={styles.tooltipSubtitle}>
            {data.completedCount} of {data.totalCount} habits completed
          </Text>

          <View style={styles.tooltipHabits}>
            {data.habits.map((habit, index) => (
              <View key={index} style={styles.tooltipHabitRow}>
                <View
                  style={[
                    styles.tooltipHabitIndicator,
                    {
                      backgroundColor: habit.completed ? colors.laurel.forest : colors.gray[300],
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.tooltipHabitName,
                    !habit.completed && styles.tooltipHabitIncomplete,
                  ]}
                >
                  {habit.name}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.tooltipCloseButton} onPress={onClose}>
            <Text style={styles.tooltipCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

/**
 * StreakCalendar Component
 *
 * A GitHub-style heatmap calendar showing habit completion history.
 * Displays the last 12 weeks (84 days) with color intensity based on
 * daily completion percentage.
 *
 * Features:
 * - 7 rows (days) x 12 columns (weeks) grid
 * - Day labels (M, W, F) on the left side
 * - Month labels at the top
 * - Tap a day to show tooltip with details
 * - Responsive to portrait and landscape orientations
 */
export function StreakCalendar({
  completionData,
  weeksToShow = 12,
  onDayPress,
}: StreakCalendarProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayCompletionData | null>(null);

  // Use mock data if no completion data provided
  const data = useMemo(
    () => completionData || generateMockData(weeksToShow),
    [completionData, weeksToShow]
  );

  // Calculate grid dimensions
  const totalColumns = weeksToShow;
  const totalRows = 7;
  const labelWidth = 20;
  const gridWidth = totalColumns * (CELL_SIZE + CELL_GAP) - CELL_GAP;
  const gridHeight = totalRows * (CELL_SIZE + CELL_GAP) - CELL_GAP;

  // Calculate dates for each cell
  const today = new Date();
  const startDate = startOfWeek(subDays(today, (weeksToShow - 1) * 7), {
    weekStartsOn: 0,
  });

  // Generate grid cells
  const cells = useMemo(() => {
    const result: Array<{
      date: Date;
      weekIndex: number;
      dayIndex: number;
      data: DayCompletionData | null;
    }> = [];

    for (let week = 0; week < totalColumns; week++) {
      for (let day = 0; day < totalRows; day++) {
        const dayOffset = week * 7 + day;
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + dayOffset);
        const dateKey = format(date, "yyyy-MM-dd");

        result.push({
          date,
          weekIndex: week,
          dayIndex: day,
          data: data[dateKey] || null,
        });
      }
    }

    return result;
  }, [data, totalColumns, totalRows, startDate]);

  // Generate month labels
  const monthLabels = useMemo(() => {
    const labels: Array<{ label: string; weekIndex: number }> = [];
    let lastMonth = -1;

    for (let week = 0; week < totalColumns; week++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + week * 7);
      const month = date.getMonth();

      if (month !== lastMonth) {
        labels.push({
          label: format(date, "MMM"),
          weekIndex: week,
        });
        lastMonth = month;
      }
    }

    return labels;
  }, [startDate, totalColumns]);

  // Handle cell press
  const handleCellPress = useCallback(
    (cellData: DayCompletionData | null, date: Date) => {
      const dayData = cellData || {
        date,
        completedCount: 0,
        totalCount: 0,
        completionPercentage: 0,
        habits: [],
      };

      setSelectedDay(dayData);
      setTooltipVisible(true);

      if (onDayPress) {
        onDayPress(dayData);
      }
    },
    [onDayPress]
  );

  const handleTooltipClose = useCallback(() => {
    setTooltipVisible(false);
    setSelectedDay(null);
  }, []);

  // Render grid cells
  const renderCells = () => {
    return cells.map((cell, index) => {
      const { date, weekIndex, dayIndex, data: cellData } = cell;
      const percentage = cellData?.completionPercentage || 0;
      const isCurrentDay = isToday(date);
      const fillColor = getCellColor(percentage, isCurrentDay);

      const x = weekIndex * (CELL_SIZE + CELL_GAP);
      const y = dayIndex * (CELL_SIZE + CELL_GAP);

      return (
        <Rect
          key={index}
          fill={fillColor}
          height={CELL_SIZE}
          rx={3}
          ry={3}
          stroke={isCurrentDay ? colors.laurel.amber : "transparent"}
          strokeWidth={isCurrentDay ? 1 : 0}
          width={CELL_SIZE}
          x={x}
          y={y}
          onPress={() => handleCellPress(cellData, date)}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Month Labels */}
      <View style={[styles.monthLabelsContainer, { marginLeft: labelWidth }]}>
        {monthLabels.map((monthLabel, index) => (
          <Text
            key={index}
            style={[
              styles.monthLabel,
              {
                left: monthLabel.weekIndex * (CELL_SIZE + CELL_GAP),
              },
            ]}
          >
            {monthLabel.label}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.gridContainer}>
        {/* Day Labels */}
        <View style={[styles.dayLabelsContainer, { width: labelWidth }]}>
          {DAY_LABELS.map((label, index) => (
            <View key={index} style={[styles.dayLabelCell, { height: CELL_SIZE + CELL_GAP }]}>
              <Text style={styles.dayLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* SVG Grid */}
        <TouchableOpacity activeOpacity={1} style={styles.svgContainer}>
          <Svg height={gridHeight} width={gridWidth}>
            {renderCells()}
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendLabel}>Less</Text>
        <View style={styles.legendCells}>
          <View style={[styles.legendCell, { backgroundColor: heatmapColors.empty }]} />
          <View style={[styles.legendCell, { backgroundColor: heatmapColors.level1 }]} />
          <View style={[styles.legendCell, { backgroundColor: heatmapColors.level2 }]} />
          <View style={[styles.legendCell, { backgroundColor: heatmapColors.level3 }]} />
          <View style={[styles.legendCell, { backgroundColor: heatmapColors.level4 }]} />
        </View>
        <Text style={styles.legendLabel}>More</Text>
      </View>

      {/* Tooltip Modal */}
      <Tooltip data={selectedDay} visible={tooltipVisible} onClose={handleTooltipClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadow.sm,
  },
  monthLabelsContainer: {
    height: 20,
    position: "relative",
    marginBottom: spacing.xs,
  },
  monthLabel: {
    position: "absolute",
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    fontWeight: fontWeight.medium,
  },
  gridContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  dayLabelsContainer: {
    flexDirection: "column",
    marginRight: spacing.xs,
  },
  dayLabelCell: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 4,
  },
  dayLabel: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    fontWeight: fontWeight.medium,
  },
  svgContainer: {
    flex: 1,
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  legendLabel: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
  },
  legendCells: {
    flexDirection: "row",
    gap: 2,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  // Tooltip styles
  tooltipOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    maxWidth: 320,
    width: "100%",
    ...shadow.lg,
  },
  tooltipHeader: {
    marginBottom: spacing.sm,
  },
  tooltipDate: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  tooltipPercentage: {
    fontSize: fontSize.md,
    color: colors.laurel.forest,
    fontWeight: fontWeight.medium,
    marginTop: 4,
  },
  tooltipDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  tooltipSubtitle: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginBottom: spacing.sm,
  },
  tooltipHabits: {
    gap: spacing.xs,
  },
  tooltipHabitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  tooltipHabitIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tooltipHabitName: {
    fontSize: fontSize.sm,
    color: colors.foreground,
  },
  tooltipHabitIncomplete: {
    color: colors.mutedForeground,
    textDecorationLine: "line-through",
  },
  tooltipCloseButton: {
    backgroundColor: colors.laurel.forest,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  tooltipCloseText: {
    color: colors.background,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});

export default StreakCalendar;

export const SCHEDULE_COLORS: Record<string, string> = {
  Vacancy: "#10b981", // green
  Borrowing: "#f59e0b", // amber
  Unoccupied: "#6b7280", // gray
  Default: "#3b82f6", // blue
};

export const getScheduleColor = (source: string): string => {
  const color = SCHEDULE_COLORS[source] ?? SCHEDULE_COLORS.Default;
  if (color === undefined) {
    return "Default";
  }
  return color;
};

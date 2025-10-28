import type { GenericReportError } from "@/types/api";
import { toast } from "sonner";


export const handleGenerateReport = async (classroomId: string, startDate: Date, endDate: Date) => {
  // Validation
  if (!startDate || !endDate) {
    toast.error('Please select both start and end dates');
    return;
  }

  if (new Date(startDate) > new Date(endDate)) {
    toast.error('Start date must be before end date');
    return;
  }

  try {
    const response = await fetch('/api/reports/classroom-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classroomId: classroomId,
        startDate,
        endDate,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as GenericReportError;
      throw new Error(errorData.error ?? 'Failed to generate report');
    }

    // Get PDF blob
    const blob = await response.blob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classroom-logs-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    toast.error('Failed to generate report. Please try again.');
  }
};
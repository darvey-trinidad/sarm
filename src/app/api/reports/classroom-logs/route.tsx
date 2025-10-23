// app/api/reports/classroom-logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { pdf } from '@react-pdf/renderer';
import { z } from 'zod';
import { ClassroomLogsDocument } from '@/components/pdf/classroom-logs';
import { getAllClassroomLogs } from '@/lib/api/classroom-schedule/query';
import { SCHEDULE_SOURCE } from '@/constants/schedule';
import { mergeAdjacentTimeslots } from '@/lib/helper/classroom-schedule';

const querySchema = z.object({
  classroomId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body: unknown = await request.json();
    const parsed = querySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: parsed.error },
        { status: 400 }
      );
    }

    console.log("parsed: ", parsed);

    const { classroomId, startDate, endDate } = parsed.data;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Fetch data from database
    const res = await getAllClassroomLogs(classroomId, startDateObj, endDateObj);
    const classroomLogs = mergeAdjacentTimeslots(res.filter((log) => log.source !== SCHEDULE_SOURCE.Vacancy));

    if (classroomLogs.length === 0) {
      return NextResponse.json(
        { error: 'No classroom logs found for the room' },
        { status: 404 }
      );
    }

    // Generate PDF - use toBlob() instead of toBuffer()
    const blob = await pdf(
      <ClassroomLogsDocument classroomLogs={classroomLogs} />
    ).toBlob();

    // Convert blob to ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return PDF as response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="classroom-logs-${Date.now()}.pdf"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating classroom logs:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
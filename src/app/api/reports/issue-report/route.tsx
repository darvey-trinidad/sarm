// app/api/reports/borrowing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { pdf } from '@react-pdf/renderer';
import { z } from 'zod';
import { REPORT_STATUS } from '@/constants/report-status';
import { REPORT_CATEGORY } from '@/constants/report-category';
import { getAllFacilityIssueReports } from '@/lib/api/facility-issue/query';
import { FacilityIssueReportDocument } from '@/components/pdf/facility-issue-report';

const querySchema = z.object({
  category: z.enum(REPORT_CATEGORY).optional(),
  status: z.enum(REPORT_STATUS).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
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

    const { category, status, startDate, endDate } = parsed.data;

    // Convert string dates to Date objects
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;

    // Fetch data from database
    const res = await getAllFacilityIssueReports({ category, status, startDate: startDateObj, endDate: endDateObj });

    //sort by date reported (ascending)
    const issueReports = res.sort((a, b) => a.dateReported.getTime() - b.dateReported.getTime());

    if (issueReports.length === 0) {
      return NextResponse.json(
        { error: 'No transactions found for the given filters' },
        { status: 404 }
      );
    }

    // Generate PDF - use toBlob() instead of toBuffer()
    const blob = await pdf(
      <FacilityIssueReportDocument
        issueReports={issueReports}
        filters={{ category, status, startDate: startDateObj, endDate: endDateObj }} />
    ).toBlob();

    // Convert blob to ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return PDF as response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="facility-issues-report-${Date.now()}.pdf"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating facility issues report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
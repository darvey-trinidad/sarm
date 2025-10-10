// app/api/reports/borrowing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllBorrowingTransactions } from '@/lib/api/resource/query';
import { pdf } from '@react-pdf/renderer';
import { BorrowingReportDocument } from '@/components/pdf/borrowing-report';
import { z } from 'zod';
import { BORROWING_STATUS } from '@/constants/borrowing-status';

const querySchema = z.object({
  status: z.enum(BORROWING_STATUS).optional(),
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

    const { status, startDate, endDate } = parsed.data;

    // Convert string dates to Date objects
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;

    // Fetch data from database
    const transactions = await getAllBorrowingTransactions({
      status,
      startDate: startDateObj,
      endDate: endDateObj,
    });

    console.log(transactions);

    if (transactions.length === 0) {
      return NextResponse.json(
        { error: 'No transactions found for the given filters' },
        { status: 404 }
      );
    }

    // Generate PDF - use toBlob() instead of toBuffer()
    const blob = await pdf(
      <BorrowingReportDocument
        transactions={transactions}
        filters={{ status, startDate: startDateObj, endDate: endDateObj }}
      />
    ).toBlob();

    // Convert blob to ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return PDF as response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="borrowing-report-${Date.now()}.pdf"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating borrowing report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
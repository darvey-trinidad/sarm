// app/api/reports/borrowing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { pdf } from '@react-pdf/renderer';
import { z } from 'zod';
import { RESERVATION_STATUS } from '@/constants/reservation-status';
import { getAllVenueReservations } from '@/lib/api/venue/query';
import { VenueReservationReportDocument } from '@/components/pdf/venue-reservation-report';

const querySchema = z.object({
  venueId: z.string().optional(),
  status: z.enum(RESERVATION_STATUS).optional(),
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

    const { venueId, status, startDate, endDate } = parsed.data;

    // Convert string dates to Date objects
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;

    // Fetch data from database
    const reservations = await getAllVenueReservations({
      venueId,
      status,
      startDate: startDateObj,
      endDate: endDateObj
    });

    if (reservations.length === 0) {
      return NextResponse.json(
        { error: 'No transactions found for the given filters' },
        { status: 404 }
      );
    }

    // Generate PDF - use toBlob() instead of toBuffer()
    const blob = await pdf(
      <VenueReservationReportDocument
        venueReservations={reservations}
        filters={{ venueId, status, startDate: startDateObj, endDate: endDateObj }}
      />
    ).toBlob();

    // Convert blob to ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return PDF as response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="venue-reservations-report-${Date.now()}.pdf"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating venue reservation report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
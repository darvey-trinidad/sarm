// components/pdf/borrowing-report.tsx
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import type { BorrowingTransaction } from '@/server/db/types/resource';
import { TIME_MAP } from '@/constants/timeslot';
import { toTimeInt } from '@/lib/utils';
import { styles } from './styles';
import { formatDate, getStatusStyle } from './utils';
import type { ReservationWithBorrowing } from '@/server/db/types/venue';

type BorrowingReportProps = {
  transactions: BorrowingTransaction[];
  filters: {
    status?: string;
    startDate?: Date;
    endDate?: Date;
  };
};

type VenueReservationReportProps = {
  venueReservations: ReservationWithBorrowing[];
  filters: {
    venueId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  };
}

export const VenueReservationReportDocument = ({ venueReservations, filters }: VenueReservationReportProps) => {
  const filterText = [];
  if (filters.startDate) filterText.push(`From: ${formatDate(filters.startDate)}`);
  if (filters.endDate) filterText.push(`To: ${formatDate(filters.endDate)}`);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>Resource Borrowings Report</Text>
        {filterText.length > 0 && (
          <Text style={styles.filterInfo}>Filter: {filterText.join(' ')}</Text>
        )}

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.header, { flex: 1.5 }]}>Venue</Text>
            <Text style={[styles.header, { flex: 2 }]}>Reserver</Text>
            <Text style={[styles.header, { flex: 1.5 }]}>Date/Time</Text>
            <Text style={[styles.header, { flex: 2.5 }]}>Purpose</Text>
            <Text style={[styles.header, { flex: 1 }]}>Status</Text>
          </View>

          {/* Table Rows */}
          {venueReservations.map((reservation, index) => (
            <View
              key={reservation.venueReservationId}
              style={[
                styles.row,
                ...(index % 2 === 1 ? [styles.rowAlt] : []),
              ]}
            >
              <Text style={[styles.cell, { flex: 1.5 }]}>
                {reservation.venueName}
              </Text>

              <Text style={[styles.cell, { flex: 2 }]}>
                {reservation.reserverName}
              </Text>

              <View style={[styles.cell, { flex: 1.5 }]}>
                <Text>{formatDate(reservation.date)}</Text>
                <Text style={{ fontSize: 8, color: '#555' }}>
                  {TIME_MAP[toTimeInt(reservation.startTime)]} - {TIME_MAP[toTimeInt(reservation.endTime)]}
                </Text>
              </View>

              <Text style={[styles.cell, { flex: 2.5 }]}>
                {reservation.purpose}
              </Text>

              <Text
                style={[
                  styles.cell,
                  { flex: 1 },
                  getStatusStyle(reservation.status),
                ]}
              >
                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} • Total Reservations: {venueReservations.length}
        </Text>
      </Page>
    </Document>
  );
};
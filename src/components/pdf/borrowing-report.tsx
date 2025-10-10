// components/pdf/borrowing-report.tsx
import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { BorrowingTransaction } from '@/server/db/types/resource';
import { TIME_MAP } from '@/constants/timeslot';
import { toTimeInt } from '@/lib/utils';

type BorrowingReportProps = {
  transactions: BorrowingTransaction[];
  filters: {
    status?: string;
    startDate?: Date;
    endDate?: Date;
  };
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
    color: '#666',
  },
  filterInfo: {
    fontSize: 9,
    marginBottom: 20,
    textAlign: 'center',
    color: '#888',
  },
  table: {
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  header: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1px solid #ddd',
    padding: 8,
    minHeight: 30,
    backgroundColor: '#fff',
  },
  rowAlt: {
    backgroundColor: '#f9f9f9',
  },
  cell: {
    fontSize: 9,
    paddingRight: 8,
    paddingTop: 2,
  },
  itemText: {
    fontSize: 8,
    marginBottom: 2,
    color: '#555',
  },
  statusApproved: {
    color: '#00000'
  },
  statusPending: {
    color: '#555'
  },
  statusReturned: {
    color: '#555'
  },
  statusRejected: {
    color: '#555'
  },
  statusCanceled: {
    color: '#555'
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: '1px solid #ddd',
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
});

const formatDate = (date: Date | null) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return styles.statusApproved;
    case 'pending':
      return styles.statusPending;
    case 'returned':
      return styles.statusReturned;
    case 'rejected':
      return styles.statusRejected;
    case 'canceled':
      return styles.statusCanceled;
    default:
      return {};
  }
};

export const BorrowingReportDocument = ({ transactions, filters }: BorrowingReportProps) => {
  const filterText = [];
  if (filters.status) filterText.push(`Status: ${filters.status}`);
  if (filters.startDate) filterText.push(`From: ${formatDate(filters.startDate)}`);
  if (filters.endDate) filterText.push(`To: ${formatDate(filters.endDate)}`);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Resource Borrowings Report</Text>
        {filterText.length > 0 && (
          <Text style={styles.filterInfo}>Filters: {filterText.join(' | ')}</Text>
        )}

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.header, { flex: 2 }]}>Borrower</Text>
            <Text style={[styles.header, { flex: 1.5 }]}>Date/Time</Text>
            <Text style={[styles.header, { flex: 2.5 }]}>Purpose</Text>
            <Text style={[styles.header, { flex: 2 }]}>Items Borrowed</Text>
            <Text style={[styles.header, { flex: 1 }]}>Status</Text>
          </View>

          {/* Table Rows */}
          {transactions.map((transaction, index) => (
            <View
              key={transaction.id}
              style={[
                styles.row,
                ...(index % 2 === 1 ? [styles.rowAlt] : []),
              ]}
            >
              <Text style={[styles.cell, { flex: 2 }]}>
                {transaction.borrowerName}
              </Text>

              <View style={[styles.cell, { flex: 1.5 }]}>
                <Text>{formatDate(transaction.dateBorrowed)}</Text>
                <Text style={{ fontSize: 8, color: '#555' }}>
                  {TIME_MAP[toTimeInt(transaction.startTime)]} - {TIME_MAP[toTimeInt(transaction.endTime)]}
                </Text>
              </View>

              <Text style={[styles.cell, { flex: 2.5 }]}>
                {transaction.purpose}
              </Text>

              <View style={[styles.cell, { flex: 2 }]}>
                {transaction.borrowedItems.map((item) => (
                  <Text key={item.id} style={styles.itemText}>
                    • {item.resourceName} ({item.quantity})
                  </Text>
                ))}
              </View>

              <Text
                style={[
                  styles.cell,
                  { flex: 1 },
                  getStatusStyle(transaction.status),
                ]}
              >
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} • Total Transactions: {transactions.length}
        </Text>
      </Page>
    </Document>
  );
};
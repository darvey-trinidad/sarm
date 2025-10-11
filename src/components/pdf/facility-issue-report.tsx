// components/pdf/borrowing-report.tsx
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { styles } from './styles';
import { formatDate, getStatusStyle } from './utils';
import type { FacilityIssueReportReturnType } from '@/lib/api/facility-issue/query';
import { ReportStatusValues } from '@/constants/report-status';

type FacilityIssueReportProps = {
  issueReports: FacilityIssueReportReturnType;
  filters: {
    category?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  };
};

export const FacilityIssueReportDocument = ({ issueReports, filters }: FacilityIssueReportProps) => {
  const filterText = [];
  if (filters.startDate) filterText.push(`From: ${formatDate(filters.startDate)}`);
  if (filters.endDate) filterText.push(`To: ${formatDate(filters.endDate)}`);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>Facility Issues Report</Text>
        {filterText.length > 0 && (
          <Text style={styles.filterInfo}>Filter: {filterText.join(' ')}</Text>
        )}

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.header, { flex: 1.5 }]}>
              Date Reported
            </Text>

            <View style={[styles.header, { flex: 3 }]}>
              <Text>Description/Details</Text>
            </View>

            <View style={[styles.header, { flex: 2.5 }]}>
              <Text>Location</Text>
            </View>

            <Text style={[styles.header, { flex: 1.5 }]}>
              Date Resolved
            </Text>

            <View style={[styles.header, { flex: 1 }]}>
              <Text>Status</Text>
            </View>
          </View>

          {/* Table Rows */}
          {issueReports.map((issueReport, index) => (
            <View
              key={issueReport.id}
              style={[
                styles.row,
                ...(index % 2 === 1 ? [styles.rowAlt] : []),
              ]}
            >

              <View style={[styles.cell, { flex: 1.5 }]}>
                <Text>
                  {formatDate(issueReport.dateReported)}
                </Text>
              </View>

              <View style={[styles.cell, { flex: 3 }]}>
                <Text>{issueReport.description}</Text>
                <Text style={{ fontSize: 8, color: '#555' }}>
                  {issueReport.details}
                </Text>
              </View>

              <View style={[styles.cell, { flex: 2.5 }]}>
                <Text>{`Building: ${issueReport.buildingName ? issueReport.buildingName : 'N/A'}`}</Text>
                <Text>{`Room: ${issueReport.classroomName ? issueReport.classroomName : 'N/A'}`}</Text>
                <Text style={{ fontSize: 8, color: '#555' }}>
                  {issueReport.location}
                </Text>
              </View>

              <View style={[styles.cell, { flex: 1.5 }]}>
                <Text>
                  {issueReport.status === ReportStatusValues.Resolved ? formatDate(issueReport.dateUpdated) : 'N/A'}
                </Text>
              </View>

              <View style={[styles.cell, { flex: 1 }]}>
                <Text
                  style={[
                    getStatusStyle(issueReport.status),
                  ]}
                >
                  {issueReport.status.charAt(0).toUpperCase() + issueReport.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} • Total Reported Issues: {issueReports.length}
        </Text>
      </Page>
    </Document>
  );
};
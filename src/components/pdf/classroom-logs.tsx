import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { TIME_MAP } from '@/constants/timeslot';
import { toTimeInt } from '@/lib/utils';
import { styles } from './styles';
import { formatDate } from './utils';
import type { FinalClassroomSchedule } from '@/types/clasroom-schedule';

type ClassroomLogsDocumentProps = {
  classroomLogs: FinalClassroomSchedule[];
};

export const ClassroomLogsDocument = ({ classroomLogs }: ClassroomLogsDocumentProps) => {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>Classroom Schedule Logs</Text>
        <Text style={styles.filterInfo}>Building: {classroomLogs[0]?.buildingName} Classroom: {classroomLogs[0]?.classroomName}</Text>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.header, { flex: 2 }]}>Faculty</Text>
            <Text style={[styles.header, { flex: 1 }]}>Date</Text>
            <Text style={[styles.header, { flex: 2 }]}>Time</Text>
            <Text style={[styles.header, { flex: 1 }]}>Section</Text>
            <Text style={[styles.header, { flex: 1 }]}>Subject</Text>
            <Text style={[styles.header, { flex: 2 }]}>Additional Details</Text>
          </View>

          {/* Table Rows */}
          {classroomLogs.map((classroomLog, index) => (
            <View
              key={`${classroomLog.id}${index}`}
              style={[
                styles.row,
                ...(index % 2 === 1 ? [styles.rowAlt] : []),
              ]}
            >
              <Text style={[styles.cell, { flex: 2 }]}>
                {classroomLog.facultyName}
              </Text>

              <Text style={[styles.cell, { flex: 1 }]}>
                {formatDate(classroomLog.date)}
              </Text>

              <Text style={[styles.cell, { flex: 2 }]}>
                {TIME_MAP[toTimeInt(classroomLog.startTime)]} - {TIME_MAP[toTimeInt(classroomLog.endTime)]}
              </Text>

              <Text style={[styles.cell, { flex: 1 }]}>
                {classroomLog.section}
              </Text>

              <Text style={[styles.cell, { flex: 1 }]}>
                {classroomLog.subject}
              </Text>

              <Text style={[styles.cell, { flex: 2 }, { fontSize: 8, color: '#555' }]}>
                {classroomLog.details}
              </Text>

            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
};
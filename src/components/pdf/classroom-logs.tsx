import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { TIME_MAP } from '@/constants/timeslot';
import { toTimeInt } from '@/lib/utils';
import { styles } from './styles';
import { formatDate } from './utils';
import type { FinalClassroomSchedule } from '@/types/clasroom-schedule';


export const ClassroomLogsDocument = (classroomLogs: FinalClassroomSchedule[]) => {

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>Classroom Schedule Logs</Text>
        <Text style={styles.filterInfo}>Building: {classroomLogs[0]?.buildingName} Classroom: {classroomLogs[0]?.classroomName}</Text>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.header, { flex: 2 }]}>Faculty</Text>
            <Text style={[styles.header, { flex: 1.5 }]}>Date</Text>
            <Text style={[styles.header, { flex: 1.5 }]}>Time</Text>
            <Text style={[styles.header, { flex: 1 }]}>Section</Text>
            <Text style={[styles.header, { flex: 1 }]}>Subject</Text>
            <Text style={[styles.header, { flex: 2 }]}>Details</Text>
          </View>

          {/* Table Rows */}
          {classroomLogs.map((classroomLog, index) => (
            <View
              key={classroomLog.id}
              style={[
                styles.row,
                ...(index % 2 === 1 ? [styles.rowAlt] : []),
              ]}
            >
              <Text style={[styles.cell, { flex: 2 }]}>
                {classroomLog.facultyName}
              </Text>

              <View style={[styles.cell, { flex: 1.5 }]}>
                <Text>{formatDate(classroomLog.date)}</Text>
              </View>

              <View style={[styles.cell, { flex: 1.5 }]}>
                <Text style={{ fontSize: 8, color: '#555' }}>
                  {TIME_MAP[toTimeInt(classroomLog.startTime)]} - {TIME_MAP[toTimeInt(classroomLog.endTime)]}
                </Text>
              </View>

              <Text style={[styles.cell, { flex: 1 }]}>
                {classroomLog.section}
              </Text>

              <Text style={[styles.cell, { flex: 1 }]}>
                {classroomLog.subject}
              </Text>

              <Text style={[styles.cell, { flex: 2 }]}>
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
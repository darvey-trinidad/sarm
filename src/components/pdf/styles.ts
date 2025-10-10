import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
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
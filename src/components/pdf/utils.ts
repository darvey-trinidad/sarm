import { styles } from './styles';

export const getStatusStyle = (status: string) => {
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

export const formatDate = (date: Date | null) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
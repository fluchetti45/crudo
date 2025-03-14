export class OrderUtils {
  static getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'completed':
        return 'bg-info text-dark';
      case 'refunded':
        return 'bg-primary';
      case 'shipped':
        return 'bg-success';
      case 'canceled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}

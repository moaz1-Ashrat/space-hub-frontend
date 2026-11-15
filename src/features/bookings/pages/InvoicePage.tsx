import { useParams, Link } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';
import { paymentService } from '@/features/payments/services/paymentService';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download, CheckCircle2, Clock } from 'lucide-react';

export function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useBooking(Number(id));

  if (isLoading) return <div className="p-10 text-center">Loading invoice...</div>;
  if (!data) return <div className="p-10 text-center">Invoice not found.</div>;

  const booking = data.data;
  const payment = booking.payment;

  if (!payment) return <div className="p-10 text-center">No payment record found.</div>;

  const isPaid = payment.payment_status === 'paid';
  const isCash = payment.payment_methode === 'cash';

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Link to={`/customer/bookings/${booking.id}`} className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm">
          <ArrowLeft className="size-4" /> Back to Booking
        </Link>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4 me-2" /> Print Invoice
          </Button>
          <Button onClick={() => paymentService.downloadInvoice(payment.id)}>
            <Download className="size-4 me-2" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="bg-white text-black p-8 rounded-xl border border-gray-200 shadow-sm print:shadow-none print:border-none print:p-0">
        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SPACE HUB</h1>
            <p className="text-gray-500 text-sm mt-1">Tax Invoice / Receipt</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {isPaid ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
              {isPaid ? 'PAID' : (isCash ? 'PENDING (CASH)' : 'PENDING')}
            </div>
            <p className="text-gray-500 text-sm mt-2">Invoice #: <span className="font-mono text-gray-900">{payment.invoice_number || payment.id}</span></p>
            <p className="text-gray-500 text-sm">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Billed To</h3>
            <p className="font-medium text-gray-900">{booking.space?.owner?.name || 'Customer'}</p>
            <p className="text-gray-600 text-sm">{booking.space?.owner?.email || 'N/A'}</p>
            <p className="text-gray-600 text-sm">{booking.space?.location}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Payment Method</h3>
            <p className="font-medium text-gray-900 capitalize">{isCash ? 'Cash on Arrival' : 'Credit/Debit Card'}</p>
            <p className="text-gray-600 text-sm">Transaction: {payment.gateway_transaction_id || (isCash ? 'N/A (Cash)' : 'N/A')}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-bold text-gray-400 uppercase">
              <th className="pb-3">Description</th>
              <th className="pb-3">Date</th>
              <th className="pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-gray-100">
              <td className="py-4 font-medium text-gray-900">Space Booking - {booking.space?.name}</td>
              <td className="py-4 text-gray-600">
                {booking.booking_date ?? new Date(booking.start_datetime).toLocaleDateString()} (
                {booking.start_time ?? new Date(booking.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {booking.end_time ?? new Date(booking.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </td>
              <td className="py-4 text-right font-mono">{Number(payment.amount).toFixed(2)} EGP</td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between py-2 text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-mono">{Number(payment.amount).toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-200 text-lg font-bold text-gray-900">
              <span>Total</span>
              <span className="font-mono">{Number(payment.amount).toFixed(2)} EGP</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-gray-400 border-t border-gray-100 pt-6">
          <p>Thank you for choosing Space Hub!</p>
        </div>
      </div>
    </div>
  );
}
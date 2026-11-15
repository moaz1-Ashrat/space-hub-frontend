import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      // Kashier بتبعت البيانات بأسماء مختلفة، فبنجيبها كلها
      const orderId = searchParams.get('orderId') || searchParams.get('merchantOrderId');
      const transactionId = searchParams.get('transactionId') || searchParams.get('kashierOrderId');
      const status = searchParams.get('paymentStatus') || searchParams.get('status');

      if ((status === 'SUCCESS' || status === 'success') && orderId) {
        try {
          const { data } = await apiClient.post('/payments/kashier/verify', {
            orderId,
            transactionId,
            paymentStatus: status
          });
          toast.success('Payment successful!');
          navigate(`/customer/bookings/${data.booking_id}`);
        } catch (error) {
          console.error(error);
          toast.error('Payment verification failed.');
          navigate('/customer/bookings');
        }
      } else {
        toast.error('Payment was cancelled or failed.');
        navigate('/customer/bookings');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <Loader2 className="size-10 animate-spin text-primary" />
      <h2 className="text-xl font-semibold">Verifying your payment...</h2>
      <p className="text-muted-foreground">Please do not close this window.</p>
    </div>
  );
}
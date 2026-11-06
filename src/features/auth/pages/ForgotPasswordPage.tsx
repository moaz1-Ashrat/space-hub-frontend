import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForgotPassword } from '../hooks/useForgotPassword';

const schema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
});

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const forgotMutation = useForgotPassword();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: { email: string }) => {
    try {
      await forgotMutation.mutateAsync(values);
      setSent(true);
      toast.success('If this email exists, a reset link has been sent.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-semibold">Forgot Password</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {sent ? (
        <div className="p-4 rounded-md bg-success/10 border border-success/30 text-success text-sm flex gap-2 items-start">
          <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
          <span>
            If this email exists, a password reset link has been sent. Check your inbox.
          </span>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={forgotMutation.isPending}>
              {forgotMutation.isPending && <Loader2 className="size-4 me-2 animate-spin" />}
              Send Reset Link
            </Button>
          </form>
        </Form>
      )}

      <div className="text-sm text-center">
        <Link to="/login" className="text-primary hover:underline font-medium">
          Back to login
        </Link>
      </div>
    </div>
  );
}
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/shared/PasswordInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useResetPassword } from '../hooks/useResetPassword';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const resetMutation = useResetPassword();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: '', password_confirmation: '' },
  });

  const onSubmit = async (values: { password: string; password_confirmation: string }) => {
    if (!token || !email) {
      toast.error('Invalid reset link.');
      return;
    }

    try {
      await resetMutation.mutateAsync({
        token,
        email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      toast.success('Password reset successfully. Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Reset failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-semibold">Reset Password</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your new password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={resetMutation.isPending}>
            {resetMutation.isPending && <Loader2 className="size-4 me-2 animate-spin" />}
            Reset Password
          </Button>
        </form>
      </Form>

      <div className="text-sm text-center">
        <Link to="/login" className="text-primary hover:underline font-medium">
          Back to login
        </Link>
      </div>
    </div>
  );
}
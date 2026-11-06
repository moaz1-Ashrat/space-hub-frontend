import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useChangePassword } from '../hooks/useChangePassword';
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

const schema = z
  .object({
    current_password: z.string().min(1, 'Required'),
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    new_password_confirmation: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: 'Passwords do not match',
    path: ['new_password_confirmation'],
  });

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const changeMutation = useChangePassword();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  const onSubmit = async (values: any) => {
    try {
      await changeMutation.mutateAsync(values);
      toast.success('Password changed successfully.');
      navigate('/customer/profile');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/customer/profile"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to Profile
      </Link>

      <div>
        <h1 className="text-3xl font-heading font-bold">Change Password</h1>
        <p className="text-muted-foreground mt-1">
          Update your password to keep your account secure
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="new_password"
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
            name="new_password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={changeMutation.isPending}>
            {changeMutation.isPending && <Loader2 className="size-4 me-2 animate-spin" />}
            Change Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
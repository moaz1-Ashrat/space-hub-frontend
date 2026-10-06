import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

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

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const form = useForm({
    resolver: zodResolver(
      z
        .object({
          password: z.string().min(8, t('validation.passwordMin')),
          password_confirmation: z.string().min(8, t('validation.passwordMin')),
        })
        .refine((data) => data.password === data.password_confirmation, {
          message: t('validation.passwordMatch'),
          path: ['password_confirmation'],
        })
    ),
    defaultValues: { password: '', password_confirmation: '' },
  });

  const onSubmit = (_values: any) => {
    // TODO: Wire to backend when endpoint exists
    // POST /api/v1/auth/reset-password
    alert(t('auth.resetPassword.notAvailable'));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-semibold">
          {t('auth.resetPassword.title')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('auth.resetPassword.subtitle')}
        </p>
      </div>

      <div className="p-3 rounded-md bg-warning/10 border border-warning/30 text-warning text-sm flex gap-2 items-start">
        <AlertCircle className="size-4 mt-0.5 shrink-0" />
        <span>{t('auth.resetPassword.notAvailable')}</span>
      </div>

      {token && (
        <div className="text-xs text-muted-foreground font-mono">
          Token: {token.substring(0, 10)}...
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.resetPassword.password')}</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
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
                <FormLabel>{t('auth.resetPassword.confirmPassword')}</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {t('auth.resetPassword.submit')}
          </Button>
        </form>
      </Form>

      <div className="text-sm text-center">
        <Link to="/login" className="text-primary hover:underline font-medium">
          {t('auth.resetPassword.backToLogin')}
        </Link>
      </div>
    </div>
  );
}
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { PasswordInput } from '@/components/shared/PasswordInput';

import { useAuth } from '../hooks/useAuth';
import { getErrorMessage, isSuspendedAccount } from '@/lib/errors';
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

export function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();

  const form = useForm<{ email: string; password: string }>({
    resolver: zodResolver(
      z.object({
        email: z.string().min(1, t('validation.required')).email(t('validation.email')),
        password: z.string().min(1, t('validation.required')),
      })
    ),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: { email: string; password: string }) => {
    login.mutate(values);
  };

  // Error message handling
  let errorMessage = '';
  if (login.error) {
    if (isSuspendedAccount(login.error)) {
      errorMessage = t('auth.login.errors.suspended');
    } else {
      const err = login.error as AxiosError;
      if (err.response?.status === 401) {
        errorMessage = t('auth.login.errors.invalidCredentials');
      } else {
        errorMessage = getErrorMessage(login.error);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-semibold">
          {t('auth.login.title')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('auth.login.subtitle')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.login.email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('auth.login.emailPlaceholder')}
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.login.password')}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t('auth.login.passwordPlaceholder')}
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorMessage && (
            <div className="p-3 rounded-md bg-error/10 border border-error/30 text-error text-sm">
              {errorMessage}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending && <Loader2 className="size-4 animate-spin" />}
            {login.isPending ? t('auth.login.submitting') : t('auth.login.submit')}
          </Button>
        </form>
      </Form>

      <div className="flex items-center justify-between text-sm">
        <Link
          to="/forgot-password"
          className="text-primary hover:underline font-medium"
        >
          {t('auth.login.forgotPassword')}
        </Link>
        <div className="text-muted-foreground">
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            {t('auth.login.registerLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}
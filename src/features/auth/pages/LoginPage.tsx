// src/features/auth/pages/LoginPage.tsx
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, Mail, Lock } from 'lucide-react';

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
import { authStagger, authItem } from '@/lib/animations';

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

  // Error handling
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
    <motion.div
      variants={authStagger}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={authItem} className="text-center space-y-1.5">
        <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
          {t('auth.login.title')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('auth.login.subtitle')}
        </p>
      </motion.div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <motion.div variants={authItem}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.login.email')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder={t('auth.login.emailPlaceholder')}
                        autoComplete="email"
                        className="ps-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={authItem}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t('auth.login.password')}</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      {t('auth.login.forgotPassword')}
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
                      <PasswordInput
                        placeholder={t('auth.login.passwordPlaceholder')}
                        autoComplete="current-password"
                        className="ps-9"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Error alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/25 text-destructive text-sm"
            >
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <motion.div variants={authItem}>
            <Button
              type="submit"
              className="w-full h-11 font-medium"
              disabled={login.isPending}
            >
              {login.isPending && <Loader2 className="size-4 animate-spin me-2" />}
              {login.isPending
                ? t('auth.login.submitting')
                : t('auth.login.submit')}
            </Button>
          </motion.div>
        </form>
      </Form>

      {/* Footer link */}
      <motion.p
        variants={authItem}
        className="text-center text-sm text-muted-foreground"
      >
        {t('auth.login.noAccount')}{' '}
        <Link to="/register" className="text-primary hover:underline font-medium">
          {t('auth.login.registerLink')}
        </Link>
      </motion.p>
    </motion.div>
  );
}
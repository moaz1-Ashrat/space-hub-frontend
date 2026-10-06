import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

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

export function ForgotPasswordPage() {
  const { t } = useTranslation();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().min(1, t('validation.required')).email(t('validation.email')),
      })
    ),
    defaultValues: { email: '' },
  });

  const onSubmit = (_values: { email: string }) => {
    // TODO: Wire to backend when endpoint exists
    // POST /api/v1/auth/forgot-password
    alert(t('auth.forgotPassword.notAvailable'));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-semibold">
          {t('auth.forgotPassword.title')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('auth.forgotPassword.subtitle')}
        </p>
      </div>

      <div className="p-3 rounded-md bg-warning/10 border border-warning/30 text-warning text-sm flex gap-2 items-start">
        <AlertCircle className="size-4 mt-0.5 shrink-0" />
        <span>{t('auth.forgotPassword.notAvailable')}</span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.forgotPassword.email')}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {t('auth.forgotPassword.submit')}
          </Button>
        </form>
      </Form>

      <div className="text-sm text-center">
        <Link to="/login" className="text-primary hover:underline font-medium">
          {t('auth.forgotPassword.backToLogin')}
        </Link>
      </div>
    </div>
  );
}
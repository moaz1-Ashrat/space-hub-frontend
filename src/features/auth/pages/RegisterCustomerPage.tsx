import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/shared/PasswordInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function RegisterCustomerPage() {
  const { t } = useTranslation();
  const { registerCustomer } = useAuth();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        first_name: z.string().min(1, t('validation.required')).max(50),
        last_name: z.string().min(1, t('validation.required')).max(50),
        email: z.string().min(1, t('validation.required')).email(t('validation.email')),
        password: z.string().min(8, t('validation.passwordMin')),
        phone: z.string().min(1, t('validation.required')).max(15),
        gender: z.enum(['male', 'female']),
        favorite: z.string().optional(),
      })
    ),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      gender: 'male',
      favorite: '',
    },
  });

  const onSubmit = (values: any) => {
    registerCustomer.mutate(values);
  };

  const errorMessage = registerCustomer.error
    ? getErrorMessage(registerCustomer.error)
    : '';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-semibold">
          {t('auth.register.customerTitle')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('auth.register.subtitle')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.register.firstName')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.register.lastName')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.register.email')}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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
                <FormLabel>{t('auth.register.password')}</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.register.phone')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('auth.register.phonePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.register.gender')}</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="male">{t('auth.register.male')}</option>
                    <option value="female">{t('auth.register.female')}</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="favorite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.register.favorite')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('auth.register.favoritePlaceholder')}
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

          <Button
            type="submit"
            className="w-full"
            disabled={registerCustomer.isPending}
          >
            {registerCustomer.isPending && <Loader2 className="size-4 animate-spin" />}
            {registerCustomer.isPending
              ? t('auth.register.submitting')
              : t('auth.register.submitCustomer')}
          </Button>
        </form>
      </Form>

      <div className="space-y-2 text-sm text-center">
        <div>
          <Link
            to="/register/owner"
            className="text-secondary hover:underline font-medium"
          >
            {t('auth.register.registerAsOwner')}
          </Link>
        </div>
        <div className="text-muted-foreground">
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            {t('auth.register.loginLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}
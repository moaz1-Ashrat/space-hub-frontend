import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '@/stores/authStore';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const schema = z.object({
  first_name: z.string().min(1, 'Required').max(50),
  last_name: z.string().min(1, 'Required').max(50),
  phone: z.string().min(1, 'Required').max(15),
  gender: z.enum(['male', 'female']),
});

export function ProfileEditPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateMutation = useUpdateProfile();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      phone: user?.phone ?? '',
      gender: (user?.gender as 'male' | 'female') ?? 'male',
    },
  });

  const onSubmit = async (values: any) => {
    try {
      await updateMutation.mutateAsync(values);
      toast.success('Profile updated successfully.');
      navigate('/customer/profile');
    } catch {
      toast.error('Failed to update profile.');
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
        <h1 className="text-3xl font-heading font-bold">Edit Profile</h1>
        <p className="text-muted-foreground mt-1">Update your personal information</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
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
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Gender</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="size-4 me-2 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
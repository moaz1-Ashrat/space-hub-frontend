// src/features/pages/AboutPage.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Zap,
  ShieldCheck,
  Target,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeUp, staggerContainer, staggerItem, heroTitle } from '@/lib/animations';

const values = [
  {
    icon: Zap,
    title: 'Fast & Simple',
    description:
      'Book a space in under 2 minutes. No hidden fees, no complications.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted & Secure',
    description:
      'All spaces are verified. Payments are safe. Your booking is protected.',
  },
  {
    icon: Target,
    title: 'Best Selection',
    description:
      'From coworking desks to gaming lounges — everything you need in one place.',
  },
  {
    icon: Heart,
    title: 'Community First',
    description:
      'We support local space owners and help them grow their business.',
  },
];

const stats = [
  { value: '500+', label: 'Spaces' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '50+', label: 'Cities' },
  { value: '4.9★', label: 'Average Rating' },
];

export function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="absolute top-10 -start-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-10 -end-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-40" />

        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            variants={heroTitle}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl font-heading font-bold mb-4"
          >
            About{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Space Hub
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            We're on a mission to make booking spaces as easy as ordering food.
            Connecting owners with customers — one booking at a time.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
            >
              <div className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              What drives us every day
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="p-6 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/40 transition-all text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="size-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 end-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 start-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
              Ready to Get Started?
            </h2>
            <p className="text-white/90 max-w-xl mx-auto mb-6">
              Find your perfect space today — or list your own and start earning.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/spaces">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Browse Spaces
                  <ArrowRight className="size-4 ms-2" />
                </Button>
              </Link>
              <Link to="/register/owner">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  <Building2 className="size-4 me-2" />
                  Become an Owner
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Building2,
  CalendarCheck,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSpaces } from "@/features/spaces/hooks/useSpaces";
import { SpaceCard } from "@/features/spaces/components/SpaceCard";
import { SpaceCardSkeleton } from "@/features/spaces/components/SpaceCardSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  heroTitle,
} from "@/lib/animations";

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useSpaces({ page: 1 });

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const dashboardPath = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "space_owner") return "/owner";
    return "/customer";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/spaces?location=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/spaces");
    }
  };

  const featuredSpaces = data?.data.slice(0, 6) ?? [];

  return (
    <div>
      {/* ============================================
          Hero Section
          ============================================ */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-10 -start-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-10 -end-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-40" />

        <div className="container mx-auto py-20 text-center relative z-10">
          {/* Hero Title */}
          <motion.h1
            variants={heroTitle}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 leading-tight"
          >
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Space
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Book offices, studios, halls, and gaming lounges in minutes. Trusted
            by hundreds of customers and owners.
          </motion.p>

          {/* Search Form */}
          <motion.form
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto flex gap-2 bg-card border border-border rounded-full p-2 shadow-card"
          >
            <Input
              placeholder="Search by location, city, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
            <Button type="submit" className="rounded-full px-6">
              <Search className="size-4" />
              Search
            </Button>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.45 }}
            className="flex gap-3 justify-center mt-6 flex-wrap"
          >
            <Link to="/spaces">
              <Button variant="outline">Browse All Spaces</Button>
            </Link>

            {isAuthenticated && (
              <Link to={dashboardPath()}>
                <Button>
                  <LayoutDashboard className="size-4" />
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* ============================================
          Featured Spaces
          ============================================ */}
      <section className="container mx-auto py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold">Featured Spaces</h2>
            <p className="text-muted-foreground mt-1">
              Handpicked spaces for you
            </p>
          </div>
          <Link to="/spaces" className="text-primary text-sm hover:underline">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SpaceCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredSpaces.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredSpaces.map((space) => (
              <motion.div key={space.id} variants={staggerItem}>
                <SpaceCard space={space} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No spaces available at the moment.
          </div>
        )}
      </section>

      {/* ============================================
          How It Works
          ============================================ */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2">
              Three simple steps to book your space
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Search,
                title: "Browse",
                description: "Explore hundreds of spaces across Egypt",
              },
              {
                icon: Building2,
                title: "Choose",
                description: "Filter by type, price, location, and capacity",
              },
              {
                icon: CalendarCheck,
                title: "Book",
                description: "Reserve instantly and pay securely",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                  <step.icon className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold">
                  {i + 1}. {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================
          Owner CTA
          ============================================ */}
      <section className="container mx-auto py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 end-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 start-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <Sparkles className="size-12 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
              Own a Space?
            </h2>
            <p className="text-white/90 max-w-xl mx-auto mb-6">
              List your space on Space Hub and start earning today.
            </p>
            <Link to="/register/owner">
              <Button size="lg" variant="secondary" className="font-semibold">
                Become an Owner
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

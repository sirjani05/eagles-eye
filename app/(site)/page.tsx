"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listProgrammes } from "@/lib/api/programmesApi";
import { ProgrammeCard } from "@/components/programmes/ProgrammeCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Shield, Users, Award, TrendingUp, ArrowRight, Sparkles, Zap, Globe, GraduationCap } from "lucide-react";

const CATEGORIES = [
  { name: "Data & Analytics", icon: TrendingUp, color: "bg-blue-500/20 text-blue-400", count: 42 },
  { name: "Design", icon: Sparkles, color: "bg-purple-500/20 text-purple-400", count: 28 },
  { name: "Engineering", icon: Zap, color: "bg-green-500/20 text-green-400", count: 35 },
  { name: "Marketing", icon: Globe, color: "bg-amber-500/20 text-amber-400", count: 22 },
];

const TRUST_STATS = [
  { value: "500+", label: "Programmes", icon: GraduationCap },
  { value: "50+", label: "Verified Providers", icon: Shield },
  { value: "25K+", label: "Active Learners", icon: Users },
  { value: "94%", label: "Satisfaction Rate", icon: Award },
];

export default function Landing() {
  const [programmes, setProgrammes] = useState<import("@/types/index").Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error: err } = await listProgrammes({ limit: 6 });
        if (err) throw new Error(err.message);
        if (!mounted) return;
        setProgrammes(data ?? []);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load programmes.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const featured = programmes.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 glass border-b border-border">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="h-8 w-24 bg-surface rounded animate-pulse" />
            <div className="h-8 w-24 bg-surface rounded animate-pulse" />
          </nav>
        </header>
        <main className="flex-1">
          <section className="relative overflow-hidden py-20 px-4">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="h-12 w-full max-w-md mx-auto bg-surface rounded animate-pulse mb-6" />
              <div className="h-8 w-full max-w-2xl mx-auto bg-surface rounded animate-pulse mb-8" />
              <div className="flex gap-4 justify-center">
                <div className="h-11 w-32 bg-surface rounded animate-pulse" />
                <div className="h-11 w-32 bg-surface rounded animate-pulse" />
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="container mx-auto relative z-10 max-w-4xl text-center">
          <Badge variant="info" className="mb-6 animate-fade-in">
            <span className="mr-1">New</span>
            Programme comparison now available
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-slide-up">
            Discover your next <span className="text-gradient">learning journey</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground-muted mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
            Compare programmes from verified providers worldwide. Transparent pricing, honest reviews, and direct applications — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Link href="/programmes">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <span>Explore Programmes</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-border hover:border-primary/50">
                <span>Create Free Account</span>
                <Users className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-6 border-border hover:border-primary/50 transition-colors hover-lift">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-foreground-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Explore by Category</h2>
              <p className="text-foreground-muted mt-1">Curated programmes across the most in-demand fields</p>
            </div>
            <Link href="/programmes" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={`/programmes?category=${encodeURIComponent(cat.name)}`} className="group">
                <Card variant="glass" className="h-full hover-lift group-hover:border-primary/50">
                  <CardContent className="pt-6">
                    <div className={cat.color + " rounded-xl p-3 w-12 h-12 mb-4 group-hover:scale-110 transition-transform"}>
                      <cat.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-sm text-foreground-muted mt-1">{cat.count} programmes available</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programmes */}
      <section className="py-20 px-4 bg-surface/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Programmes</h2>
              <p className="text-foreground-muted mt-1">Hand-picked programmes to get you started</p>
            </div>
            <Link href="/programmes" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all programmes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Unable to load featured programmes</p>
              <Link href="/programmes">
                <Button variant="outline">Browse All Programmes</Button>
              </Link>
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground-muted">No programmes available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((prog) => (
                <ProgrammeCard key={prog.id} programme={prog} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Manifesto */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Eagle's Eye?</h2>
            <p className="text-foreground-muted text-lg">We're building the most transparent education marketplace</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Providers Only",
                desc: "Every institution is vetted for accreditation, outcomes, and student satisfaction before listing.",
              },
              {
                icon: Globe,
                title: "Global Coverage",
                desc: "Access programmes from 50+ countries with localised pricing and visa guidance.",
              },
              {
                icon: Users,
                title: "Learner-First Design",
                desc: "No hidden fees, no spam, no pressure. Your data stays yours — always.",
              },
            ].map((item, i) => (
              <Card key={i} variant="glass" className="hover-lift">
                <CardContent className="pt-6 text-center">
                  <div className="text-primary mb-4">
                    <item.icon className="h-8 w-8 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-foreground-muted text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-surface/30">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to find your programme?</h2>
          <p className="text-foreground-muted mb-10">
            Join thousands of learners who found their path with Eagle's Eye.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programmes">
              <Button size="lg" className="w-full sm:w-auto">
                Browse All Programmes
              </Button>
            </Link>
            <Link href="/providers">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-border hover:border-primary/50">
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
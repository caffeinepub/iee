import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Users, Briefcase, Shield, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && isFetched && userProfile) {
      if (userProfile.role === 'worker') {
        navigate({ to: '/worker/jobs' });
      } else if (userProfile.role === 'employer') {
        navigate({ to: '/employer/dashboard' });
      }
    } else if (isAuthenticated && isFetched && !userProfile) {
      navigate({ to: '/select-role' });
    }
  }, [isAuthenticated, userProfile, isFetched, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  if (isAuthenticated && (profileLoading || !isFetched)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Connect Workers with Opportunities
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                IEE is a trusted workforce platform connecting verified workers with employers for daily wage and
                skilled jobs. Build your career or find the perfect team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleLogin} disabled={isLoggingIn} className="text-lg h-14 px-8">
                  {isLoggingIn ? 'Logging in...' : 'Get Started'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg h-14 px-8">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/hero-banner.dim_1200x400.png"
                alt="IEE Platform"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose IEE?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern platform designed for trust, efficiency, and growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Workers</h3>
                <p className="text-muted-foreground">
                  All workers are verified with unique IDs and QR codes for secure identification
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
                <p className="text-muted-foreground">
                  AI-powered job matching based on skills, location, and reliability scores
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Attendance</h3>
                <p className="text-muted-foreground">
                  QR-based check-in/check-out system for seamless attendance tracking
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Bulk Hiring</h3>
                <p className="text-muted-foreground">
                  Post jobs for multiple workers and fill positions quickly with auto-matching
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8 border-2">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/assets/generated/worker-icon.dim_128x128.png"
                  alt="Worker"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-2xl font-bold">For Workers</h3>
                  <p className="text-muted-foreground">Find your next opportunity</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Create your verified profile with skills and experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Get matched with nearby jobs based on your skills</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Track your work history and earnings</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Build your reliability score and reputation</span>
                </li>
              </ul>
              <Button size="lg" onClick={handleLogin} disabled={isLoggingIn} className="w-full">
                Join as Worker
              </Button>
            </Card>

            <Card className="p-8 border-2">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/assets/generated/employer-icon.dim_128x128.png"
                  alt="Employer"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-2xl font-bold">For Employers</h3>
                  <p className="text-muted-foreground">Build your team efficiently</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Post single or bulk job openings instantly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Review matched candidates with reliability scores</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Track attendance with QR code scanning</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Manage workforce with analytics dashboard</span>
                </li>
              </ul>
              <Button size="lg" onClick={handleLogin} disabled={isLoggingIn} className="w-full">
                Join as Employer
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

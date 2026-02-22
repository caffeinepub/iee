import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Menu, X, Briefcase, LogOut, LogIn, Heart, FileText, Calendar, Bell } from 'lucide-react';
import { useState } from 'react';
import NotificationBell from './NotificationBell';

export default function Navigation() {
  const navigate = useNavigate();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isWorker = userProfile?.role === 'worker';
  const isEmployer = userProfile?.role === 'employer';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
            >
              <Briefcase className="h-6 w-6 text-primary" />
              <span>WorkConnect</span>
            </button>

            {isAuthenticated && userProfile && (
              <nav className="hidden md:flex items-center gap-6">
                {isWorker && (
                  <>
                    <button
                      onClick={() => navigate({ to: '/worker/dashboard' })}
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate({ to: '/worker/jobs' })}
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      Find Jobs
                    </button>
                    <button
                      onClick={() => navigate({ to: '/worker/profile' })}
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      My Profile
                    </button>
                  </>
                )}

                {isEmployer && (
                  <>
                    <button
                      onClick={() => navigate({ to: '/employer/dashboard' })}
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate({ to: '/employer/jobs/create' })}
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      Post Job
                    </button>
                    <button
                      onClick={() => navigate({ to: '/employer/jobs' })}
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      My Jobs
                    </button>
                  </>
                )}

                {isAdmin && (
                  <button
                    onClick={() => navigate({ to: '/admin/dashboard' })}
                    className="text-base font-medium hover:text-primary transition-colors"
                  >
                    Admin
                  </button>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && userProfile && (
              <>
                {isWorker && <NotificationBell />}
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm font-medium">{userProfile.name}</span>
                  <Button onClick={handleAuth} variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <Button onClick={handleAuth} disabled={isLoggingIn} size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            )}

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && isAuthenticated && userProfile && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              {isWorker && (
                <>
                  <button
                    onClick={() => {
                      navigate({ to: '/worker/dashboard' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-base font-medium hover:text-primary transition-colors text-left"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: '/worker/jobs' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-base font-medium hover:text-primary transition-colors text-left"
                  >
                    Find Jobs
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: '/worker/profile' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-base font-medium hover:text-primary transition-colors text-left"
                  >
                    My Profile
                  </button>
                </>
              )}

              {isEmployer && (
                <>
                  <button
                    onClick={() => {
                      navigate({ to: '/employer/dashboard' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-base font-medium hover:text-primary transition-colors text-left"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: '/employer/jobs/create' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-base font-medium hover:text-primary transition-colors text-left"
                  >
                    Post Job
                  </button>
                  <button
                    onClick={() => {
                      navigate({ to: '/employer/jobs' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-base font-medium hover:text-primary transition-colors text-left"
                  >
                    My Jobs
                  </button>
                </>
              )}

              <div className="pt-3 border-t border-border">
                <p className="text-sm font-medium mb-2">{userProfile.name}</p>
                <Button onClick={handleAuth} variant="outline" size="sm" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Menu, X, Briefcase, Users, LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const navigate = useNavigate();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
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
              <span>IEE</span>
            </button>

            {isAuthenticated && userProfile && (
              <nav className="hidden md:flex items-center gap-6">
                {isWorker && (
                  <>
                    <button
                      onClick={() => navigate({ to: '/worker/jobs' })}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Find Jobs
                    </button>
                    <button
                      onClick={() => navigate({ to: '/worker/profile' })}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => navigate({ to: '/worker/history' })}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Work History
                    </button>
                    <button
                      onClick={() => navigate({ to: '/worker/wallet' })}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Wallet
                    </button>
                  </>
                )}

                {isEmployer && (
                  <>
                    <button
                      onClick={() => navigate({ to: '/employer/dashboard' })}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate({ to: '/employer/jobs' })}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      My Jobs
                    </button>
                    <button
                      onClick={() => navigate({ to: '/employer/jobs/create' })}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Post Job
                    </button>
                    <button
                      onClick={() => navigate({ to: '/employer/attendance' })}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Attendance
                    </button>
                  </>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="default"
              className="hidden md:flex items-center gap-2"
            >
              {isLoggingIn ? (
                'Logging in...'
              ) : isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              )}
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-4">
              {isAuthenticated && userProfile && (
                <>
                  {isWorker && (
                    <>
                      <button
                        onClick={() => {
                          navigate({ to: '/worker/jobs' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-left px-4 py-2 hover:bg-accent rounded-md transition-colors"
                      >
                        Find Jobs
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/worker/profile' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-left px-4 py-2 hover:bg-accent rounded-md transition-colors"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/worker/history' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-left px-4 py-2 hover:bg-accent rounded-md transition-colors"
                      >
                        Work History
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/worker/wallet' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-left px-4 py-2 hover:bg-accent rounded-md transition-colors"
                      >
                        Wallet
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
                        className="text-left px-4 py-2 hover:bg-accent rounded-md transition-colors"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/employer/jobs' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-left px-4 py-2 hover:bg-accent rounded-md transition-colors"
                      >
                        My Jobs
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/employer/jobs/create' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-left px-4 py-2 hover:bg-accent rounded-md transition-colors"
                      >
                        Post Job
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/employer/attendance' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-left px-4 py-2 hover:bg-accent rounded-md transition-colors"
                      >
                        Attendance
                      </button>
                    </>
                  )}
                </>
              )}

              <Button
                onClick={() => {
                  handleAuth();
                  setMobileMenuOpen(false);
                }}
                disabled={isLoggingIn}
                variant={isAuthenticated ? 'outline' : 'default'}
                className="w-full"
              >
                {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

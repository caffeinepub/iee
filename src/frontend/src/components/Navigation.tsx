import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Menu, X, Briefcase, LogOut, LogIn, Heart, FileText, Calendar } from 'lucide-react';
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
              <span>IEE</span>
            </button>

            {isAuthenticated && userProfile && (
              <nav className="hidden md:flex items-center gap-6">
                {isWorker && (
                  <>
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
                    <button
                      onClick={() => navigate({ to: '/worker/availability' })}
                      className="text-base font-medium hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Calendar className="h-4 w-4" />
                      Availability
                    </button>
                    <button
                      onClick={() => navigate({ to: '/worker/history' })}
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      Work History
                    </button>
                    <button
                      onClick={() => navigate({ to: '/worker/wallet' })}
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      Wallet
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
                      onClick={() => navigate({ to: '/employer/jobs' })}
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      Jobs
                    </button>
                    <button
                      onClick={() => navigate({ to: '/employer/favorites' })}
                      className="text-base font-medium hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Heart className="h-4 w-4" />
                      Favorites
                    </button>
                    <button
                      onClick={() => navigate({ to: '/employer/templates' })}
                      className="text-base font-medium hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      Templates
                    </button>
                    <button
                      onClick={() => navigate({ to: '/employer/analytics' })}
                      className="text-base font-medium hover:text-primary transition-colors"
                    >
                      Analytics
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

          <div className="flex items-center gap-3">
            {isAuthenticated && isWorker && <NotificationBell />}
            
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
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-3">
              {isAuthenticated && userProfile && (
                <>
                  {isWorker && (
                    <>
                      <button
                        onClick={() => {
                          navigate({ to: '/worker/jobs' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-base font-medium hover:text-primary transition-colors text-left px-2 py-1"
                      >
                        Find Jobs
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/worker/profile' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-base font-medium hover:text-primary transition-colors text-left px-2 py-1"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/worker/availability' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-base font-medium hover:text-primary transition-colors text-left px-2 py-1"
                      >
                        Availability
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/worker/history' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-base font-medium hover:text-primary transition-colors text-left px-2 py-1"
                      >
                        Work History
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/worker/wallet' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-base font-medium hover:text-primary transition-colors text-left px-2 py-1"
                      >
                        Wallet
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/worker/notifications' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-base font-medium hover:text-primary transition-colors text-left px-2 py-1"
                      >
                        Notifications
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
                        className="text-base font-medium hover:text-primary transition-colors text-left px-2 py-1"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/employer/jobs' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-base font-medium hover:text-primary transition-colors text-left px-2 py-1"
                      >
                        Jobs
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/employer/favorites' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-base font-medium hover:text-primary transition-colors text-left px-2 py-1"
                      >
                        Favorites
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/employer/templates' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-base font-medium hover:text-primary transition-colors text-left px-2 py-1"
                      >
                        Templates
                      </button>
                      <button
                        onClick={() => {
                          navigate({ to: '/employer/analytics' });
                          setMobileMenuOpen(false);
                        }}
                        className="text-base font-medium hover:text-primary transition-colors text-left px-2 py-1"
                      >
                        Analytics
                      </button>
                    </>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate({ to: '/admin/dashboard' });
                        setMobileMenuOpen(false);
                      }}
                      className="text-base font-medium hover:text-primary transition-colors text-left px-2 py-1"
                    >
                      Admin
                    </button>
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
                size="default"
                className="w-full justify-start"
              >
                {isLoggingIn ? (
                  'Logging in...'
                ) : isAuthenticated ? (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

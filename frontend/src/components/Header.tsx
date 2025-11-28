import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, Moon, Sun, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

interface HeaderProps {
  currentPage: string;
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onNavigateAbout: () => void;
  onNavigateServices: () => void;
  onNavigateContact: () => void;
  onLogout?: () => void;
}

export default function Header({ 
  currentPage, 
  onNavigateHome, 
  onNavigateDashboard,
  onNavigateAbout,
  onNavigateServices,
  onNavigateContact,
  onLogout
}: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      if (onLogout) {
        await onLogout();
      } else {
        await clear();
      }
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { label: 'Home', page: 'home', onClick: onNavigateHome },
    { label: 'About', page: 'about', onClick: onNavigateAbout },
    { label: 'Services', page: 'services', onClick: onNavigateServices },
    { label: 'Contact', page: 'contact', onClick: onNavigateContact },
  ];

  if (isAuthenticated) {
    navItems.push({ label: 'Dashboard', page: 'dashboard', onClick: onNavigateDashboard });
  }

  const handleNavClick = (onClick: () => void) => {
    onClick();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={onNavigateHome}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/assets/generated/eventchain-logo-transparent.dim_200x200.png" 
              alt="EVENTCHAIN" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              EVENTCHAIN
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.page}
                variant={currentPage === item.page ? 'default' : 'ghost'}
                onClick={item.onClick}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : isAuthenticated ? (
                'Logout'
              ) : (
                'Login'
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Button
                      key={item.page}
                      variant={currentPage === item.page ? 'default' : 'ghost'}
                      onClick={() => handleNavClick(item.onClick)}
                      className="justify-start"
                    >
                      {item.label}
                    </Button>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleAuth}
                      disabled={isLoggingIn}
                      variant={isAuthenticated ? 'outline' : 'default'}
                      className="w-full"
                    >
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Logging in...
                        </>
                      ) : isAuthenticated ? (
                        'Logout'
                      ) : (
                        'Login'
                      )}
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

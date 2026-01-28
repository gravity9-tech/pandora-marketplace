import { Link } from 'react-router-dom';
import { Moon, Sun, Github as GithubIcon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/themeStore';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon className="h-5 w-5" />;
    if (theme === 'light') return <Sun className="h-5 w-5" />;
    return <Sun className="h-5 w-5 opacity-50" />;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            P
          </div>
          <span className="font-semibold hidden sm:inline-block">Pandora Marketplace</span>
        </Link>

        <nav className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} title={`Theme: ${theme}`}>
            {getThemeIcon()}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <a
            href="https://github.com/gravity9-tech/pandora-marketplace"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <GithubIcon className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

import { Heart } from 'lucide-react';
import { SiX } from 'react-icons/si';

interface FooterProps {
  onNavigateAbout: () => void;
  onNavigateServices: () => void;
  onNavigateContact: () => void;
}

export default function Footer({ onNavigateAbout, onNavigateServices, onNavigateContact }: FooterProps) {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>© 2025. Built with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>using</span>
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <button 
              onClick={onNavigateAbout}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            <button 
              onClick={onNavigateServices}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </button>
            <button 
              onClick={onNavigateContact}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

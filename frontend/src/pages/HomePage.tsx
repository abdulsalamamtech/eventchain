import { useState, useMemo } from 'react';
import { useGetPublishedEvents } from '../hooks/useQueries';
import EventCard from '../components/EventCard';
import EventCardSkeleton from '../components/EventCardSkeleton';
import EventFilters from '../components/EventFilters';
import { Input } from '../components/ui/input';
import { Search, Calendar } from 'lucide-react';
import type { Event } from '../backend';

interface HomePageProps {
  onNavigateToEvent: (eventId: string) => void;
}

export default function HomePage({ onNavigateToEvent }: HomePageProps) {
  const { data: events = [], isLoading } = useGetPublishedEvents();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'newest'>('date');

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.locationName.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Sort events
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return Number(a.date - b.date);
      } else {
        return Number(b.date - a.date);
      }
    });

    return filtered;
  }, [events, searchTerm, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    const cats = new Set(events.map(e => e.category));
    return Array.from(cats);
  }, [events]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Discover Amazing{' '}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Tech Events
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Connect with innovators, learn from experts, and grow your network at the world's best technology events.
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>{events.length} Events Available</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="/assets/generated/tech-networking-hero.dim_1024x600.png" 
                alt="Technology networking and innovation" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search events by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <EventFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredAndSortedEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your filters or search term'
                  : 'Check back soon for upcoming events'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedEvents.map((event) => (
                <EventCard
                  key={event.eventId}
                  event={event}
                  onClick={() => onNavigateToEvent(event.eventId)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

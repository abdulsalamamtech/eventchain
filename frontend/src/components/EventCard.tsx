import { Calendar, MapPin, Users, Coins } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import type { Event } from '../backend';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const eventDate = new Date(Number(event.date) / 1000000);
  const attendeeCount = event.registrations.length;
  const spotsLeft = Number(event.capacity) - attendeeCount;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${event.title}`}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20">
        <img
          src={event.bannerUrl || '/assets/generated/default-event-banner.dim_800x400.png'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge>{event.category}</Badge>
          {event.isPaid && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white">
              <Coins className="h-3 w-3 mr-1" />
              {Number(event.price)} ICP
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-5 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {eventDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{event.locationName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>
              {attendeeCount} / {Number(event.capacity)} attendees
              {spotsLeft > 0 && spotsLeft <= 10 && (
                <span className="text-orange-500 ml-1">• {spotsLeft} spots left</span>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

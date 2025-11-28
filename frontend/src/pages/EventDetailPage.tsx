import { useState, useEffect } from 'react';
import { useGetEvent, useRegisterForEvent } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { ArrowLeft, Calendar, MapPin, Users, Share2, Check, Coins, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { SiFacebook, SiX, SiLinkedin } from 'react-icons/si';
import { toast } from 'sonner';
import PaymentModal from '../components/PaymentModal';
import type { Registration } from '../backend';

interface EventDetailPageProps {
  eventId: string;
  onNavigateBack: () => void;
}

export default function EventDetailPage({ eventId, onNavigateBack }: EventDetailPageProps) {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: event, isLoading, isError, error, refetch } = useGetEvent(eventId);
  const registerMutation = useRegisterForEvent();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Auto-retry if actor becomes available
  useEffect(() => {
    if (actor && !actorFetching && !event && !isLoading && isError) {
      const timer = setTimeout(() => {
        refetch();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [actor, actorFetching, event, isLoading, isError, refetch]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;

    // If event is paid, show payment modal first
    if (event.isPaid) {
      setShowPaymentModal(true);
      return;
    }

    // For free events, register directly
    await completeRegistration(undefined);
  };

  const completeRegistration = async (paymentStatus: string | undefined) => {
    if (!event) return;

    const registration: Registration = {
      userId: `user_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      registrationDate: BigInt(Date.now() * 1000000),
      paymentStatus: paymentStatus,
    };

    try {
      await registerMutation.mutateAsync({ eventId, registration });
      setIsRegistered(true);
      toast.success('Successfully registered for the event!');
      setName('');
      setEmail('');
      setShowPaymentModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to register for event');
    }
  };

  const handlePaymentSuccess = async () => {
    await completeRegistration('paid');
  };

  const getEventUrl = () => {
    return `${window.location.origin}/event/${eventId}`;
  };

  const handleShare = (platform: string) => {
    const url = getEventUrl();
    const text = event ? `Check out this event: ${event.title}` : 'Check out this event';
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const copyLink = async () => {
    const url = getEventUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers or when clipboard API is not available
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
      document.body.removeChild(textArea);
    }
  };

  const openMapLocation = () => {
    if (!event) return;
    // Open OpenStreetMap with the event location
    const mapUrl = `https://www.openstreetmap.org/?mlat=${event.lat}&mlon=${event.lng}#map=15/${event.lat}/${event.lng}`;
    window.open(mapUrl, '_blank');
  };

  // Show loading state while actor is initializing or event is loading
  if (actorFetching || isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-96 w-full rounded-lg mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Show error state if event fetch failed or event not found
  if (isError || !event) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error?.message || "The event you're looking for doesn't exist or has been removed."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onNavigateBack} size="lg" variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
            <Button onClick={() => refetch()} size="lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(Number(event.date) / 1000000);
  const attendeeCount = event.registrations.length;
  const spotsLeft = Number(event.capacity) - attendeeCount;
  const isFull = spotsLeft <= 0;
  const priceDisplay = event.isPaid ? `${Number(event.price)} ICP` : 'Free';

  // Generate OpenStreetMap embed URL with proper bounding box
  const bboxOffset = 0.01;
  const osmStaticMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${event.lng - bboxOffset}%2C${event.lat - bboxOffset}%2C${event.lng + bboxOffset}%2C${event.lat + bboxOffset}&layer=mapnik&marker=${event.lat}%2C${event.lng}`;

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={onNavigateBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>

      {/* Event Banner */}
      <div className="relative h-64 sm:h-96 bg-gradient-to-br from-primary/20 to-purple-500/20">
        <img
          src={event.bannerUrl || '/assets/generated/default-event-banner.dim_800x400.png'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        {event.isPaid && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-500 hover:bg-green-600 text-white text-lg px-4 py-2">
              <Coins className="h-4 w-4 mr-2" />
              {priceDisplay}
            </Badge>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Badge className="mb-3">{event.category}</Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{event.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{eventDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.locationName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{attendeeCount} / {Number(event.capacity)} attendees</span>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
              </CardContent>
            </Card>

            {/* Map Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
                  onClick={openMapLocation}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openMapLocation();
                    }
                  }}
                  aria-label="Click to view location on OpenStreetMap"
                >
                  <iframe
                    src={osmStaticMapUrl}
                    className="w-full h-full border-0 pointer-events-none"
                    title="Event location map"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none">
                    <div className="bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-medium flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-primary" />
                        Click to view on OpenStreetMap
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={openMapLocation}
                >
                  <MapPin className="h-4 w-4" />
                  View on OpenStreetMap
                </Button>
              </CardContent>
            </Card>

            {/* Share Section */}
            <Card>
              <CardHeader>
                <CardTitle>Share This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleShare('twitter')}
                    className="gap-2"
                  >
                    <SiX className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleShare('facebook')}
                    className="gap-2"
                  >
                    <SiFacebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleShare('linkedin')}
                    className="gap-2"
                  >
                    <SiLinkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyLink}
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>
                  {isRegistered ? 'Registration Confirmed!' : 'Register for Event'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isRegistered ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center py-8">
                      <div className="rounded-full bg-green-500/10 p-4">
                        <Check className="h-12 w-12 text-green-500" />
                      </div>
                    </div>
                    <p className="text-center text-muted-foreground">
                      You're all set! Check your email for event details.
                    </p>
                  </div>
                ) : isFull ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium mb-2">Event is Full</p>
                    <p className="text-sm text-muted-foreground">
                      This event has reached maximum capacity.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Spots Available</span>
                        <span className="font-medium">{spotsLeft}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">{priceDisplay}</span>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending 
                        ? 'Processing...' 
                        : event.isPaid 
                        ? 'Proceed to Payment' 
                        : 'Register Now'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && event && (
        <PaymentModal
          eventTitle={event.title}
          price={Number(event.price)}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}

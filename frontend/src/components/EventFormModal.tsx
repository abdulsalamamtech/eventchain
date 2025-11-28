import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateEvent, useUpdateEvent, useActorReady } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Event } from '../backend';

interface EventFormModalProps {
  event?: Event;
  onClose: () => void;
}

const CATEGORIES = [
  'AI & Machine Learning',
  'Blockchain & Web3',
  'Cloud Computing',
  'Cybersecurity',
  'Data Science',
  'DevOps',
  'Mobile Development',
  'Web Development',
  'IoT',
  'Other'
];

export default function EventFormModal({ event, onClose }: EventFormModalProps) {
  const { identity } = useInternetIdentity();
  const { isReady: actorReady, isInitializing: actorInitializing } = useActorReady();
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();

  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [category, setCategory] = useState(event?.category || CATEGORIES[0]);
  const [date, setDate] = useState(() => {
    if (event?.date) {
      const d = new Date(Number(event.date) / 1000000);
      return d.toISOString().slice(0, 16);
    }
    return '';
  });
  const [locationName, setLocationName] = useState(event?.locationName || '');
  const [lat, setLat] = useState(event?.lat?.toString() || '');
  const [lng, setLng] = useState(event?.lng?.toString() || '');
  const [capacity, setCapacity] = useState(event?.capacity?.toString() || '');
  const [isPublished, setIsPublished] = useState(event?.isPublished || false);
  const [isPaid, setIsPaid] = useState(event?.isPaid || false);
  const [price, setPrice] = useState(event?.price ? Number(event.price).toString() : '0');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isEditing = !!event;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Please log in to create events');
      return;
    }

    if (!actorReady) {
      toast.error('Connecting to backend, please wait...');
      return;
    }

    try {
      let bannerUrl = event?.bannerUrl || '/assets/generated/default-event-banner.dim_800x400.png';

      // Convert banner file to data URL if a new file was selected
      if (bannerFile) {
        setIsProcessing(true);
        try {
          bannerUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(bannerFile);
          });
        } catch (error) {
          console.error('File processing error:', error);
          toast.error('Failed to process banner image');
          setIsProcessing(false);
          return;
        }
        setIsProcessing(false);
      }

      const eventData: Event = {
        eventId: event?.eventId || `event_${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        category,
        date: BigInt(new Date(date).getTime() * 1000000),
        locationName: locationName.trim(),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        bannerUrl,
        organizerId: identity.getPrincipal().toString(),
        capacity: BigInt(capacity),
        isPublished,
        isPaid,
        price: isPaid ? BigInt(price) : BigInt(0),
        registrations: event?.registrations || [],
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ eventId: event.eventId, event: eventData });
        toast.success('Event updated successfully!');
      } else {
        await createMutation.mutateAsync(eventData);
        toast.success('Event created successfully!');
      }

      onClose();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to save event';
      if (errorMessage.includes('Connecting to backend')) {
        toast.error('Still connecting to backend. Please try again in a moment.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setBannerFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isProcessing;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        </DialogHeader>

        {actorInitializing && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Connecting to backend… Please wait a moment.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isPending || actorInitializing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              disabled={isPending || actorInitializing}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} disabled={isPending || actorInitializing}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date & Time *</Label>
              <Input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isPending || actorInitializing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location Name *</Label>
            <Input
              id="location"
              placeholder="e.g., San Francisco Convention Center"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
              disabled={isPending || actorInitializing}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude *</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                placeholder="37.7749"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
                disabled={isPending || actorInitializing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lng">Longitude *</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                placeholder="-122.4194"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
                disabled={isPending || actorInitializing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity *</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              placeholder="100"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
              disabled={isPending || actorInitializing}
            />
          </div>

          {/* Paid Event Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="paid">Paid Event</Label>
              <p className="text-sm text-muted-foreground">
                Charge attendees in ICP tokens
              </p>
            </div>
            <Switch
              id="paid"
              checked={isPaid}
              onCheckedChange={setIsPaid}
              disabled={isPending || actorInitializing}
            />
          </div>

          {/* Price Input (only shown when isPaid is true) */}
          {isPaid && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (ICP Tokens) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                disabled={isPending || actorInitializing}
              />
              <p className="text-sm text-muted-foreground">
                Enter the price in ICP tokens (e.g., 0.5 for half an ICP token)
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="banner">Event Banner</Label>
            <Input
              id="banner"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isPending || actorInitializing}
            />
            {bannerPreview && (
              <div className="mt-2">
                <img 
                  src={bannerPreview} 
                  alt="Banner preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            {isProcessing && (
              <p className="text-sm text-muted-foreground">Processing image...</p>
            )}
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="published">Publish Event</Label>
              <p className="text-sm text-muted-foreground">
                Make this event visible to the public
              </p>
            </div>
            <Switch
              id="published"
              checked={isPublished}
              onCheckedChange={setIsPublished}
              disabled={isPending || actorInitializing}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || actorInitializing}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : actorInitializing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                isEditing ? 'Update Event' : 'Create Event'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

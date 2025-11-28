import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetEventsByOrganizer, useDeleteEvent } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Plus, Calendar, Users, Edit, Trash2, Eye } from 'lucide-react';
import EventFormModal from '../components/EventFormModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import RegistrationsModal from '../components/RegistrationsModal';
import type { Event } from '../backend';

interface DashboardPageProps {
  onNavigateToEvent: (eventId: string) => void;
}

export default function DashboardPage({ onNavigateToEvent }: DashboardPageProps) {
  const { identity } = useInternetIdentity();
  const { data: events = [], isLoading } = useGetEventsByOrganizer();
  const deleteMutation = useDeleteEvent();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [viewingRegistrationsEventId, setViewingRegistrationsEventId] = useState<string | null>(null);

  if (!identity) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h2>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!deletingEventId) return;
    try {
      await deleteMutation.mutateAsync(deletingEventId);
      setDeletingEventId(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const totalAttendees = events.reduce((sum, event) => sum + event.registrations.length, 0);
  const upcomingEvents = events.filter(e => Number(e.date) > Date.now() * 1000000).length;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Event Dashboard</h1>
            <p className="text-muted-foreground">Manage your events and registrations</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{upcomingEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalAttendees}</div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                <p className="text-muted-foreground mb-4">Create your first event to get started</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => {
                  const eventDate = new Date(Number(event.date) / 1000000);
                  const attendeeCount = event.registrations.length;
                  const spotsLeft = Number(event.capacity) - attendeeCount;
                  
                  return (
                    <div
                      key={event.eventId}
                      className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={event.bannerUrl || '/assets/generated/default-event-banner.dim_800x400.png'}
                        alt={event.title}
                        className="w-full sm:w-32 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {eventDate.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {!event.isPublished && (
                            <span className="text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded">
                              Draft
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {attendeeCount} / {Number(event.capacity)}
                          </span>
                          <span>{spotsLeft} spots left</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onNavigateToEvent(event.eventId)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingEvent(event)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingRegistrationsEventId(event.eventId)}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Registrations
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingEventId(event.eventId)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <EventFormModal
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingEvent && (
        <EventFormModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {deletingEventId && (
        <DeleteConfirmDialog
          onConfirm={handleDelete}
          onCancel={() => setDeletingEventId(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}

      {viewingRegistrationsEventId && (
        <RegistrationsModal
          eventId={viewingRegistrationsEventId}
          onClose={() => setViewingRegistrationsEventId(null)}
        />
      )}
    </div>
  );
}

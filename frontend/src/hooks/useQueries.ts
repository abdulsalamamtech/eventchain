import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Event, Registration, UserProfile } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache profile for 5 minutes
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Event Queries
export function useGetAllEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['events', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEvents();
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
}

export function useGetPublishedEvents() {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['events', 'published'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedEvents();
    },
    enabled: !!actor && !isFetching,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
}

export function useGetEvent(eventId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Event | null>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!actor || !eventId) return null;
      const event = await actor.getEvent(eventId);
      return event;
    },
    enabled: !!eventId && !!actor && !actorFetching,
    retry: 3, // Retry 3 times for individual events
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 2000), // Fast exponential backoff
    staleTime: 1 * 60 * 1000, // Cache individual events for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
}

export function useGetEventsByOrganizer() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Event[]>({
    queryKey: ['events', 'organizer', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const organizerId = identity.getPrincipal().toString();
      return actor.getEventsByOrganizer(organizerId);
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
}

export function useSearchEvents(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['events', 'search', searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm) return [];
      return actor.searchEvents(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.length > 0,
    staleTime: 1 * 60 * 1000, // Cache search results for 1 minute
  });
}

export function useFilterEventsByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Event[]>({
    queryKey: ['events', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.filterEventsByCategory(category);
    },
    enabled: !!actor && !isFetching && category.length > 0,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });
}

// Event Mutations
export function useCreateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Event) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEvent(event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, event }: { eventId: string; event: Event }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEvent(eventId, event);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
    },
  });
}

export function useDeleteEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEvent(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// Registration Mutations
export function useRegisterForEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, registration }: { eventId: string; registration: Registration }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerForEvent(eventId, registration);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['registrations', variables.eventId] });
    },
  });
}

export function useGetRegistrations(eventId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Registration[]>({
    queryKey: ['registrations', eventId],
    queryFn: async () => {
      if (!actor || !eventId) return [];
      return actor.getRegistrations(eventId);
    },
    enabled: !!actor && !isFetching && !!eventId,
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
  });
}

// Hook to check if actor is ready
export function useActorReady() {
  const { actor, isFetching } = useActor();
  return {
    isReady: !!actor && !isFetching,
    isInitializing: !actor || isFetching,
  };
}

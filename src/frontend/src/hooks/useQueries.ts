import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  UserProfile,
  WorkerProfile,
  EmployerProfile,
  JobPosting,
  CandidateMatch,
  AttendanceRecord,
  PaymentRecord,
  SystemMetrics,
  BulkJobResult,
  VerifiedWorker,
  JobTemplate,
  DayAvailability,
  JobReminders,
  SkillWithExperience,
  WageRange,
  Coordinates,
  PaymentMethod,
  AvailabilityRequest,
} from '../backend';
import { Principal } from '@icp-sdk/core/principal';

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

// Worker Profile Queries
export function useCreateWorkerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      mobileNumber: string;
      skills: SkillWithExperience[];
      wageRange: WageRange;
      coordinates: Coordinates;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createWorkerProfile(
        data.name,
        data.mobileNumber,
        data.skills,
        data.wageRange,
        data.coordinates
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myWorkerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['allWorkers'] });
    },
  });
}

export function useGetMyWorkerProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<WorkerProfile | null>({
    queryKey: ['myWorkerProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWorkerProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWorkerProfile(workerId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<WorkerProfile | null>({
    queryKey: ['workerProfile', workerId],
    queryFn: async () => {
      if (!actor || !workerId) return null;
      return actor.getWorkerProfile(workerId);
    },
    enabled: !!actor && !isFetching && !!workerId,
  });
}

export function useUpdateWorkerAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { workerId: string; isAvailable: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWorkerAvailability(data.workerId, data.isAvailable);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile', variables.workerId] });
      queryClient.invalidateQueries({ queryKey: ['myWorkerProfile'] });
    },
  });
}

// Employer Profile Queries
export function useSaveEmployerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: EmployerProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveEmployerProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEmployerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['allEmployers'] });
    },
  });
}

export function useGetMyEmployerProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<EmployerProfile | null>({
    queryKey: ['myEmployerProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyEmployerProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

// Job Posting Queries
export function useCreateJobPosting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      requiredSkills: SkillWithExperience[];
      wageAmount: number;
      duration: number;
      shiftTiming: string;
      workerCount: bigint;
      location: Coordinates;
      jobDescription: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createJobPosting(
        data.requiredSkills,
        data.wageAmount,
        data.duration,
        data.shiftTiming,
        data.workerCount,
        data.location,
        data.jobDescription
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobPostings'] });
      queryClient.invalidateQueries({ queryKey: ['allJobPostings'] });
    },
  });
}

export function useGetMyJobPostings() {
  const { actor, isFetching } = useActor();

  return useQuery<JobPosting[]>({
    queryKey: ['myJobPostings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyJobPostings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllJobPostings() {
  const { actor, isFetching } = useActor();

  return useQuery<JobPosting[]>({
    queryKey: ['allJobPostings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobPostings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJobPosting(jobId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<JobPosting | null>({
    queryKey: ['jobPosting', jobId],
    queryFn: async () => {
      if (!actor || !jobId) return null;
      return actor.getJobPosting(jobId);
    },
    enabled: !!actor && !isFetching && !!jobId,
  });
}

// Job Matching
export function useGetJobMatches(jobId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<CandidateMatch[]>({
    queryKey: ['jobMatches', jobId],
    queryFn: async () => {
      if (!actor || !jobId) return [];
      return actor.getJobMatches(jobId);
    },
    enabled: !!actor && !isFetching && !!jobId,
  });
}

export function useAssignWorkerToJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { jobId: string; workerId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignWorkerToJob(data.jobId, data.workerId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobPosting', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['myJobPostings'] });
      queryClient.invalidateQueries({ queryKey: ['jobMatches', variables.jobId] });
    },
  });
}

// Bulk Job Upload
export function useBulkJobUpload() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      jobEntries: Array<
        [string, SkillWithExperience[], number, number, string, bigint, Coordinates, string]
      >
    ) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bulkJobUpload(jobEntries);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobPostings'] });
      queryClient.invalidateQueries({ queryKey: ['allJobPostings'] });
    },
  });
}

// Attendance Tracking
export function useCheckInWorker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { jobId: string; workerId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkInWorker(data.jobId, data.workerId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile', variables.workerId] });
      queryClient.invalidateQueries({ queryKey: ['myWorkerProfile'] });
    },
  });
}

export function useCheckOutWorker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { jobId: string; workerId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkOutWorker(data.jobId, data.workerId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile', variables.workerId] });
      queryClient.invalidateQueries({ queryKey: ['myWorkerProfile'] });
    },
  });
}

// Rating System
export function useRateWorker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      jobId: string;
      workerId: string;
      rating: bigint;
      remarks: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rateWorker(data.jobId, data.workerId, data.rating, data.remarks);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile', variables.workerId] });
      queryClient.invalidateQueries({ queryKey: ['verifiedWorker', variables.workerId] });
    },
  });
}

// Payment Tracking
export function useRecordPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      workerId: string;
      jobId: string;
      amount: number;
      paymentMethod: PaymentMethod;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordPayment(data.workerId, data.jobId, data.amount, data.paymentMethod);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workerPaymentHistory', variables.workerId] });
      queryClient.invalidateQueries({ queryKey: ['workerProfile', variables.workerId] });
    },
  });
}

export function useGetWorkerPaymentHistory(workerId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<PaymentRecord[]>({
    queryKey: ['workerPaymentHistory', workerId],
    queryFn: async () => {
      if (!actor || !workerId) return [];
      return actor.getWorkerPaymentHistory(workerId);
    },
    enabled: !!actor && !isFetching && !!workerId,
  });
}

// Admin Queries
export function useGetSystemMetrics() {
  const { actor, isFetching } = useActor();

  return useQuery<SystemMetrics>({
    queryKey: ['systemMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSystemMetrics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllWorkers() {
  const { actor, isFetching } = useActor();

  return useQuery<WorkerProfile[]>({
    queryKey: ['allWorkers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWorkers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllEmployers() {
  const { actor, isFetching } = useActor();

  return useQuery<EmployerProfile[]>({
    queryKey: ['allEmployers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmployers();
    },
    enabled: !!actor && !isFetching,
  });
}

// Verified Workers (Badges)
export function useGetVerifiedWorker(workerId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<VerifiedWorker | null>({
    queryKey: ['verifiedWorker', workerId],
    queryFn: async () => {
      if (!actor || !workerId) return null;
      return actor.getVerifiedWorker(workerId);
    },
    enabled: !!actor && !isFetching && !!workerId,
  });
}

// Employer Favorites
export function useGetEmployerFavoriteWorkers() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['employerFavorites', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getEmployerFavoriteWorkers(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAddFavoriteWorker() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workerId: string) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      return actor.addFavoriteWorker(identity.getPrincipal(), workerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerFavorites'] });
    },
  });
}

export function useRemoveFavoriteWorker() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workerId: string) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      return actor.removeFavoriteWorker(identity.getPrincipal(), workerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerFavorites'] });
    },
  });
}

// Job Templates
export function useSaveJobTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: JobTemplate) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveJobTemplate(template);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['jobTemplates', variables.employerId.toString()],
      });
    },
  });
}

export function useGetJobTemplates() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<JobTemplate[]>({
    queryKey: ['jobTemplates', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getJobTemplates(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// Worker Availability
export function useUpdateWorkerAvailabilityWithPattern() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { workerId: string; availability: AvailabilityRequest[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWorkerAvailabilityWithPattern(data.workerId, data.availability);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workerAvailability', variables.workerId] });
    },
  });
}

export function useGetWorkerAvailability(workerId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<DayAvailability[]>({
    queryKey: ['workerAvailability', workerId],
    queryFn: async () => {
      if (!actor || !workerId) return [];
      return actor.getWorkerAvailability(workerId);
    },
    enabled: !!actor && !isFetching && !!workerId,
  });
}

// Job Reminders
export function useUpdateJobReminders() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reminder: JobReminders) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJobReminders(reminder);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobReminders', variables.jobId] });
    },
  });
}

export function useGetJobReminders(jobId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<JobReminders[]>({
    queryKey: ['jobReminders', jobId],
    queryFn: async () => {
      if (!actor || !jobId) return [];
      return actor.getJobReminders(jobId);
    },
    enabled: !!actor && !isFetching && !!jobId,
  });
}

// Worker Notifications (mock implementation - returns job reminders)
export function useGetWorkerNotifications() {
  const { actor, isFetching } = useActor();
  const { data: profile } = useGetMyWorkerProfile();

  return useQuery<JobReminders[]>({
    queryKey: ['workerNotifications', profile?.id],
    queryFn: async () => {
      if (!actor || !profile) return [];
      // Return empty array as notifications are job-specific
      // In a real implementation, this would aggregate reminders across all jobs
      return [];
    },
    enabled: !!actor && !isFetching && !!profile,
  });
}

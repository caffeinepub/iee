import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  WorkerProfile,
  EmployerProfile,
  JobPosting,
  CandidateMatch,
  PaymentRecord,
  SystemMetrics,
  Skill,
  ExperienceLevel,
  WageRange,
  Coordinates,
  UserRole,
} from '../backend';

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
export function useGetMyWorkerProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WorkerProfile | null>({
    queryKey: ['myWorkerProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyWorkerProfile();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetWorkerProfile(workerId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WorkerProfile | null>({
    queryKey: ['workerProfile', workerId],
    queryFn: async () => {
      if (!actor || !workerId) throw new Error('Actor or workerId not available');
      return actor.getWorkerProfile(workerId);
    },
    enabled: !!actor && !actorFetching && !!workerId,
  });
}

export function useCreateWorkerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      mobileNumber: string;
      skills: Skill[];
      experienceLevel: ExperienceLevel;
      wageRange: WageRange;
      coordinates: Coordinates;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createWorkerProfile(
        data.name,
        data.mobileNumber,
        data.skills,
        data.experienceLevel,
        data.wageRange,
        data.coordinates
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myWorkerProfile'] });
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myWorkerProfile'] });
    },
  });
}

// Employer Profile Queries
export function useGetMyEmployerProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EmployerProfile | null>({
    queryKey: ['myEmployerProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyEmployerProfile();
    },
    enabled: !!actor && !actorFetching,
  });
}

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
    },
  });
}

// Job Posting Queries
export function useCreateJobPosting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      requiredSkills: Skill[];
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
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobPosting[]>({
    queryKey: ['myJobPostings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyJobPostings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllJobPostings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobPosting[]>({
    queryKey: ['allJobPostings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllJobPostings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetJobPosting(jobId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobPosting | null>({
    queryKey: ['jobPosting', jobId],
    queryFn: async () => {
      if (!actor || !jobId) throw new Error('Actor or jobId not available');
      return actor.getJobPosting(jobId);
    },
    enabled: !!actor && !actorFetching && !!jobId,
  });
}

// Job Matching Queries
export function useGetJobMatches(jobId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CandidateMatch[]>({
    queryKey: ['jobMatches', jobId],
    queryFn: async () => {
      if (!actor || !jobId) throw new Error('Actor or jobId not available');
      return actor.getJobMatches(jobId);
    },
    enabled: !!actor && !actorFetching && !!jobId,
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

// Attendance Queries
export function useCheckInWorker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { jobId: string; workerId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkInWorker(data.jobId, data.workerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myWorkerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['myJobPostings'] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myWorkerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['myJobPostings'] });
    },
  });
}

// Rating Queries
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobPostings'] });
    },
  });
}

// Payment Queries
export function useGetWorkerPaymentHistory(workerId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PaymentRecord[]>({
    queryKey: ['workerPaymentHistory', workerId],
    queryFn: async () => {
      if (!actor || !workerId) throw new Error('Actor or workerId not available');
      return actor.getWorkerPaymentHistory(workerId);
    },
    enabled: !!actor && !actorFetching && !!workerId,
  });
}

export function useRecordPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { workerId: string; jobId: string; amount: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordPayment(data.workerId, data.jobId, data.amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerPaymentHistory'] });
    },
  });
}

// Admin Queries
export function useGetSystemMetrics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SystemMetrics>({
    queryKey: ['systemMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSystemMetrics();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

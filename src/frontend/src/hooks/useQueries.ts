import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  UserProfile,
  WorkerProfile,
  EmployerProfile,
  JobPosting,
  CandidateMatch,
  PaymentRecord,
  SystemMetrics,
  SkillWithExperience,
  WageRange,
  Coordinates,
  PaymentMethod,
  VerifiedWorker,
  JobTemplate,
  DayAvailability,
  AvailabilityRequest,
  JobReminders,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myWorkerProfile'] });
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

// Verified Worker (Badge) Queries
export function useGetVerifiedWorker(workerId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<VerifiedWorker | null>({
    queryKey: ['verifiedWorker', workerId],
    queryFn: async () => {
      if (!actor || !workerId) return null;
      return actor.getVerifiedWorker(workerId);
    },
    enabled: !!actor && !actorFetching && !!workerId,
  });
}

// Employer Favorites Queries
export function useGetEmployerFavoriteWorkers() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['employerFavorites', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getEmployerFavoriteWorkers(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
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

// Job Templates Queries
export function useGetJobTemplates() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<JobTemplate[]>({
    queryKey: ['jobTemplates', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getJobTemplates(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useSaveJobTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: JobTemplate) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveJobTemplate(template);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobTemplates'] });
    },
  });
}

// Worker Availability Queries
export function useGetWorkerAvailability(workerId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DayAvailability[]>({
    queryKey: ['workerAvailability', workerId],
    queryFn: async () => {
      if (!actor || !workerId) return [];
      return actor.getWorkerAvailability(workerId);
    },
    enabled: !!actor && !actorFetching && !!workerId,
  });
}

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

// Job Reminders Queries
export function useGetJobReminders(jobId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JobReminders[]>({
    queryKey: ['jobReminders', jobId],
    queryFn: async () => {
      if (!actor || !jobId) return [];
      return actor.getJobReminders(jobId);
    },
    enabled: !!actor && !actorFetching && !!jobId,
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

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

// Worker Notifications (aggregated from job reminders)
export function useGetWorkerNotifications() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: workerProfile } = useGetMyWorkerProfile();

  return useQuery<JobReminders[]>({
    queryKey: ['workerNotifications'],
    queryFn: async () => {
      if (!actor || !workerProfile) return [];
      
      // Get all jobs assigned to this worker
      const allJobs = await actor.getAllJobPostings();
      const assignedJobs = allJobs.filter(job => 
        job.assignedWorkers.includes(workerProfile.id)
      );

      // Fetch reminders for all assigned jobs
      const remindersPromises = assignedJobs.map(job => 
        actor.getJobReminders(job.id)
      );
      const remindersArrays = await Promise.all(remindersPromises);
      
      // Flatten and filter for this worker
      const allReminders = remindersArrays.flat();
      return allReminders.filter(r => r.workerId === workerProfile.id);
    },
    enabled: !!actor && !actorFetching && !!workerProfile,
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

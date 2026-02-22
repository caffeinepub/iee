import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    role: UserRole;
}
export interface DayAvailability {
    available: boolean;
    timeRange?: [string, string];
}
export interface BulkJobResult {
    successfullyCreatedJobs: Array<string>;
    validJobs: Array<JobPosting>;
    invalidEntries: Array<string>;
}
export type Time = bigint;
export interface PaymentRecord {
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    jobId: string;
    paymentDate: Time;
    runningBalance: number;
    amount: number;
}
export interface JobTemplate {
    duration: number;
    templateId: string;
    jobDescription: string;
    templateName: string;
    shiftTiming: string;
    employerId: Principal;
    wageAmount: number;
    requiredSkills: Array<SkillWithExperience>;
    location: Coordinates;
    workerCount: bigint;
}
export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface JobPosting {
    id: string;
    duration: number;
    isCompleted: boolean;
    jobDescription: string;
    createdAt: Time;
    shiftTiming: string;
    employerId: Principal;
    assignedWorkers: Array<string>;
    wageAmount: number;
    requiredSkills: Array<SkillWithExperience>;
    location: Coordinates;
    workerCount: bigint;
}
export interface AttendanceRecord {
    date: Time;
    jobId: string;
    checkInTime?: Time;
    checkOutTime?: Time;
}
export interface AvailabilityRequest {
    available: boolean;
    timeRange?: [string, string];
    dayIndex: bigint;
}
export interface SystemMetrics {
    workerRetentionRate: number;
    totalJobsPosted: bigint;
    employerRetentionRate: number;
    activeEmployersCount: bigint;
    retentionMetrics: Array<RetentionMetrics>;
    totalWorkersRegistered: bigint;
    jobFillRate: number;
    averageTimeToFillJobs: number;
    revenueMetrics: RevenueMetrics;
    monthlyFillRates: Array<MonthlyFillRate>;
}
export interface SkillWithExperience {
    yearsOfExperience: bigint;
    experienceLevel: ExperienceLevel;
    skill: Skill;
    certificationStatus: Array<CertifiedSkill>;
}
export interface JobReminders {
    updateSent: boolean;
    workerId: string;
    confirmationSent: boolean;
    cancelled: boolean;
    jobId: string;
    reminderSent: boolean;
}
export interface VerifiedWorker {
    badgeLevel: BadgeLevel;
    completedJobs: bigint;
    reliabilityScore: number;
    workerId: string;
    principal: Principal;
    averageRating: number;
    verifiedAt: Time;
}
export interface RetentionMetrics {
    periodDays: bigint;
    employerRetention: number;
    workerRetention: number;
}
export interface RevenueMetrics {
    averageRevenuePerJob: number;
    totalTransactionVolume: number;
    subscriptionTierDistribution: Array<string>;
}
export interface CertifiedSkill {
    skill: Skill;
    isCertified: boolean;
}
export interface CandidateMatch {
    reliabilityScore: number;
    workerId: string;
    distance: number;
    matchScore: number;
    skillsMatchPercentage: number;
}
export interface WorkerProfile {
    id: string;
    completedJobs: bigint;
    reliabilityScore: number;
    principal: Principal;
    paymentHistory: Array<PaymentRecord>;
    name: string;
    wageRange: WageRange;
    isAvailable: boolean;
    mobileNumber: string;
    attendanceRecords: Array<AttendanceRecord>;
    rating: number;
    skills: Array<SkillWithExperience>;
    coordinates: Coordinates;
}
export interface EmployerProfile {
    principal: Principal;
    contactPerson: string;
    mobileNumber: string;
    companyName: string;
    companyType: string;
    coordinates: Coordinates;
}
export interface WageRange {
    max: number;
    min: number;
}
export interface MonthlyFillRate {
    month: string;
    fillRate: number;
}
export enum BadgeLevel {
    bronze = "bronze",
    gold = "gold",
    none = "none",
    silver = "silver"
}
export enum ExperienceLevel {
    intermediate = "intermediate",
    novice = "novice",
    expert = "expert"
}
export enum PaymentMethod {
    mobileMoney = "mobileMoney",
    cash = "cash",
    bankTransfer = "bankTransfer",
    crypto = "crypto"
}
export enum PaymentStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum Skill {
    roofing = "roofing",
    tiling = "tiling",
    welding = "welding",
    plumbing = "plumbing",
    painting = "painting",
    electrician = "electrician",
    generalLabor = "generalLabor",
    flooring = "flooring",
    carpentry = "carpentry",
    masonry = "masonry"
}
export enum UserRole {
    employer = "employer",
    worker = "worker"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFavoriteWorker(employerId: Principal, workerId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    assignWorkerToJob(jobId: string, workerId: string): Promise<void>;
    bulkJobUpload(jobEntries: Array<[string, Array<SkillWithExperience>, number, number, string, bigint, Coordinates, string]>): Promise<BulkJobResult>;
    checkInWorker(jobId: string, workerId: string): Promise<void>;
    checkOutWorker(jobId: string, workerId: string): Promise<void>;
    createJobPosting(requiredSkills: Array<SkillWithExperience>, wageAmount: number, duration: number, shiftTiming: string, workerCount: bigint, location: Coordinates, jobDescription: string): Promise<string>;
    createWorkerProfile(name: string, mobileNumber: string, skills: Array<SkillWithExperience>, wageRange: WageRange, coordinates: Coordinates): Promise<string>;
    getAllEmployers(): Promise<Array<EmployerProfile>>;
    getAllJobPostings(): Promise<Array<JobPosting>>;
    getAllWorkers(): Promise<Array<WorkerProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getEmployerFavoriteWorkers(employerId: Principal): Promise<Array<string>>;
    getEmployerProfile(employer: Principal): Promise<EmployerProfile | null>;
    getJobMatches(jobId: string): Promise<Array<CandidateMatch>>;
    getJobPosting(jobId: string): Promise<JobPosting | null>;
    getJobReminders(jobId: string): Promise<Array<JobReminders>>;
    getJobTemplates(employerId: Principal): Promise<Array<JobTemplate>>;
    getMyEmployerProfile(): Promise<EmployerProfile | null>;
    getMyJobPostings(): Promise<Array<JobPosting>>;
    getMyWorkerProfile(): Promise<WorkerProfile | null>;
    getSystemMetrics(): Promise<SystemMetrics>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVerifiedWorker(workerId: string): Promise<VerifiedWorker | null>;
    getWorkerAvailability(workerId: string): Promise<Array<DayAvailability>>;
    getWorkerPaymentHistory(workerId: string): Promise<Array<PaymentRecord>>;
    getWorkerProfile(workerId: string): Promise<WorkerProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    rateWorker(jobId: string, workerId: string, rating: bigint, remarks: string | null): Promise<void>;
    recordPayment(workerId: string, jobId: string, amount: number, paymentMethod: PaymentMethod): Promise<void>;
    removeFavoriteWorker(employerId: Principal, workerId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveEmployerProfile(profile: EmployerProfile): Promise<void>;
    saveJobTemplate(template: JobTemplate): Promise<void>;
    updateJobReminders(reminder: JobReminders): Promise<void>;
    updateWorkerAvailability(workerId: string, isAvailable: boolean): Promise<void>;
    updateWorkerAvailabilityWithPattern(workerId: string, availability: Array<AvailabilityRequest>): Promise<void>;
}

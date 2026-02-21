import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SystemMetrics {
    workerRetentionRate: number;
    totalJobsPosted: bigint;
    employerRetentionRate: number;
    activeEmployersCount: bigint;
    totalWorkersRegistered: bigint;
    jobFillRate: number;
    averageTimeToFillJobs: number;
}
export type Time = bigint;
export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface PaymentRecord {
    jobId: string;
    isPaid: boolean;
    paymentDate: Time;
    amount: number;
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
    requiredSkills: Array<Skill>;
    location: Coordinates;
    workerCount: bigint;
}
export interface CandidateMatch {
    reliabilityScore: number;
    workerId: string;
    distance: number;
    skillsMatchPercentage: number;
}
export interface WorkerProfile {
    id: string;
    experienceLevel: ExperienceLevel;
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
    skills: Array<Skill>;
    coordinates: Coordinates;
}
export interface AttendanceRecord {
    date: Time;
    jobId: string;
    checkInTime?: Time;
    checkOutTime?: Time;
}
export interface EmployerProfile {
    principal: Principal;
    contactPerson: string;
    mobileNumber: string;
    companyName: string;
    companyType: string;
    coordinates: Coordinates;
}
export interface UserProfile {
    name: string;
    role: UserRole;
}
export interface WageRange {
    max: number;
    min: number;
}
export enum ExperienceLevel {
    intermediate = "intermediate",
    novice = "novice",
    expert = "expert"
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
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    assignWorkerToJob(jobId: string, workerId: string): Promise<void>;
    checkInWorker(jobId: string, workerId: string): Promise<void>;
    checkOutWorker(jobId: string, workerId: string): Promise<void>;
    createJobPosting(requiredSkills: Array<Skill>, wageAmount: number, duration: number, shiftTiming: string, workerCount: bigint, location: Coordinates, jobDescription: string): Promise<string>;
    createWorkerProfile(name: string, mobileNumber: string, skills: Array<Skill>, experienceLevel: ExperienceLevel, wageRange: WageRange, coordinates: Coordinates): Promise<string>;
    getAllEmployers(): Promise<Array<EmployerProfile>>;
    getAllJobPostings(): Promise<Array<JobPosting>>;
    getAllWorkers(): Promise<Array<WorkerProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getEmployerProfile(employer: Principal): Promise<EmployerProfile | null>;
    getJobMatches(jobId: string): Promise<Array<CandidateMatch>>;
    getJobPosting(jobId: string): Promise<JobPosting | null>;
    getMyEmployerProfile(): Promise<EmployerProfile | null>;
    getMyJobPostings(): Promise<Array<JobPosting>>;
    getMyWorkerProfile(): Promise<WorkerProfile | null>;
    getSystemMetrics(): Promise<SystemMetrics>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkerPaymentHistory(workerId: string): Promise<Array<PaymentRecord>>;
    getWorkerProfile(workerId: string): Promise<WorkerProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    rateWorker(jobId: string, workerId: string, rating: bigint, remarks: string | null): Promise<void>;
    recordPayment(workerId: string, jobId: string, amount: number): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveEmployerProfile(profile: EmployerProfile): Promise<void>;
    updateWorkerAvailability(workerId: string, isAvailable: boolean): Promise<void>;
}

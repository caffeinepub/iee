import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ExperienceLevel = {
    #novice;
    #intermediate;
    #expert;
  };

  public type Skill = {
    #masonry;
    #plumbing;
    #electrician;
    #carpentry;
    #painting;
    #roofing;
    #flooring;
    #tiling;
    #welding;
    #generalLabor;
  };

  public type WageRange = {
    min : Float;
    max : Float;
  };

  public type Coordinates = {
    latitude : Float;
    longitude : Float;
  };

  public type UserRole = {
    #worker;
    #employer;
  };

  public type UserProfile = {
    name : Text;
    role : UserRole;
  };

  public type WorkerProfile = {
    id : Text;
    principal : Principal;
    name : Text;
    mobileNumber : Text;
    skills : [Skill];
    experienceLevel : ExperienceLevel;
    isAvailable : Bool;
    wageRange : WageRange;
    coordinates : Coordinates;
    reliabilityScore : Float;
    rating : Float;
    completedJobs : Nat;
    attendanceRecords : [AttendanceRecord];
    paymentHistory : [PaymentRecord];
  };

  public type EmployerProfile = {
    principal : Principal;
    companyName : Text;
    contactPerson : Text;
    mobileNumber : Text;
    companyType : Text;
    coordinates : Coordinates;
  };

  public type JobPosting = {
    id : Text;
    employerId : Principal;
    requiredSkills : [Skill];
    wageAmount : Float;
    duration : Float;
    shiftTiming : Text;
    workerCount : Nat;
    location : Coordinates;
    jobDescription : Text;
    isCompleted : Bool;
    createdAt : Time.Time;
    assignedWorkers : [Text];
  };

  public type AttendanceRecord = {
    jobId : Text;
    checkInTime : ?Time.Time;
    checkOutTime : ?Time.Time;
    date : Time.Time;
  };

  public type PaymentRecord = {
    jobId : Text;
    amount : Float;
    paymentDate : Time.Time;
    isPaid : Bool;
  };

  public type CandidateMatch = {
    workerId : Text;
    skillsMatchPercentage : Float;
    distance : Float;
    reliabilityScore : Float;
  };

  public type WorkerRating = {
    jobId : Text;
    workerId : Text;
    rating : Nat;
    remarks : ?Text;
    ratedAt : Time.Time;
  };

  public type SystemMetrics = {
    totalWorkersRegistered : Nat;
    activeEmployersCount : Nat;
    totalJobsPosted : Nat;
    jobFillRate : Float;
    averageTimeToFillJobs : Float;
    workerRetentionRate : Float;
    employerRetentionRate : Float;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let workerProfiles = Map.empty<Text, WorkerProfile>();
  let employerProfiles = Map.empty<Principal, EmployerProfile>();
  let jobPostings = Map.empty<Text, JobPosting>();
  let workerRatings = Map.empty<Text, [WorkerRating]>();

  var nextWorkerId : Nat = 1;
  var nextJobId : Nat = 1;

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Worker Profile Management
  public shared ({ caller }) func createWorkerProfile(
    name : Text,
    mobileNumber : Text,
    skills : [Skill],
    experienceLevel : ExperienceLevel,
    wageRange : WageRange,
    coordinates : Coordinates
  ) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create worker profiles");
    };

    let workerId = "W" # nextWorkerId.toText();
    nextWorkerId += 1;

    let profile : WorkerProfile = {
      id = workerId;
      principal = caller;
      name;
      mobileNumber;
      skills;
      experienceLevel;
      isAvailable = true;
      wageRange;
      coordinates;
      reliabilityScore = 5.0;
      rating = 5.0;
      completedJobs = 0;
      attendanceRecords = [];
      paymentHistory = [];
    };

    workerProfiles.add(workerId, profile);
    workerId;
  };

  public query ({ caller }) func getWorkerProfile(workerId : Text) : async ?WorkerProfile {
    let profile = workerProfiles.get(workerId);
    switch (profile) {
      case (?p) {
        if (p.principal != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own worker profile");
        };
        ?p;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getMyWorkerProfile() : async ?WorkerProfile {
    for ((id, profile) in workerProfiles.entries()) {
      if (profile.principal == caller) {
        return ?profile;
      };
    };
    null;
  };

  public shared ({ caller }) func updateWorkerAvailability(workerId : Text, isAvailable : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update availability");
    };

    let profile = workerProfiles.get(workerId);
    switch (profile) {
      case (?p) {
        if (p.principal != caller) {
          Runtime.trap("Unauthorized: Can only update your own profile");
        };
        let updated = {
          p with isAvailable = isAvailable;
        };
        workerProfiles.add(workerId, updated);
      };
      case (null) { Runtime.trap("Worker profile not found") };
    };
  };

  // Employer Profile Management
  public shared ({ caller }) func saveEmployerProfile(profile : EmployerProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    employerProfiles.add(caller, profile);
  };

  public query ({ caller }) func getEmployerProfile(employer : Principal) : async ?EmployerProfile {
    if (caller != employer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own employer profile");
    };
    employerProfiles.get(employer);
  };

  public query ({ caller }) func getMyEmployerProfile() : async ?EmployerProfile {
    employerProfiles.get(caller);
  };

  // Job Posting Management
  public shared ({ caller }) func createJobPosting(
    requiredSkills : [Skill],
    wageAmount : Float,
    duration : Float,
    shiftTiming : Text,
    workerCount : Nat,
    location : Coordinates,
    jobDescription : Text
  ) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create job postings");
    };

    let employerProfile = employerProfiles.get(caller);
    switch (employerProfile) {
      case (null) { Runtime.trap("Employer profile not found. Create employer profile first.") };
      case (?_) {};
    };

    let jobId = "J" # nextJobId.toText();
    nextJobId += 1;

    let job : JobPosting = {
      id = jobId;
      employerId = caller;
      requiredSkills;
      wageAmount;
      duration;
      shiftTiming;
      workerCount;
      location;
      jobDescription;
      isCompleted = false;
      createdAt = Time.now();
      assignedWorkers = [];
    };

    jobPostings.add(jobId, job);
    jobId;
  };

  public query ({ caller }) func getJobPosting(jobId : Text) : async ?JobPosting {
    jobPostings.get(jobId);
  };

  public query ({ caller }) func getMyJobPostings() : async [JobPosting] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view job postings");
    };

    let jobs = jobPostings.values().toArray().filter(
      func(job) { job.employerId == caller }
    );
    jobs;
  };

  public query ({ caller }) func getAllJobPostings() : async [JobPosting] {
    jobPostings.values().toArray();
  };

  // Job Matching
  public query ({ caller }) func getJobMatches(jobId : Text) : async [CandidateMatch] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view job matches");
    };

    let job = jobPostings.get(jobId);
    switch (job) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.employerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view matches for your own jobs");
        };

        let matchResults = workerProfiles.values().toArray().filterMap(
          func(profile) {
            if (profile.isAvailable) {
              let skillsMatch = calculateSkillsMatch(job.requiredSkills, profile.skills);
              let distance = calculateDistance(job.location, profile.coordinates);
              ?{
                workerId = profile.id;
                skillsMatchPercentage = skillsMatch;
                distance;
                reliabilityScore = profile.reliabilityScore;
              };
            } else { null };
          }
        );

        matchResults.sort(
          func(a, b) {
            if (a.reliabilityScore > b.reliabilityScore) { #less }
            else if (a.reliabilityScore < b.reliabilityScore) { #greater }
            else { #equal };
          }
        );
      };
    };
  };

  public shared ({ caller }) func assignWorkerToJob(jobId : Text, workerId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can assign workers");
    };

    let job = jobPostings.get(jobId);
    switch (job) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.employerId != caller) {
          Runtime.trap("Unauthorized: Can only assign workers to your own jobs");
        };

        let worker = workerProfiles.get(workerId);
        switch (worker) {
          case (null) { Runtime.trap("Worker not found") };
          case (?w) {
            if (not w.isAvailable) {
              Runtime.trap("Worker is not available");
            };

            let updatedJob = {
              job with assignedWorkers = job.assignedWorkers.concat([workerId]);
            };
            jobPostings.add(jobId, updatedJob);
          };
        };
      };
    };
  };

  // Attendance Tracking
  public shared ({ caller }) func checkInWorker(jobId : Text, workerId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can check in workers");
    };

    let job = jobPostings.get(jobId);
    switch (job) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.employerId != caller) {
          Runtime.trap("Unauthorized: Can only check in workers for your own jobs");
        };

        let worker = workerProfiles.get(workerId);
        switch (worker) {
          case (null) { Runtime.trap("Worker not found") };
          case (?w) {
            let record : AttendanceRecord = {
              jobId;
              checkInTime = ?Time.now();
              checkOutTime = null;
              date = Time.now();
            };

            let updatedWorker = {
              w with attendanceRecords = w.attendanceRecords.concat([record]);
            };
            workerProfiles.add(workerId, updatedWorker);
          };
        };
      };
    };
  };

  public shared ({ caller }) func checkOutWorker(jobId : Text, workerId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can check out workers");
    };

    let job = jobPostings.get(jobId);
    switch (job) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.employerId != caller) {
          Runtime.trap("Unauthorized: Can only check out workers for your own jobs");
        };

        let worker = workerProfiles.get(workerId);
        switch (worker) {
          case (null) { Runtime.trap("Worker not found") };
          case (?w) {
            let updatedRecords = w.attendanceRecords.map(
              func(record) {
                if (record.jobId == jobId and record.checkOutTime == null) {
                  { record with checkOutTime = ?Time.now() };
                } else {
                  record;
                };
              }
            );

            let updatedWorker = {
              w with attendanceRecords = updatedRecords;
            };
            workerProfiles.add(workerId, updatedWorker);
          };
        };
      };
    };
  };

  // Rating System
  public shared ({ caller }) func rateWorker(
    jobId : Text,
    workerId : Text,
    rating : Nat,
    remarks : ?Text
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can rate workers");
    };

    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let job = jobPostings.get(jobId);
    switch (job) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.employerId != caller) {
          Runtime.trap("Unauthorized: Can only rate workers for your own jobs");
        };

        let ratingRecord : WorkerRating = {
          jobId;
          workerId;
          rating;
          remarks;
          ratedAt = Time.now();
        };

        let existingRatings = switch (workerRatings.get(workerId)) {
          case (null) { [] };
          case (?ratings) { ratings };
        };

        workerRatings.add(workerId, existingRatings.concat([ratingRecord]));

        let worker = workerProfiles.get(workerId);
        switch (worker) {
          case (null) { Runtime.trap("Worker not found") };
          case (?w) {
            let allRatings = existingRatings.concat([ratingRecord]);
            let totalRating = allRatings.foldLeft(
              0.0,
              func(acc, r) { acc + r.rating.toFloat() }
            );
            let avgRating = totalRating / allRatings.size().toFloat();

            let reliabilityScore = calculateReliabilityScore(w, avgRating);

            let updatedWorker = {
              w with 
              rating = avgRating;
              reliabilityScore;
              completedJobs = w.completedJobs + 1;
            };
            workerProfiles.add(workerId, updatedWorker);
          };
        };
      };
    };
  };

  // Payment Tracking
  public shared ({ caller }) func recordPayment(
    workerId : Text,
    jobId : Text,
    amount : Float
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can record payments");
    };

    let job = jobPostings.get(jobId);
    switch (job) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (job.employerId != caller) {
          Runtime.trap("Unauthorized: Can only record payments for your own jobs");
        };

        let worker = workerProfiles.get(workerId);
        switch (worker) {
          case (null) { Runtime.trap("Worker not found") };
          case (?w) {
            let payment : PaymentRecord = {
              jobId;
              amount;
              paymentDate = Time.now();
              isPaid = true;
            };

            let updatedWorker = {
              w with paymentHistory = w.paymentHistory.concat([payment]);
            };
            workerProfiles.add(workerId, updatedWorker);
          };
        };
      };
    };
  };

  public query ({ caller }) func getWorkerPaymentHistory(workerId : Text) : async [PaymentRecord] {
    let worker = workerProfiles.get(workerId);
    switch (worker) {
      case (null) { Runtime.trap("Worker not found") };
      case (?w) {
        if (w.principal != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own payment history");
        };
        w.paymentHistory;
      };
    };
  };

  // Admin Dashboard
  public query ({ caller }) func getSystemMetrics() : async SystemMetrics {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view system metrics");
    };

    let totalWorkers = workerProfiles.size();
    let totalEmployers = employerProfiles.size();
    let totalJobs = jobPostings.size();

    let filledJobs = jobPostings.values().toArray().filter(
      func(job) { job.assignedWorkers.size() >= job.workerCount }
    ).size();

    let jobFillRate = if (totalJobs > 0) {
      (filledJobs.toFloat() / totalJobs.toFloat()) * 100.0;
    } else {
      0.0;
    };

    {
      totalWorkersRegistered = totalWorkers;
      activeEmployersCount = totalEmployers;
      totalJobsPosted = totalJobs;
      jobFillRate;
      averageTimeToFillJobs = 0.0;
      workerRetentionRate = 0.0;
      employerRetentionRate = 0.0;
    };
  };

  public query ({ caller }) func getAllWorkers() : async [WorkerProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all workers");
    };
    workerProfiles.values().toArray();
  };

  public query ({ caller }) func getAllEmployers() : async [EmployerProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all employers");
    };
    employerProfiles.values().toArray();
  };

  // Helper Functions
  func calculateSkillsMatch(requiredSkills : [Skill], workerSkills : [Skill]) : Float {
    if (requiredSkills.size() == 0) {
      return 0.0;
    };

    let matchingSkills = workerSkills.filter(
      func(skill) {
        for (requiredSkill in requiredSkills.values()) {
          if (requiredSkill == skill) {
            return true;
          };
        };
        false;
      }
    );

    (matchingSkills.size().toFloat() / requiredSkills.size().toFloat()) * 100.0;
  };

  func calculateDistance(location1 : Coordinates, location2 : Coordinates) : Float {
    let latDiff = location1.latitude - location2.latitude;
    let lonDiff = location1.longitude - location2.longitude;
    Float.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111.0;
  };

  func calculateReliabilityScore(worker : WorkerProfile, avgRating : Float) : Float {
    let ratingWeight = 0.6;
    let attendanceWeight = 0.3;
    let completionWeight = 0.1;

    let attendanceRate = if (worker.attendanceRecords.size() > 0) {
      let completedAttendance = worker.attendanceRecords.filter(
        func(record) { record.checkOutTime != null }
      ).size();
      completedAttendance.toFloat() / worker.attendanceRecords.size().toFloat();
    } else {
      1.0;
    };

    let completionRate = if (worker.completedJobs > 0) {
      1.0;
    } else {
      0.5;
    };

    (avgRating * ratingWeight) + (attendanceRate * 5.0 * attendanceWeight) + (completionRate * 5.0 * completionWeight);
  };
};

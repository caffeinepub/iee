import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Float "mo:core/Float";
import List "mo:core/List";
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

  public type CertifiedSkill = {
    skill : Skill;
    isCertified : Bool;
  };

  public type SkillWithExperience = {
    skill : Skill;
    experienceLevel : ExperienceLevel;
    yearsOfExperience : Nat;
    certificationStatus : [CertifiedSkill];
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
    skills : [SkillWithExperience];
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
    requiredSkills : [SkillWithExperience];
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

  public type PaymentMethod = {
    #cash;
    #bankTransfer;
    #mobileMoney;
    #crypto;
  };

  public type PaymentStatus = {
    #pending;
    #completed;
    #failed;
  };

  public type PaymentRecord = {
    jobId : Text;
    amount : Float;
    paymentDate : Time.Time;
    paymentMethod : PaymentMethod;
    paymentStatus : PaymentStatus;
    runningBalance : Float;
  };

  public type CandidateMatch = {
    workerId : Text;
    skillsMatchPercentage : Float;
    distance : Float;
    reliabilityScore : Float;
    matchScore : Float;
  };

  public type WorkerRating = {
    jobId : Text;
    workerId : Text;
    rating : Nat;
    remarks : ?Text;
    ratedAt : Time.Time;
  };

  public type MonthlyFillRate = {
    month : Text;
    fillRate : Float;
  };

  public type RetentionMetrics = {
    periodDays : Nat;
    workerRetention : Float;
    employerRetention : Float;
  };

  public type RevenueMetrics = {
    totalTransactionVolume : Float;
    averageRevenuePerJob : Float;
    subscriptionTierDistribution : [Text];
  };

  public type SystemMetrics = {
    totalWorkersRegistered : Nat;
    activeEmployersCount : Nat;
    totalJobsPosted : Nat;
    jobFillRate : Float;
    averageTimeToFillJobs : Float;
    workerRetentionRate : Float;
    employerRetentionRate : Float;
    monthlyFillRates : [MonthlyFillRate];
    retentionMetrics : [RetentionMetrics];
    revenueMetrics : RevenueMetrics;
  };

  public type BulkJobResult = {
    validJobs : [JobPosting];
    invalidEntries : [Text];
    successfullyCreatedJobs : [Text];
  };

  public type BadgeLevel = {
    #none;
    #bronze;
    #silver;
    #gold;
  };

  public type VerifiedWorker = {
    workerId : Text;
    principal : Principal;
    badgeLevel : BadgeLevel;
    completedJobs : Nat;
    averageRating : Float;
    reliabilityScore : Float;
    verifiedAt : Time.Time;
  };

  public type JobTemplate = {
    templateId : Text;
    employerId : Principal;
    templateName : Text;
    requiredSkills : [SkillWithExperience];
    wageAmount : Float;
    duration : Float;
    shiftTiming : Text;
    workerCount : Nat;
    location : Coordinates;
    jobDescription : Text;
  };

  public type JobReminders = {
    jobId : Text;
    workerId : Text;
    reminderSent : Bool;
    confirmationSent : Bool;
    updateSent : Bool;
    cancelled : Bool;
  };

  public type DayAvailability = {
    available : Bool;
    timeRange : ?(Text, Text); // (start, end)
  };

  public type WorkerAvailability = {
    workerId : Text;
    availability : [DayAvailability];
  };

  public type AvailabilityRequest = {
    dayIndex : Nat;
    available : Bool;
    timeRange : ?(Text, Text); // (start, end)
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let workerProfiles = Map.empty<Text, WorkerProfile>();
  let employerProfiles = Map.empty<Principal, EmployerProfile>();
  let jobPostings = Map.empty<Text, JobPosting>();
  let workerRatings = Map.empty<Text, [WorkerRating]>();
  let verifiedWorkers = Map.empty<Text, VerifiedWorker>();
  let jobTemplates = Map.empty<Principal, [JobTemplate]>();
  let workerAvailability = Map.empty<Text, WorkerAvailability>();
  let jobReminders = Map.empty<Text, [JobReminders]>();

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
    skills : [SkillWithExperience],
    wageRange : WageRange,
    coordinates : Coordinates
  ) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create worker profiles");
    };

    // Check if worker profile already exists for this caller
    for ((id, profile) in workerProfiles.entries()) {
      if (profile.principal == caller) {
        Runtime.trap("Worker profile already exists for this user");
      };
    };

    let workerId = "W" # nextWorkerId.toText();
    nextWorkerId += 1;

    let profile : WorkerProfile = {
      id = workerId;
      principal = caller;
      name;
      mobileNumber;
      skills;
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

    // Initialize default availability for the worker
    let defaultAvailability : [DayAvailability] = [
      { available = true; timeRange = null },
      { available = true; timeRange = null },
      { available = true; timeRange = null },
      { available = true; timeRange = null },
      { available = true; timeRange = null },
      { available = true; timeRange = null },
      { available = true; timeRange = null },
    ];

    let availability : WorkerAvailability = {
      workerId;
      availability = defaultAvailability;
    };

    workerAvailability.add(workerId, availability);

    workerId;
  };

  public query ({ caller }) func getWorkerProfile(workerId : Text) : async ?WorkerProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view worker profiles");
    };

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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

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
      case (null) { Runtime.trap("Worker profile not found") };
      case (?p) {
        if (p.principal != caller) {
          Runtime.trap("Unauthorized: Can only update your own profile");
        };
        let updated = {
          p with isAvailable = isAvailable;
        };
        workerProfiles.add(workerId, updated);
      };
    };
  };

  // Employer Profile Management
  public shared ({ caller }) func saveEmployerProfile(profile : EmployerProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    
    // Verify that the profile's principal matches the caller
    if (profile.principal != caller) {
      Runtime.trap("Unauthorized: Can only save your own employer profile");
    };
    
    employerProfiles.add(caller, profile);
  };

  public query ({ caller }) func getEmployerProfile(employer : Principal) : async ?EmployerProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view employer profiles");
    };

    if (caller != employer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own employer profile");
    };
    employerProfiles.get(employer);
  };

  public query ({ caller }) func getMyEmployerProfile() : async ?EmployerProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    employerProfiles.get(caller);
  };

  // Job Posting Management
  public shared ({ caller }) func createJobPosting(
    requiredSkills : [SkillWithExperience],
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view job postings");
    };
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view job postings");
    };
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
              let matchScore = calculateMatchScore(skillsMatch, distance, profile.reliabilityScore, profile.isAvailable);
              ?{
                workerId = profile.id;
                skillsMatchPercentage = skillsMatch;
                distance;
                reliabilityScore = profile.reliabilityScore;
                matchScore;
              };
            } else { null };
          }
        );

        matchResults.sort(
          func(a, b) {
            if (a.matchScore > b.matchScore) { #less }
            else if (a.matchScore < b.matchScore) { #greater }
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

  // Bulk Job Upload
  public shared ({ caller }) func bulkJobUpload(jobEntries : [(Text, [SkillWithExperience], Float, Float, Text, Nat, Coordinates, Text)]) : async BulkJobResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upload jobs in bulk");
    };

    let employerProfile = employerProfiles.get(caller);
    switch (employerProfile) {
      case (null) { Runtime.trap("Employer profile not found. Create employer profile first.") };
      case (?_) {};
    };

    let validJobs : List.List<JobPosting> = List.empty<JobPosting>();
    let invalidEntries : List.List<Text> = List.empty<Text>();
    let successfullyCreatedJobs : List.List<Text> = List.empty<Text>();

    for ((title, skills, wage, duration, shift, count, location, description) in jobEntries.values()) {
      if (title == "" or skills.size() == 0 or wage <= 0.0 or duration <= 0.0) {
        invalidEntries.add(title);
      } else {
        let jobId = "J" # nextJobId.toText();
        nextJobId += 1;

        let job : JobPosting = {
          id = jobId;
          employerId = caller;
          requiredSkills = skills;
          wageAmount = wage;
          duration;
          shiftTiming = shift;
          workerCount = count;
          location;
          jobDescription = description;
          isCompleted = false;
          createdAt = Time.now();
          assignedWorkers = [];
        };

        validJobs.add(job);
        successfullyCreatedJobs.add(jobId);
        jobPostings.add(jobId, job);
      };
    };

    {
      validJobs = validJobs.toArray();
      invalidEntries = invalidEntries.toArray();
      successfullyCreatedJobs = successfullyCreatedJobs.toArray();
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
        let worker = workerProfiles.get(workerId);
        switch (worker) {
          case (null) { Runtime.trap("Worker not found") };
          case (?w) {
            let isEmployer = job.employerId == caller;
            let isWorkerSelf = w.principal == caller;
            let isAssigned = job.assignedWorkers.filter(func(id) { id == workerId }).size() > 0;

            if (not isAssigned) {
              Runtime.trap("Worker is not assigned to this job");
            };

            if (not isEmployer and not isWorkerSelf) {
              Runtime.trap("Unauthorized: Can only check in workers for your own jobs or check yourself in");
            };

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
        let worker = workerProfiles.get(workerId);
        switch (worker) {
          case (null) { Runtime.trap("Worker not found") };
          case (?w) {
            let isEmployer = job.employerId == caller;
            let isWorkerSelf = w.principal == caller;
            let isAssigned = job.assignedWorkers.filter(func(id) { id == workerId }).size() > 0;

            if (not isAssigned) {
              Runtime.trap("Worker is not assigned to this job");
            };

            if (not isEmployer and not isWorkerSelf) {
              Runtime.trap("Unauthorized: Can only check out workers for your own jobs or check yourself out");
            };

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

        let isAssigned = job.assignedWorkers.filter(func(id) { id == workerId }).size() > 0;
        if (not isAssigned) {
          Runtime.trap("Worker was not assigned to this job");
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

            updateVerifiedWorkerInternal(workerId, w.principal);
          };
        };
      };
    };
  };

  // Payment Tracking
  public shared ({ caller }) func recordPayment(
    workerId : Text,
    jobId : Text,
    amount : Float,
    paymentMethod : PaymentMethod
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

        let isAssigned = job.assignedWorkers.filter(func(id) { id == workerId }).size() > 0;
        if (not isAssigned) {
          Runtime.trap("Worker was not assigned to this job");
        };

        let worker = workerProfiles.get(workerId);
        switch (worker) {
          case (null) { Runtime.trap("Worker not found") };
          case (?w) {
            let runningBalance = w.paymentHistory.foldLeft(
              0.0,
              func(acc, rec) {
                if (rec.paymentStatus == #completed) {
                  acc + rec.amount;
                } else {
                  acc;
                };
              },
            ) + amount;

            let payment : PaymentRecord = {
              jobId;
              amount;
              paymentDate = Time.now();
              paymentMethod;
              paymentStatus = #completed;
              runningBalance;
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view payment history");
    };

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

  // Verified Workers (Worker Verification Badges)
  public query ({ caller }) func getVerifiedWorker(workerId : Text) : async ?VerifiedWorker {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view badges");
    };
    verifiedWorkers.get(workerId);
  };

  // Internal function - not exposed as public endpoint
  func updateVerifiedWorkerInternal(workerId : Text, principal : Principal) {
    let completedJobs = getWorkerCompletedJobs(workerId);
    let badgeLevel = getBadgeLevel(completedJobs);

    let workerProfile = getWorkerProfileInternal(workerId);
    let averageRating = switch (workerProfile) {
      case (null) { 0.0 };
      case (?profile) { profile.rating };
    };

    let reliabilityScore = switch (workerProfile) {
      case (null) { 5.0 };
      case (?profile) { profile.reliabilityScore };
    };

    let verifiedWorker : VerifiedWorker = {
      workerId;
      principal;
      badgeLevel;
      completedJobs;
      averageRating;
      reliabilityScore;
      verifiedAt = Time.now();
    };

    verifiedWorkers.add(workerId, verifiedWorker);
  };

  func getWorkerCompletedJobs(workerId : Text) : Nat {
    let workerProfile = workerProfiles.get(workerId);
    switch (workerProfile) {
      case (null) { 0 };
      case (?profile) { profile.completedJobs };
    };
  };

  func getBadgeLevel(completedJobs : Nat) : BadgeLevel {
    let bronzeThreshold = 10;
    let silverThreshold = 50;
    let goldThreshold = 100;

    if (completedJobs >= goldThreshold) {
      #gold;
    } else if (completedJobs >= silverThreshold) {
      #silver;
    } else if (completedJobs >= bronzeThreshold) {
      #bronze;
    } else {
      #none;
    };
  };

  func getWorkerProfileInternal(workerId : Text) : ?WorkerProfile {
    workerProfiles.get(workerId);
  };

  public query ({ caller }) func getEmployerFavoriteWorkers(employerId : Principal) : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view favorites");
    };
    if (caller != employerId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only access your own favorites");
    };
    [];
  };

  public shared ({ caller }) func addFavoriteWorker(employerId : Principal, workerId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add favorites");
    };
    if (caller != employerId) {
      Runtime.trap("Unauthorized: Can only add favorites to your own list");
    };
  };

  public shared ({ caller }) func removeFavoriteWorker(employerId : Principal, workerId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can remove favorites");
    };
    if (caller != employerId) {
      Runtime.trap("Unauthorized: Can only remove favorites from your own list");
    };
  };

  // Job Templates
  public shared ({ caller }) func saveJobTemplate(template : JobTemplate) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save job templates");
    };
    if (caller != template.employerId) {
      Runtime.trap("Unauthorized: Can only save templates for your own jobs");
    };

    let existingTemplates = switch (jobTemplates.get(caller)) {
      case (null) { [] };
      case (?templates) { templates };
    };

    jobTemplates.add(caller, existingTemplates.concat([template]));
  };

  public query ({ caller }) func getJobTemplates(employerId : Principal) : async [JobTemplate] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view job templates");
    };
    if (caller != employerId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only access your own templates");
    };

    switch (jobTemplates.get(employerId)) {
      case (null) { [] };
      case (?template) { template };
    };
  };

  // Worker Availability (Calendar)
  public shared ({ caller }) func updateWorkerAvailabilityWithPattern(workerId : Text, availability : [AvailabilityRequest]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be an authorized user to update availability");
    };

    let workerProfile = workerProfiles.get(workerId);
    switch (workerProfile) {
      case (null) { Runtime.trap("Worker profile not found") };
      case (?profile) {
        if (profile.principal != caller) {
          Runtime.trap("Unauthorized: Only workers can update their own availability");
        };

        let existingAvailability = switch (workerAvailability.get(workerId)) {
          case (null) { [] };
          case (?availability) { availability.availability };
        };

        if (existingAvailability.size() != 7) {
          Runtime.trap("Invalid availability data");
        };

        var newAvailability = existingAvailability;

        for (update in availability.values()) {
          if (update.dayIndex >= 0 and update.dayIndex < 7) {
            newAvailability := Array.tabulate(
              7,
              func(i) {
                if (i == update.dayIndex) {
                  { available = update.available; timeRange = update.timeRange };
                } else {
                  newAvailability[i];
                };
              },
            );
          };
        };

        let pattern : WorkerAvailability = {
          workerId;
          availability = newAvailability;
        };

        workerAvailability.add(workerId, pattern);
      };
    };
  };

  public query ({ caller }) func getWorkerAvailability(workerId : Text) : async [DayAvailability] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view worker availability");
    };

    let pattern = workerAvailability.get(workerId);
    switch (pattern) {
      case (null) { [] };
      case (?p) { p.availability };
    };
  };

  // Job Reminders
  public shared ({ caller }) func updateJobReminders(reminder : JobReminders) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update job reminders");
    };

    // Verify caller has permission to update reminders for this job
    let job = jobPostings.get(reminder.jobId);
    switch (job) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        let isEmployer = job.employerId == caller;
        let isAssignedWorker = job.assignedWorkers.filter(func(id) { id == reminder.workerId }).size() > 0;
        
        let workerProfile = workerProfiles.get(reminder.workerId);
        let isWorkerSelf = switch (workerProfile) {
          case (null) { false };
          case (?w) { w.principal == caller };
        };

        if (not isEmployer and not (isAssignedWorker and isWorkerSelf)) {
          Runtime.trap("Unauthorized: Can only update reminders for your own jobs or your own assignments");
        };

        let reminders = switch (jobReminders.get(reminder.jobId)) {
          case (null) { [] };
          case (?reminders) { reminders };
        };

        jobReminders.add(reminder.jobId, reminders.concat([reminder]));
      };
    };
  };

  public query ({ caller }) func getJobReminders(jobId : Text) : async [JobReminders] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view job reminders");
    };

    // Verify caller has permission to view reminders for this job
    let job = jobPostings.get(jobId);
    switch (job) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        let isEmployer = job.employerId == caller;
        
        // Check if caller is an assigned worker
        var isAssignedWorker = false;
        for (workerId in job.assignedWorkers.values()) {
          let workerProfile = workerProfiles.get(workerId);
          switch (workerProfile) {
            case (?w) {
              if (w.principal == caller) {
                isAssignedWorker := true;
              };
            };
            case (null) {};
          };
        };

        if (not isEmployer and not isAssignedWorker and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view reminders for your own jobs or your own assignments");
        };

        switch (jobReminders.get(jobId)) {
          case (null) { [] };
          case (?reminders) { reminders };
        };
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

    let monthlyFillRates : [MonthlyFillRate] = [
      { month = "January"; fillRate = 75.0 },
      { month = "February"; fillRate = 80.0 },
      { month = "March"; fillRate = 85.0 },
    ];

    let retentionMetrics : [RetentionMetrics] = [
      { periodDays = 30; workerRetention = 92.0; employerRetention = 85.0 },
      { periodDays = 60; workerRetention = 87.0; employerRetention = 80.0 },
      { periodDays = 90; workerRetention = 81.0; employerRetention = 73.0 },
    ];

    let revenueMetrics : RevenueMetrics = {
      totalTransactionVolume = 15000.0;
      averageRevenuePerJob = 120.0;
      subscriptionTierDistribution = ["Basic: 60%", "Premium: 35%", "Enterprise: 5%"];
    };

    {
      totalWorkersRegistered = totalWorkers;
      activeEmployersCount = totalEmployers;
      totalJobsPosted = totalJobs;
      jobFillRate;
      averageTimeToFillJobs = 0.0;
      workerRetentionRate = 0.0;
      employerRetentionRate = 0.0;
      monthlyFillRates;
      retentionMetrics;
      revenueMetrics;
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

  func calculateSkillsMatch(requiredSkills : [SkillWithExperience], workerSkills : [SkillWithExperience]) : Float {
    if (requiredSkills.size() == 0) {
      return 0.0;
    };

    let matchingSkills = workerSkills.filter(
      func(skill) {
        for (reqSkill in requiredSkills.values()) {
          if (reqSkill.skill == skill.skill) {
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

  func calculateMatchScore(
    skillsMatchPercentage : Float,
    distance : Float,
    reliabilityScore : Float,
    isAvailable : Bool,
  ) : Float {
    let skillsWeight = 0.4;
    let distanceWeight = 0.3;
    let reliabilityWeight = 0.2;
    let availabilityWeight = 0.1;

    let distanceScore = if (distance <= 10.0) {
      5.0;
    } else if (distance <= 30.0) {
      4.0;
    } else if (distance <= 50.0) {
      3.0;
    } else if (distance <= 80.0) {
      2.0;
    } else { 1.0 };

    (skillsMatchPercentage / 20.0) * skillsWeight +
    (distanceScore * distanceWeight) +
    (reliabilityScore * reliabilityWeight) +
    (if (isAvailable) { 5.0 } else { 0.0 }) * availabilityWeight;
  };
};

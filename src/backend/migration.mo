import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type SkillWithExperience = {
    skill : {
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
    experienceLevel : {
      #novice;
      #intermediate;
      #expert;
    };
    yearsOfExperience : Nat;
    certificationStatus : [{
      skill : {
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
      isCertified : Bool;
    }];
  };

  type WageRange = {
    min : Float;
    max : Float;
  };

  type Coordinates = {
    latitude : Float;
    longitude : Float;
  };

  type WorkerProfile = {
    id : Text;
    principal : Principal.Principal;
    name : Text;
    mobileNumber : Text;
    skills : [SkillWithExperience];
    isAvailable : Bool;
    wageRange : WageRange;
    coordinates : Coordinates;
    reliabilityScore : Float;
    rating : Float;
    completedJobs : Nat;
    attendanceRecords : [{
      jobId : Text;
      checkInTime : ?Time.Time;
      checkOutTime : ?Time.Time;
      date : Time.Time;
    }];
    paymentHistory : [{
      jobId : Text;
      amount : Float;
      paymentDate : Time.Time;
      paymentMethod : {
        #cash;
        #bankTransfer;
        #mobileMoney;
        #crypto;
      };
      paymentStatus : {
        #pending;
        #completed;
        #failed;
      };
      runningBalance : Float;
    }];
  };

  // New types for migration
  type BadgeLevel = { #none; #bronze; #silver; #gold };

  type VerifiedWorker = {
    workerId : Text;
    principal : Principal.Principal;
    badgeLevel : BadgeLevel;
    completedJobs : Nat;
    averageRating : Float;
    reliabilityScore : Float;
    verifiedAt : Time.Time;
  };

  // Original old actor type
  type OldActor = {
    workerProfiles : Map.Map<Text, WorkerProfile>;
  };

  // Extended new actor type
  type NewActor = {
    workerProfiles : Map.Map<Text, WorkerProfile>;
    verifiedWorkers : Map.Map<Text, VerifiedWorker>;
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
    } else { #none };
  };

  func createVerifiedWorker(worker : WorkerProfile) : VerifiedWorker {
    {
      workerId = worker.id;
      principal = worker.principal;
      badgeLevel = getBadgeLevel(worker.completedJobs);
      completedJobs = worker.completedJobs;
      averageRating = worker.rating;
      reliabilityScore = worker.reliabilityScore;
      verifiedAt = Time.now();
    };
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    var verifiedWorkerData = Map.empty<Text, VerifiedWorker>();

    for ((workerId, worker) in old.workerProfiles.entries()) {
      let verifiedWorker = createVerifiedWorker(worker);
      verifiedWorkerData.add(workerId, verifiedWorker);
    };

    {
      workerProfiles = old.workerProfiles;
      verifiedWorkers = verifiedWorkerData;
    };
  };
};

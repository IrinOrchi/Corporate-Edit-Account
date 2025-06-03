import { isDevMode } from '@angular/core';

export enum Cookies {
  AUTH = 'AUTHTOKEN',
  REFTOKEN = 'REFTOKEN',
}

 export const RecruiterPanelUrl = 'https://recruiter.bdjobs.com/';

// export enum MultiSelectType {
//   IndustryLabel = 'Industry',
//   IndustryFormField = 'industry',
//   SkillsLabel = 'Expertise/Skills',
//   SkillsformField = 'skills',
//   InstitutesLabel = 'Institutes(You can select at most 5 Institutes)',
//   InstitutesFormField = 'institutes',
//   LocationFormField = 'location',
// }

// export enum FilterFormEnums {
//   RequirementMatching = 'requirementMatching',
//   SalaryRange = 'salaryRange',
//   AgeRange = 'ageRange',
//   ExpRange = 'expRange',
//   Industry = 'industry',
//   Skills = 'skills',
//   Institutes = 'institutes',
//   Degree = 'degree',
//   Course = 'course',
//   Result = 'result',
//   Major = 'major',
//   Location = 'location',
//   IsPresent = 'isPresent',
//   IsPermanent = 'isPermanent',
//   Keywords = 'keywords',
//   ApplicantName = 'applicantName',
//   IsMale = 'isMale',
//   IsFemale = 'isFemale',
//   IsEntry = 'isEntry',
//   IsMid = 'isMid',
//   IsTop = 'isTop',
//   AllGender = 'allGender',
//   AllJobLevel = 'allJobLevel',
//   AllClear = 'allClear',
//   isVideoCv = 'isVideoCv',
//   TriggerOnly = 'triggerOnly',
//   GradeMax = 'gradeMax',
//   GradeMin = 'gradeMin',
//   LinkedinSearch = 'linkedinSearch',
// }

export enum ResponseType {
  Success = 'Success',
  Error = 'Error',
  True = 1,
  False = 0,
}

export enum ResponseCode {
  success = 1,
  Error = 0,
}

// export enum Step {
//   All = '0',
//   Shortlist = '1',
//   FinalSelection = '20',
// }

export enum PageType {
  All = 'al',
  // NotViewed = 'nvwd',
  // Viewed = 'vwd',
  // Rejected = 'rej',
  // Shortlist = 'sltyp',
  // ActivityAssigned = 'sdu',
  // ActivityNotAssigned = 'nsdu',
  // ActivityRejected = 'rej',
  // FinalSelectionList = 'flh',
  // FinalSelectionHired = 'fh',
}

// export const DefaultPageType = PageType.All;

export enum SType {
  All = 'al',
  // Shortlist = 'sltyp',
  // FinalSelection = 'flh',
  // Online = 'onlinetest',
  // AiAssessment = 'aiasmnt',
  // Written = 'written',
  // VideoRecord = 'record',
  // FacetoFace = 'facetoface',
}

// export const DefaultSType = SType.All;

// export enum SIdentity {
//   All = '0',
//   Shortlist = '0',
//   FinalSelection = '0',
// }

// export type CustomActivityType =
//   | 'onlinetest'
//   | 'aiasmnt'
//   | 'written'
//   | 'record'
//   | 'facetoface';

// export enum OrderTypeEnums {
//   LatestApplied = 'DD',
//   EarlyApplied = 'DA',
//   EarlyShortlisted = 'PA',
//   LatestShortlisted = 'PD',
//   ApplicantName = 'NA',
//   ApplicantsResponse = 'APPRES',
//   Matching = 'OMP',
//   Attendance = 'ATD',
//   NotNotified = 'NTF',
//   ScheduleDate = 'SDUD',
//   VideoCV = 'VR',
//   Score = 'SCR',
// }

export const CompanyIdLocalStorage = 'CompanyId';
export const JobNoLocalStorage = 'jobno';
export const UserId = 'UserId';
 export const CompanyName = 'CompanyName';
  export const CompanyLogoUrl = 'CompanyLogoUrl';
 export const IsAdminUser = 'IsAdminUser';
 export const Domain = isDevMode() ? 'test' : 'gateway';
// export const ReviewQuesBeforeVideoInvite = 'ReviewQuesBeforeVideoInvite';

// export enum ComponentName {
//   JobTitle = 'job-title',
//   LeftPanel = 'left-filter-panel',
//   ApplicantCard = 'applicant-card',
//   Tabs = 'tabs',
//   Overview = 'overview',
//   BarCharts = 'bar-charts',
//   PieCharts = 'pie-charts',
// }

// export enum MainTabsEnums {
//   AllApplicants = 'All Applicants',
//   Shortlist = 'Shortlist',
//   FinalSelection = 'Final Selection',
//   Online = 'onlinetest',
//   AiAssessment = 'aiasmnt',
//   Written = 'written',
//   VideoRecord = 'record',
//   FacetoFace = 'facetoface',
//   HiringList = 'Hiring List',
//   Hired = 'Hired',
//   NotView = 'Not Viewed',
//   view = 'Viewed',
//   Rejected = 'Rejected',
//   All = 'All',
//   NotAssignedActivity = 'Not Assigned',
//   AssignedActivity = 'Assigned',
//   RejectedActivity = 'Rejected',
//   Remove = 'Remove',
//   Restore = 'Restore',
//   Reschedule = 'Reschedule',
//   Viewed = 'Viewed'
// }

// export enum ActivityEnums {
//   Online = 'ot',
//   AiAssessment = 'asmnt',
//   Written = 'w',
//   VideoRecord = 'vdo',
//   FacetoFace = 'ftf',
//   Shortlist = 'sltyp',
//   Rejected = 'rej',
//   FinalSelection = 'flh',
//   Restore = 'restore',
// }

// export enum Activity {
//   OnlineTest = 'onlinetest',
//   AiAssesment = 'aiasmnt',
//   Written = 'written',
//   VideoInterview = 'record',
//   FaceToFace = 'facetoface',
// }

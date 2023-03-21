export enum ErrorCode {
  default = 'DEFAULT',  
  invalidParameters = 'VALID',
  invalidCredentials = 'AUTH01',
  userNotFound = 'AUTH02',
  emailNotFound = 'AUTH03',
  userDisabled = 'AUTH04',
  emailFailed = 'EMAIL01',
  languageNotFound = 'LANG01',
  refreshFail = 'REFRESHFAIL',
  roleNotFound = 'ROLE01',
  userDuplicated = 'USER01',
  usernameDuplicated = 'USER02',
  emailDuplicated = 'USER03',
  passwordsDoNotMatch = 'PSW01',
  passwordResetTimeout = 'PSW02'
}

export enum ErrorMessage {
  default = 'Unkown server error',
  invalidParameters = 'Invalid parameters',
  invalidCredentials = 'Invalid credentials',
  userNotFound = 'User not found',
  emailNotFound = 'Email not found',
  userDisabled = 'User disabled',
  emailFailed = 'Email could not be sent',
  languageNotFound = 'Language not found',
  refreshFail = 'Session timed out. Pleas log in again',
  roleNotFound = 'Role not found',
  userDuplicated = 'User duplicated',
  usernameDuplicated = 'username duplicated',
  emailDuplicated = 'email duplicated',
  passwordsDoNotMatch = 'passwords do not match',
  passwordResetTimeout = 'password reset token timed out'
}

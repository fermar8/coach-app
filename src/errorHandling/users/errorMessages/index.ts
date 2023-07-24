enum UsersModuleErrorMessages {
  USER_CREATE_ERROR = 'User could not be created',
  USER_NOT_FOUND = 'User not found.',
  USER_ALREADY_EXISTS = 'User with this email or phone already exists in the database',
  USER_UNEXPECTED_ERROR = 'Unexpected error occurred.',
  USER_INVALID_CREDENTIALS = 'Invalid credentials provided.',
  USER_INVALID_TOKEN = 'Invalid or expired token provided',
}

export default UsersModuleErrorMessages;

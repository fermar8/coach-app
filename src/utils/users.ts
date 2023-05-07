import { UserRoles } from '../domain/users/types';

function checkIfUserRoleIsValid(role: string): boolean {
  if (role === UserRoles.ADMIN) {
    return true;
  } else if (role === UserRoles.COACH) {
    return true;
  } else if (role === UserRoles.PLAYER) {
    return true;
  } else {
    return false;
  }
}

export { checkIfUserRoleIsValid };

const UserRoles = {
  ADMIN: 1,
  ENGINEER: 2,
  SUPERVISOR: 3,
};

const ADMIN_USERS = [UserRoles.ADMIN, UserRoles.ENGINEER];

const ALL_USERS = [UserRoles.ADMIN, UserRoles.ENGINEER, UserRoles.SUPERVISOR];

export { ADMIN_USERS, ALL_USERS };

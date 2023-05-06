type UserTypes = {
  ADMIN: 'admin';
  COACH: 'coach';
  PLAYER: 'player';
};

interface CreateUserBody {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  userType: UserTypes;
}

export { CreateUserBody };

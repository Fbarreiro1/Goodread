import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Federico Barreiro',
    email: 'abc@email.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Henry Miller',
    email: 'henry@email.com',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;

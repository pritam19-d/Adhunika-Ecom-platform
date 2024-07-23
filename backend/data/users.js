import bcrypt from 'bcryptjs';

const users =[
  {
    name : "Admin User",
    email: "adminadhunika@gmail.com",
    mobileNo: 7134094651,
    password: bcrypt.hashSync("12345",10),
    isAdmin: true
  },
  {
    name : "Debjit Das",
    email: "debjitdas@gmail.com",
    mobileNo: 7134094652,
    password: bcrypt.hashSync("12345",10),
    isAdmin: false
  },
  {
    name : "Jishu Saha",
    email: "sahajishu@gmail.com",
    mobileNo: 7134094653,
    password: bcrypt.hashSync("12345",10),
    isAdmin: false
  }
]

export default users;
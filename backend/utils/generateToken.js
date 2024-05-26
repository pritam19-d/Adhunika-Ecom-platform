import jwt from 'jsonwebtoken';

const generateToken = (res, userId)=>{
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {expiresIn: "6d" })
    //Set JWT as HTTP-only Cookie 
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 6 * 24 * 3600*1000 //6days = 6*24hours = 144*3600*1000ms
    })

}

export default generateToken
import jwt from 'jsonwebtoken'

// generate token that expires in 12 hours
const generateToken = (id, email, role, ref_email, orgCom,orgName,superAdminCom,adminCom,agentCom) => {
  return jwt.sign(
    { id, email, role, ref_email, orgCom, orgName,superAdminCom,adminCom,agentCom},
    process.env.JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );
};


export default generateToken

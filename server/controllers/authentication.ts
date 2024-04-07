import express from "express";
import { UserModel, createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helper";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, username, fullname, password, profilePicture } = req.body;
    if (!email || !username || !fullname || !password || !profilePicture) {
      return res.status(400).send({ message: "All fields are required" });
    }
    const exsistingUser = await UserModel.findOne({ email });
    if (exsistingUser) {
      return res.status(400).send({ message: "User already exists" });
    }
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .send({ message: "Username already exists try another one" });
    }
    const salt = random();
    const user = await createUser({
      email,
      username,
      fullname,
      profilePicture,
      authentication: {
        salt,
        password: authentication(salt, password)
      },
    });
    res.status(201).send({ user }).end();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Invalid email or password' }).end();
      }
  
      const user:any = await getUserByEmail(email).select('+authentication.salt +authentication.password');
  
      if (!user) {
        return res.status(400).json({ message: 'User not found' }).end();
      }
  
      const expectedHash = authentication(user.authentication.salt, password);
      
      if (user.authentication.password != expectedHash) {
        return res.status(403).json({ message: 'Wrong password' }).end();
      }
  
      const salt = random();
      user.authentication.sessionToken = authentication(salt, user._id.toString());
  
      await user.save();
  
  
      return res.status(200).json(user).end();
    } catch (error) {
      return res.status(400).json({ message: 'Authentication Failed' }).end();
    }
  };

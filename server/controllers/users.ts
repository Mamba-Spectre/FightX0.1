import express from "express";
import { UserModel } from "../db/users";
import { ForumModal } from "../db/forum";

export const searchUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {

    const { username } = req.query;
    if (!username) {
        return res.status(400).send({ message: "Username is required" });
    }
    const searchRegex = new RegExp(username.toString(), "i");
    const users = await UserModel.find({ username: searchRegex });

    if (!users || users.length === 0) {
        return res.status(404).send({ message: "No users found" });
    }
    const usernames = users.map(user => user.username);
    res.status(200).send({ usernames }).end();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const userForums = async (req: express.Request, res: express.Response) => {
  try {
      const { username } = req.query;
      if (!username) {
          return res.status(400).send({ message: "Username is required" });
      }
      
      const forums = await ForumModal.find({ content: { $regex: new RegExp(username.toString(), 'i') } });
      res.status(200).send({ forums }).end();
  } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
  }
};


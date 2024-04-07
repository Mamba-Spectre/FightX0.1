import express from "express";
import { ForumModal, createForum } from "../db/forum";
import { UserModel, getUserByEmail } from "../db/users";

export const registerForum = async (
  req: express.Request,
  res: express.Response
) => {
  const { title, content } = req.body;
  const { username } = req.query;
  console.log(req);
  if (!title || !content) {
    return res.status(400).send({ message: "Missing required fields" });
  }
  if (username) {
    if (!getUserByEmail(username.toString())) {
      return res.status(404).send({ message: "User not found" });
    }
  }

  await createForum({
    title,
    content,
    createdBy: username,
  });

  res.status(200).send({ message: "Forum registered" }).end();
};

export const getForums = async (
  req: express.Request,
  res: express.Response
) => {
  const forums = await ForumModal.find();
  res.status(200).send({ forums }).end();
};

export const getUserForums = async (
  req: express.Request,
  res: express.Response
) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).send({ message: "Username is required" });
  }
  const forums = await ForumModal.find({ createdBy: username.toString() });
  res.status(200).send({ forums }).end();
};

import useGetComment from "./hooks/comment/useGetComment";
import {Comment, CommentArray} from "./interfaces/Comment";
import OpenAIService from "./services/OpenAIService";
import CreateOrUpdateCSV from "./utils/createOrUpdateCSV";
import { parseAndAnalyzeCSV, parseAndAnalyzeCSVGrouped } from "./utils/AnalyzeCSV"
import useAnalyzeComment from "./hooks/useAnalyzeComment";
import dotenv from "dotenv";
import User from "./interfaces/User";
import useGetAllUsers from "./hooks/useGetAllUsers";
import useGetPostsByUser from "./hooks/useGetPostsByUser";
import useGetCommentsByPost from "./hooks/comment/useGetCommentsByPost";
import Post from "./interfaces/Post";
import fs from "fs";
import averageSentiment from "./utils/averageSentiment";
import getUserCommentFromCSV from "./utils/getUserCommentFromCSV";
import useGetAllComments from "./hooks/comment/useGetAllComments";

dotenv.config();

function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export async function getComment(id: number): Promise<Comment> {
  const randomNumber = Math.floor(Math.random() * 25) + 1;

  await wait(randomNumber);

  const comment = await useGetComment(id);

  return comment;
}

export async function getAllComments(): Promise<CommentArray> {
  const comments = await useGetAllComments();

  return comments;
}

export async function getCommentsByPost(postId: number): Promise<Comment[]> {
  console.log(postId);
  const comments = await useGetCommentsByPost(postId);

  return comments;
}

export async function getAllUsers(): Promise<User[]> {
  const users = await useGetAllUsers();

  return users;
}

export async function getPostsByUser(userId: number): Promise<Post[]> {
  const posts = await useGetPostsByUser(userId);

  return posts;
}

export async function analyzeComment(comment: Comment): Promise<Comment> {
  const openai = new OpenAIService(process.env.OPENAI_API_KEY);

  const randomNumber = Math.floor(Math.random() * 25) + 1;

  await wait(randomNumber);

  const res = await openai.analyzeComment(comment.body);
  comment.sentiment = res[0].text.replace(/\n/g, '');
  comment.userId = comment.user.id;
  comment.username = comment.user.username;

  return comment;
}

export async function fakeAnalyzeComment(comment: Comment): Promise<Comment> {
  const randomNumber = Math.floor(Math.random() * 25) + 1;

  await wait(randomNumber);

  const res = await useAnalyzeComment();
  comment.sentiment = res;
  comment.userId = comment.user.id;
  comment.username = comment.user.username;

  return comment;
}

export async function createOrUpdateCSV(data: Comment, fileName: string): Promise<Boolean> {
  return CreateOrUpdateCSV(data, fileName)
}

export async function analyzeData(filePath: string): Promise<any> {
  return parseAndAnalyzeCSV(filePath);
}

export async function analyzeDataByUser(filePath: string): Promise<any> {
  return parseAndAnalyzeCSVGrouped(filePath);
}

export async function analyzeAverageSentiment(data: any): Promise<string> {
  const sentiment = averageSentiment(data);

  return sentiment
}

export async function getAndAnalyzeUserComments(userId: number): Promise<any> {
  const userComments = await getUserCommentFromCSV(userId);

  const avgCommentsSentiment = averageSentiment(userComments);

  return { userComments, avgCommentsSentiment };
}

export async function verifyDir(folder: string) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

}

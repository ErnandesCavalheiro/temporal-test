import useGetComment from "./hooks/useGetComment";
import Comment from "./interfaces/Comment";
import OpenAIService from "./services/OpenAIService";
import CreateOrUpdateCSV from "./utils/createOrUpdateCSV";
import AnalyzeCSV from "./utils/analyzeCSV";
import dotenv from "dotenv";

dotenv.config();

function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000); // Multiplica por 1000 para converter segundos em milissegundos
  });
}

export async function getComment(id: number): Promise<Comment | Comment[]> {
  console.log(id);

  const randomNumber = Math.floor(Math.random() * 25) + 1;

  await wait(randomNumber);

  const comment = await useGetComment(id);

  console.log(id);
  return comment;
}

export async function analyzeComment(comment: Comment | Comment[]): Promise<Comment[]> {
  const openai = new OpenAIService(process.env.OPENAI_API_KEY);

  const commentsArray = Array.isArray(comment) ? comment : [comment];

  console.log(commentsArray[0].id);

  const randomNumber = Math.floor(Math.random() * 25) + 1;

  await wait(randomNumber);

  for (const commentItem of commentsArray) {
    const res = await openai.analyzeComment(commentItem.body);

    commentItem.sentiment = res[0].text.replace(/\n/g, '');
    commentItem.userId = commentItem.user.id;
  }

  console.log(commentsArray[0].id);
  return commentsArray;
}

export async function createOrUpdateCSV(data: Comment | Comment[]): Promise<Boolean> {
  return CreateOrUpdateCSV(data)
}

export async function parseAndAnalyzeCSV(filePath: string): Promise<Object> {
  return AnalyzeCSV(filePath);
}

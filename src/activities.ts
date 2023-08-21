import useGetComment from "./hooks/useGetComment";
import Comment from "./interfaces/Comment";
import OpenAIService from "./services/OpenAIService";
import CreateOrUpdateCSV from "./utils/createOrUpdateCSV";
import AnalyzeCSV from "./utils/analyzeCSV";

export async function getComment(id: number, quantity: number): Promise<Comment | Comment[]> {
  const comment = await useGetComment(id, quantity);

  return comment;
}

export async function analyzeComment(comment: Comment | Comment[]): Promise<Comment[]> {
  const openai = new OpenAIService(process.env.OPENAI_API_KEY);

  const commentsArray = Array.isArray(comment) ? comment : [comment];

  for (const commentItem of commentsArray) {
    const res = await openai.analyzeComment(commentItem.body);

    commentItem.sentiment = res[0].text.replace(/\n/g, '');
    commentItem.userId = commentItem.user.id;
  }

  return commentsArray;
}

export async function createOrUpdateCSV(data: Comment | Comment[]): Promise<Boolean> {
  return CreateOrUpdateCSV(data)
}

export async function parseAndAnalyzeCSV(filePath: string): Promise<Object> {
  return AnalyzeCSV(filePath);
}

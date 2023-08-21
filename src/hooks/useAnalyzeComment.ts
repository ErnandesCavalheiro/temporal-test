import { promisify } from "util";
import Comment from "../interfaces/Comment";

const useAnalyzeComment = async (comment: Comment) => {
    const setTimeoutPromise = promisify(setTimeout);

    const randomNumber = Math.floor(Math.random() * 5) + 1;

    await setTimeoutPromise(randomNumber * 1000);

    return `Comentario: ${comment.body} análisado com sucesso!`;
}

export default useAnalyzeComment;
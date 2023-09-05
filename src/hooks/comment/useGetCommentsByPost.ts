import axios from "axios";
import { Comment } from "../../interfaces/Comment";

const useGetCommentsByPost = async (postId: number): Promise<Comment[]> => {
    try {
        const res = await axios.get(`https://dummyjson.com/comments/post/${postId}`);
        return res.data.comments;
    } catch (error) {
        console.log(error);
        throw new Error("Error processing comments");
    }
}

export default useGetCommentsByPost;
import axios from "axios";
import Comment from "../interfaces/Comment";

const useGetComment = async (commentId: number): Promise<Comment | Comment[]> => {
    try{
        const res = await axios.get(`https://dummyjson.com/comments/${commentId}`);
        return res.data;
    } catch (error) {
        throw new Error("Error fetching comment");
    }
}

export default useGetComment;

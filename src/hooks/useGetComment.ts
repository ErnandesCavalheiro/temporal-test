import axios from "axios";
import Comment from "../interfaces/Comment";

const useGetComment = async (commentId: number, quantity: number): Promise<Comment | Comment[]> => {
    try {
        if (commentId === 0 && quantity > 1) {
            const res = await axios.get(`https://dummyjson.com/comments?limit=${quantity}`)
            return res.data.comments
        }

        const res = await axios.get(`https://dummyjson.com/comments/${commentId}`);
        return res.data;
    } catch (error) {
        throw new Error("Error fetching comment");
    }
}

export default useGetComment;
import axios from "axios";
import { CommentArray } from "../../interfaces/Comment";

const useGetAllComments = async (): Promise<CommentArray> => {
    try {
        const res = await axios.get('https://dummyjson.com/comments?limit=340');
        
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error("Error fetching comment");
    }
}

export default useGetAllComments;
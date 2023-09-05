import axios from "axios";

const useGetPostsByUser = async (userId: number)  => {
    try {
        const res = await axios.get(`https://dummyjson.com/posts/user/${userId}`);
        const posts = res.data.posts;
        return [...posts, ...posts, ...posts, ...posts];
    } catch (error) {
        console.log(error);
        throw new Error("Error fetching posts");
    }
}

export default useGetPostsByUser;
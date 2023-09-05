import Post from "./Post";

interface User {
    id: string;
    username?: string;
    postSentimentAverage?: any;
    posts?: Post[];
    commentSentimentAverage?: any;
    comments?: Post[];
}

export default User;
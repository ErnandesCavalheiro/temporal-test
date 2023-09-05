import User from "./User";

interface Comment {
    id: number;
    body: string;
    postId: number;
    user: User;
    userId?: number | string;
    username?: string
    sentiment?: string;
}

interface CommentArray {
    comments: Comment[]
}


export {Comment, CommentArray};
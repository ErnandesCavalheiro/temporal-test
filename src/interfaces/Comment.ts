interface User {
    id: number;
    username: string;
}
  
interface Comment {
    id: number;
    body: string;
    postId: number;
    user: User;
    userId: number | undefined;
    sentiment: string | undefined;
}

export default Comment;
import axios from "axios";
import User from "../interfaces/User";

const useGetAllUsers = async (): Promise<User[]> => {
    try {
        const res = await axios.get('https://dummyjson.com/users?select=id,username&limit=0');
        return res.data.users;
    } catch (error) {
        console.log(error);
        throw new Error("Error fetching users");
    }
}

export default useGetAllUsers;
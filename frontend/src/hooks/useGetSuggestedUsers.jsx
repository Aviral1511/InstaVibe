import { setSuggestedUsers } from "@/redux/authSlice"
import { USER_API_ENDPOINT } from "@/utils/ApiEndPoints"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(`${USER_API_ENDPOINT}/suggested`, {withCredentials:true});
                if(res.data.success){
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    }, []);
}
export default useGetSuggestedUsers;
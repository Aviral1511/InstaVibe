import { setUserProfile } from "@/redux/authSlice"
import { USER_API_ENDPOINT } from "@/utils/ApiEndPoints"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`${USER_API_ENDPOINT}/${userId}/profile`, {withCredentials:true});
                if(res.data.success){
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [userId]);
}
export default useGetUserProfile;
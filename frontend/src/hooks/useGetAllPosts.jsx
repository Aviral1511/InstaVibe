import { setPosts } from "@/redux/postSlice"
import { POST_API_ENDPOINT } from "@/utils/ApiEndPoints"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetAllPosts = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get(`${POST_API_ENDPOINT}/all`, {withCredentials:true});
                if(res.data.success){
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPosts();
    }, []);
}
export default useGetAllPosts;
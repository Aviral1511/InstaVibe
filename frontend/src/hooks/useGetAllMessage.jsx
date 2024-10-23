import { setMessages } from "@/redux/chatSlice"
import { MESSAGE_API_ENDPOINT } from "@/utils/ApiEndPoints"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.auth);

    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                // console.log(selectedUser?._id);
                const res = await axios.get(`${MESSAGE_API_ENDPOINT}/all/${selectedUser?._id}`, {withCredentials:true});
                if(res.data.success){
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllMessages();
    }, [selectedUser]);
}
export default useGetAllMessage;
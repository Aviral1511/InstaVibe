import Conversation from '../schema/conversationSchema.js'
import Message from '../schema/messageSchema.js';

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]}
        });

        if(!conversation) {
            conversation = await Conversation.create({
                participants:[senderId, reciverId]
            });
        }

        const newMessage = await Message.create({
            senderId , receiverId, message
        });

        if(newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);

        //socket io implementation

        res.status(201).json({success:true, newMessage});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}

export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.find({
            participants:{$all : [senderId, receiverId]}
        });
        if(!conversation) return res.status(200).json({success:true, messages:[]});

        return res.status(201).json({success:true, messages:conversation?.messages});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}
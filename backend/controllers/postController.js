import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../schema/postSchema.js";
import User from "../schema/userSchema.js";
import Comment from "../schema/commentSchema.js";

export const addNewPost = async (req, res) => {
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;
        if(!image){
            return res.status(400).json({message:"Please add image also", success:false});
        }

        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width:800, height:800, fit:'inside'})
        .toFormat('jpeg',{quality:80})
        .toBuffer();

        //buffer to data Uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author : authorId
        });
        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({path:'author', select:'-password'});

        res.status(201).json({message:"New Post added successfully", success:true, post});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt:-1})
        .populate({path:'author', select:'username profilePicture'})
        .populate({path:'comments' , sort:{createdAt:-1}, populate : {
            path:'author',
            select:'username profilePicture'
        }});
        return res.status(201).json({
            posts, success:true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1})
        .populate({path:'author', select:'username profilePicture'})
        .populate({path:'comments' , sort:{createdAt:-1}, populate : {
            path:'author',
            select:'username profilePicture'
        }});
        return res.status(201).json({
            posts, success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}

export const likePost = async (req, res) => {
    try {
        const user1 = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({message:"No such post found", success:false});

        //like logic
        await post.updateOne({$addToSet : {likes : user1}});
        await post.save();

        //socket io implementation

        return res.status(201).json({message:"Post Liked", success:true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}
export const dislikePost = async (req, res) => {
    try {
        const user1 = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({message:"No such post found", success:false});

        //like logic
        await post.updateOne({$pull : {likes : user1}});
        await post.save();

        //socket io implementation

        return res.status(201).json({message:"Post Disliked", success:true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const user = req.id;

        const {text} = req.body;
        const post = await Post.findById(postId);
        if(!text) return res.status(400).json({message:"Please add some Comment", success:false});

        const comment = await Comment.create({
            text, author : user, post : postId
        })
        await comment.populate({
            path:'author',
            select:'username profilePicture'
        });
        
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({message:"Comment added", success:true, comment});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
} 

export const getCommentsofPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments  = await Comment.find({post:postId}).populate('author','username profilePicture');

        if(!comments) return res.status(404).json({message:"No comments found", success:false});
        
        return res.status(201).json({success:true, comments});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:"Post Not found", success:false});
        
        //checking if current user is author of post 
        if(post.author.toString() !== authorId) return res.status(403).json({message:"Unauthorized User", success:false});
        
        await Post.findByIdAndDelete(postId);
        
        //deleting post from user's array
        const user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();
        
        //deleting related comments
        await Comment.deleteMany({post:postId});
        
        return res.status(200).json({message:"Post Deleted Successfully", success:true});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:"Post Not found", success:false});

        const user = await User.findById(authorId);
        if(user.bookmarks.includes(postId)){
            //un-bookmark
            await user.updateOne({$pull : {bookmarks : postId}});
            await user.save();
            return res.status(201).json({type:'unsaved', message:"Removed from bookmark", success:true});
        } else {
            //bookmark
            await user.updateOne({$addToSet : {bookmarks : postId}});
            await user.save();
            return res.status(201).json({type:'saved', message:"Bookmarked Successfully", success:true});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error", success:false});
    }
}
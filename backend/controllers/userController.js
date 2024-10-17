import User from "../schema/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../schema/postSchema.js";

export const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(401).json({message: "Please fill in all fields.", success : false});
        }
        const existingUser = await User.findOne({email});
        const existingUser2 = await User.findOne({username});
        if(existingUser || existingUser2){
            return res.status(401).json({message: "User or email already exist. Try Different", success : false});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword});
        return res.status(201).json({message:"User Registered Successfully", success:true});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", success : false});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(401).json({message: "Please fill in all fields.", success : false});
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid Email or Password", success : false});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid Email or Password", success : false});
        }

        const token = await jwt.sign({userId:user._id}, process.env.SECRET_KEY, {expiresIn:'1d'});

        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        
        user = {
            _id: user._id,
            username: user.username,
            email : user.email,
            profilePicture : user.profilePicture,
            bio: user.bio,
            followers : user.followers,
            following : user.following,
            posts : populatedPosts
        }

        return res.cookie('token', token, {httpOnly:true, sameSite:'strict', maxAge:1*24*60*60*1000}).json({
            message: `Welcome Back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", success : false});
    }
}

export const logOut = async (req, res) => {
    try {
        return res.cookie('token',"",{maxAge:0}).json({
            message:"Logged Out Successfully",
            success:true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", success : false});
    }
}

export const getProfile  = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-password");
        return res.status(200).json({
            message: "Profile Retrieved Successfully",
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", success : false});
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file;

        let cloudResponse;
        let picUrl = 'https://th.bing.com/th?id=OIP.Z306v3XdxhOaxBFGfHku7wHaHw&w=244&h=255&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2';
        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
            picUrl = cloudResponse.secure_url;
        }

        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({message: "User Not Found", success : false});
        }
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        user.profilePicture = picUrl;
        await user.save();

        return res.status(200).json({
            message: "Profile Updated Successfully",
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", success : false});
    }
}
export const getSuggestedUser = async (req, res) => {
    try {
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(404).json({message: "User Not Found", success : false});
        }
        return res.status(201).json({message:"Users Found", success:true, users : suggestedUsers});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", success : false});
    }
}
export const followOrUnfollow = async (req, res) => {
    try {
        const user1 = req.id; //follow karne wala
        const user2 = req.params.id; // person whom user1 is following
        if(user1 === user2){
            return res.status(400).json({message: "You can't follow yourself", success :false});
        }

        const user = await User.findById(user1);
        const targetUser = await User.findById(user2);

        if(!user || !targetUser){
            return res.status(404).json({message: "User Not Found", success : false});
        }

        //checking following or not
        const isFollowing = user.following.includes(user2);
        if(isFollowing){
            //unfollowing logic
            await Promise.all([
                User.updateOne({_id:user1},{$pull: {following: user2}}),
                User.updateOne({_id:user2},{$pull: {followers: user1}}),
            ]);
            return res.status(200).json({message:"Unfollowed Successfully", success:true});
        } else {
            //following logic
            await Promise.all([
                User.updateOne({_id:user1},{$push: {following: user2}}),
                User.updateOne({_id:user2},{$push: {followers: user1}}),
            ]);
            return res.status(200).json({message:"Followed Successfully", success:true});
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error", success : false});
    }
}

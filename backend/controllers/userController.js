import User from "../schema/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(401).json({message: "Please fill in all fields.", success : false});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({message: "Email already in use. Try Different", success : false});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({username, email, password: hashedPassword});
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

        user = {
            _id: user._id,
            username: user.username,
            email : user.email,
            profilePicture : user.profilePicture,
            bio: user.bio,
            followers : user.followers,
            following : user.following,
            posts : user.posts
        }

        const token = await jwt.sign({userId:user._id}, process.env.SECRET_KEY, {expiresIn:'1d'});
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
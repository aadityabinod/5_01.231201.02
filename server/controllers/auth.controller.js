import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../emailservice/emailService.js";
import crypto from "crypto";

export const register = async (req, res) =>{
    const {name, email, password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({message: "Please fill in all fields"})
    }

    const userExists = await User.findOne({email});

    if(userExists){
        return res.status(400).json({message: "User already exists"})
    }

    const hashedPassword = await User.hashPassword(password);
    const token = await User.generateAuthToken;
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours  
    })

    try {
        await user.save();
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

        await sendVerificationEmail(email, verificationToken);
    } catch (error) {
        console.log("Error in register ", error);
        res.status(400).json({success: false, message: error.message});
    }


}



export const verifyEmail = async (req, res) => {
    const {code} = req.body;

	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
    } catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};


export const login = async (req,res) =>{
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({message: "Invalid credentials"})
        }

        const isPasswordCorrect = await User.ComparePassword(password, existingUser.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"})
        }

        const token = await existingUser.generateAuthToken();
        await existingUser.save();

        res.status(200).json({
            success: true,
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
            },
        });
    } catch (error) {
        console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });

    }
}

export const logout = async(req,res) =>{
      res.clearCookie("token");
      res.status(200).json({ success: true, message: "Logged out successfully" });    
}


export const forgotPassword = async(req,res) =>{
    const {email} = req.body;

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "User not found"})
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, resetToken);

        res.status(200).json({success: true, message: "Password reset email sent"});
    }catch(error){
        console.log("Error in forgotPassword ", error);
        res.status(400).json({success: false, message: error.message});
    }
}


export const resetPassword = async(req,res) =>{
    try {
        
        const { token, password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        const hashedPassword = await User.hashPassword(password);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true,  user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }, });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};    


import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import cloudinary from '../utils/cloudinary.js'
import getDataURI from '../utils/dataUri.js'
import getDataUri from '../utils/dataUri.js'




/* ================= REGISTER ================= */
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (role.toLowerCase() !== user.role.toLowerCase()) {
      return res.status(400).json({
        message: "Account does not exist with this role",
        success: false
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true
      });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({
        message: "Logged out successfully",
        success: true
      });
  } catch (error) {
    console.log("LOGOUT ERROR:", error);
  }
};

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    const userId = req.id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    /* ---------- Resume Upload ---------- */
    if (file) {
      const fileUri = getDataURI(file);
      const cloudResponse = await cloudinary.uploader.upload(
        fileUri.content,
        { resource_type: "raw" }
      );

      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    /* ---------- Skills ---------- */
    if (skills) {
      user.profile.skills = skills.split(",");
    }

    /* ---------- Basic Fields ---------- */
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user
    });

  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

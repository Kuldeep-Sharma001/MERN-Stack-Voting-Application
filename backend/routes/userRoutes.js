import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Candidate from "../models/candidate.js";
import { jwtAuthMiddleware, generateToken } from "../jwt.js";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const data = req.body;

    const adminExists = await User.findOne({ role: "admin" });
    if (data.role === "admin" && adminExists) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    const existingUser = await User.findOne({
      aadharCardNumber: data.aadharCardNumber,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const newUser = new User(data);
    const response = await newUser.save();

    const payload = {
      id: response._id,
      role: response.role,
    };

    const token = generateToken(payload);
    res.status(200).json({ success: true, token, user: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;
    if (!aadharCardNumber || !password)
      return res
        .status(400)
        .json({ success: false, message: "Fields missing" });
    const user = await User.findOne({
      aadharCardNumber: String(aadharCardNumber),
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid Aadhar Card Number or Password",
        });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = generateToken(payload);

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token, success: true, user: userObj });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//GET SINGLE VOTER
router.get("/get-voter/:id", jwtAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const voter = await User.findById(id).select("-password");
    if (!voter) {
      return res.status(404).json({
        success: false,
        message: "Voter Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Voter data fetched successfully",
      voter,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//UPDATE VOTER
router.put("/update-voter/:id", jwtAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  delete updatedData.password;
  try {
    const response = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (response) {
      return res.status(200).json({
        success: true,
        message: "Voter Data Updated Successfully",
        response,
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CHANGE PASSWORD
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect old password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// VOTING
router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) => {
  const candidateId = req.params.candidateId;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    const candidate = await Candidate.findById(candidateId);

    if (!candidate)
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    if (user.role === "admin")
      return res
        .status(403)
        .json({ success: false, message: "Admin cannot vote" });
    if (user.isVoted)
      return res
        .status(400)
        .json({ success: false, message: "You have already voted" });

    await Candidate.findByIdAndUpdate(candidateId, {
      $push: { votes: { user: userId } },
      $inc: { voteCount: 1 },
    });

    user.isVoted = true;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Vote recorded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//GET ALL VOTERS
router.get("/all-voters", jwtAuthMiddleware, async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(300).json({
        success: false,
        message: "You are not authorized for this operation",
      });
    }
    const allVoters = await User.find({ role: { $ne: "admin" } })
      .sort({ name: "asc" })
      .select("-password");
    res.status(200).json({
      success: true,
      message: "Voters Data Fetched",
      allVoters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//DELETE VOTER
router.delete("/delete-voter/:voterId", jwtAuthMiddleware, async (req, res) => {
  const role = req.user.role;
  try {
    if (role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You are not authorize to remove any voter",
      });
    }
    const { voterId } = req.params;
    const response = await User.findByIdAndDelete(voterId);
    if (response) {
      return res.status(200).json({
        success: true,
        message: "Voter Deleted Successfully",
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;

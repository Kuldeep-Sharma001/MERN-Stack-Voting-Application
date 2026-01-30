import express from 'express';
const router = express.Router();
import Candidate from '../models/candidate.js';
import User from '../models/user.js'; // Needed if you still want to delete users

// Helper Middleware to check Admin Role
const isAdmin = async (req, res, next) => {
    try {
        // Since we added role to the token payload, we check it directly
        // If you prefer DB check: const user = await User.findById(req.user.id);
        if(req.user.role !== 'admin'){
             return res.status(403).json({message: 'Access Denied. Admins Only.'});
        }
        next();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// ADD CANDIDATE
router.post('/add-candidate', isAdmin, async (req, res) => {
    try {
        const data = req.body;
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();
        
        res.status(200).json({ success: true, message: "Candidate Added", response });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

//Get Candidate
router.get('/get-candidate/:id',async (req, res)=>{
    const id = req.params.id;
    try {
        const getCandidate = await Candidate.findById(id);
        if(!getCandidate){
            return res.status(404).json({success:false, message:'No Candidate found'});
        }
        res.status(200).json({
            success:true,
            message:'Candidate Found',
            candidate:getCandidate
        })
    } catch (error) {
        res.status(500).json({
            message:error.message,
            success:false,
        })
    }
})

// UPDATE CANDIDATE
router.put('/update/:id', isAdmin, async (req, res) => {
    try {
        const candidateID = req.params.id;
        const updatedData = req.body;
        const response = await Candidate.findByIdAndUpdate(candidateID, updatedData, {
            new: true,
            runValidators: true
        });

        if (!response) return res.status(404).json({ error: "Candidate not found" });

        res.status(200).json({ success: true, message: 'Candidate Updated', response });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// DELETE CANDIDATE
router.delete('/delete/:id', isAdmin, async (req, res) => {
    try {
        const candidateId = req.params.id;
        const response = await Candidate.findByIdAndDelete(candidateId);

        if (!response) return res.status(404).json({ message: 'Candidate not found' });

        res.status(200).json({ success: true, message: 'Candidate deleted' });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});


export default router;
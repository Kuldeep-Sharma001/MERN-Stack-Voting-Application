import express from 'express';
const router = express.Router();
import candidate from '../models/candidate.js';
import user from '../models/user.js'
import {   generateToken } from '../jwt.js';
const checkUserRole = async(id)=>{
    const getUser = await user.findById(id);
    if(getUser.role==='admin') return true;
    else return false; 
}

router.post('/', async (req, res)=>{
    try{
        if(!(await checkUserRole(req.user.id))) return res.status(403).json({message : 'You are not authorized to perform this operation'});
        const data = req.body;
        const newCandidate = new candidate(data);
        const response =await newCandidate.save();
        console.log("Candidate data saved");
        res.status(200).json({
            message:"Candidate Data saved",
            response
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
})
router.put('/update/:id',   async (req,res)=>{
    try{
        if(!checkUserRole(req.user.id)) return res.status(403).json({
            message:"You are not authorize to perform this operation"
        });
        const candidateID = req.params.id;
        const candidateUpdatedData = req.body;
        const response = await candidate.findByIdAndUpdate(candidateID, candidateUpdatedData,{
            new:true, //Returns the updated document
            runValidators:true //Validate mongoose validation
        })
        if(!response) return res.status(400).json({error:"Candidate not found"});
        console.log('Candidate data updated \n', response);
        res.json(response)
    }catch(error){
        console.log(error,"Could not update candidate data, Something went wrong");
        res.status(500).json({message:"Could not update candidate data, Something went wrong"})
    }
})
router.delete('/delete/:id',   async(req, res)=>{
    try{
            if(!checkUserRole(req.user.id)) return res.status(403).json({message:'You are not authorize to perform this operation'});
            const candidateId = req.params.id;
            const response = await candidate.deleteOne({_id:candidateId});
            if(!response) res.status(404).json({message:'Candidate not found'})
            console.log('Candidate deleted succussfully');
            res.status(200).json({message:'Candidate deleted successfully', response});
    }catch(error){
        console.log('Candidate not found');
        res.status(500).json({message:'Invalid id, candidate not found'});
    }
})
export default router;
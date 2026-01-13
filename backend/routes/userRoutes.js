import express from 'express';
const router = express.Router();
import user from '../models/user.js';
import candidate from '../models/candidate.js';
import {jwtAuthMiddleware, generateToken} from '../jwt.js'
import dotenv from 'dotenv';
dotenv.config();
router.get('/', (req, res) => {
    res.status(200).json({ success:true, message:"All good"})
})
router.post('/register', async (req, res)=>{
    try{
        const data = req.body;
        // console.log(data);
        const newUser = new user(data);//creating new user document
        
        const response = await newUser.save(); //save the user to DB
        // console.log('New user created')
        // console.log('Data saved');
        const payload = {
            id: response._id
        }
        // console.log(JSON.stringify(payload));
       const token = generateToken(payload);
    //    console.log("Token : ", token);
       res.status(200).json({
        success:true,
        response, token
       })

    }catch(error){
        console.log(error);
        res.status(500).json({error:'Internal Server Error'}); 
    }
    
})

router.post('/login', async(req, res)=>{
    try{
        // console.log(req.body);
        let {aadharCardNumber, password} = req.body;
       password =  password.trim();
        const getUser = await user.findOne({aadharCardNumber});
        // console.log(getUser)
        if(!getUser){
            console.log("User not found")
            res.json({message:'User not found'});
        }else{
            // console.log('getuser.pswd: ', getUser.password,'password: ', password)
            if(getUser.password==password){
                // console.log('Password match')
                const payload={
                    id: getUser._id
                }
                const token = generateToken(payload);
                console.log('LoggedIn successfully ');
                res.json({
                    token,
                    success:true
               })
            }else{
                console.log("Invalid credentials")
                res.json({message:'Invalid credentials'});
            }
        }
    }catch(error){
        res.json({
            message:'Something went wrong',
            error
        })
    }
})
router.get('/profile', jwtAuthMiddleware, async(req, res)=>{
    try{
        const _id = req.user.id;
        const getUser = await user.findOne({_id});
        res.status(200).json({getUser,
            success:true
        })
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Internal server error', error})
    }
})

router.put('/profile/password', jwtAuthMiddleware, async(req, res)=>{
    try{
        const _id = req.user.id;
        const {currentPassword, newPassword} = req.body;
        const getUser = await user.findOne({_id});
        if(currentPassword!=getUser.password){
            res.json({message:'Password not match'});
        }else{
            await user.updateOne(
                {_id},
                {$set:{password:newPassword}},
                {new:true}
            )
            console.log('Password updated successfully');
            res.status(200).json({
                message:'Password updated successfully',
                success:true
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Something went wrong', error})
    }
})
router.get('/allCandidates', async (req, res)=>{
    const allCandidates = await candidate.find().sort({voteCount:'desc'});
    const data = allCandidates.map(candidate=>{
        return({
            name: candidate.name,
            party: candidate.party,
            votes: candidate.voteCount,
            id:candidate._id
        })
    })
    res.json(data);
})
router.post('/vote/:id', jwtAuthMiddleware, async (req,res)=>{
    const candidateId = req.params.id;
    const userId = req.user.id;
    try{
        const getUser = await user.findById(userId);
        const getCandidate = await candidate.findById(candidateId);
        if(!getCandidate) return res.json({message:'Candidate not found'});
        if(getUser.role=='admin') return res.json({message:'Admin can not vote'});
        if(getUser.isVoted) return res.json({message:'You have already voted'});
        getCandidate.votes.push({user:userId});
        getCandidate.voteCount++;
        await getCandidate.save();
        getUser.isVoted=true;
        await getUser.save();
        res.json({message:'You have voted successfully'});
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Internal Server Error'})
    }
})
export default router;
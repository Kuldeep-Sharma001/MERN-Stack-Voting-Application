import mongoose from 'mongoose';
const candidateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true,
    },
    email:{
        type:String,
    },
    mobile:{
        type:String,
    },
    party:{
        type:String,
        required:true,
        unique:true
    },
    votes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'user',
                required:true
            },
            votedAt:{
                type:Date,
                default: Date.now()
            }
        }
    ],
    voteCount:{
        type: Number,
        default:0
    }

})
 const Candidate = mongoose.model('candidate', candidateSchema);
 export default Candidate;
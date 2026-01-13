import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
   email:{
    type:String,
   },
   mobile:{
     type:String
   },
   aadharCardNumber:{
    type:Number,
    required:true,
    unique:true
   },
   password:{
    type:String,
    required:true
   },
   role:{
    type:String,
    enum:['voter', 'admin'],
    default:'voter'
   },
   isVoted:{
    type:Boolean,
    default: false
   }
})
const user = mongoose.model('user', userSchema);
export default user;
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../app/slice/user";
import api from '../apiConfig.js';

export default function Vote() {
  const [candidates, setCandidates] = useState([]);
  const token = useSelector(state => state.user.token);
  const voterId = useSelector(state=>state.user?.user?._id);
  const dispatch = useDispatch();
  const fetchData = async () => {
    try {
      const response = await fetch(`${api}/all-candidates`);
      const result = await response.json();
      setCandidates(result.candidates);
    } catch (err) {
      console.error(err);
    }
  };

  const updateVoterDetails = async()=>{
    try{
      const response = await fetch(`${api}/user/get-voter/${voterId}`,{
        method:'GET',
        headers:{authorization:token},}
      )
      const result = await response.json();
      if(result.success){
        dispatch(setUser(result.voter));
        localStorage.setItem('userv',JSON.stringify(result.voter));
      }else{
        throw new Error(result.message);
      }
    }catch(error){
      toast.error(error.message);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const handleVote = async (id) => {
    const loadingToast = toast.loading("Casting vote...");
    try {
      const response = await fetch(`${api}/user/vote/${id}`, {
        method: "POST",
        headers: { authorization: token },
      });
      const result = await response.json();
      
      if(result.success) {
         toast.success(result.message, { id: loadingToast });
         fetchData(); // Refresh Data
         updateVoterDetails();
      } else {
         toast.error(result.message, { id: loadingToast });
      }
    } catch (err) {
      toast.error("Failed to vote", { id: loadingToast });
    }
  };
  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 ">
      <h1 className="text-4xl font-bold text-center mb-10 bg-linear-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
        Cast Your Vote
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates?.map((candidate) => (
          <div key={candidate._id} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-violet-500/50 transition-all hover:scale-[1.02] shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{candidate.name}</h3>
                <p className="text-violet-400 font-medium">{candidate.party}</p>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded-lg text-sm font-mono text-center">
                {candidate.voteCount} Votes
              </div>
            </div>
            
            <button
              onClick={() => handleVote(candidate._id)}
              className="w-full mt-4 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95"
            >
              Vote for {candidate.name.split(' ')[0]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
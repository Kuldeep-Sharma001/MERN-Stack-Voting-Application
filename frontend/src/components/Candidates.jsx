import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Candidates() {
  const [data, setData] = useState([]);
  const { isLogin, user, token } = useSelector(state => state.user);
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3002/all-candidates");
      const result = await response.json();
      setData(result.candidates);
    } catch (err) {
      console.error(err);
    }
  };

  async function removeCandidate(id) {
    if(!window.confirm("Delete this candidate?")) return;
    const loadingToast = toast.loading('Removing Candidate');
    try {
      const response = await fetch(`http://localhost:3002/candidate/delete/${id}`, {
        method: 'DELETE',
        headers: { authorization: token }
      });
      const result = await response.json();

      if (result.success) {
        toast.success('Removed successfully', { id: loadingToast });
        fetchData();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error('Failed to remove', { id: loadingToast });
    }
  }

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white text-center w-full ">Candidates</h2>
        {isAdmin && (
          <button
            onClick={() => navigate('/add-candidate')}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-green-900/20"
          >
            + Add Candidate
          </button>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-violet-700 text-gray-200 font-semibold text-sm uppercase">
          <div className="col-span-5">Candidate Info</div>
          <div className="col-span-3 text-center">Vote Count</div>
          <div className="col-span-4 text-right">Actions</div>
        </div>
        
        <div className="divide-y divide-white/5">
          {data?.map((candidate) => (
            <div key={candidate._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
              <div className="col-span-5">
                <div className="text-xl font-bold text-white">{candidate.name}</div>
                <div className="text-violet-400 text-sm">{candidate.party}</div>
              </div>
              <div className="col-span-3 text-center text-2xl font-mono font-bold text-gray-300">
                {candidate.voteCount}
              </div>
              <div className="col-span-4 flex justify-end gap-3">
                 {isAdmin ? (
                   <>
                    <button onClick={() => navigate(`/add-candidate?id=${candidate._id}`)} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500 hover:text-white transition-all">Edit</button>
                    <button onClick={() => removeCandidate(candidate._id)} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-all">Delete</button>
                   </>
                 ) : (
                   <span className="text-gray-500 text-sm">View Only</span>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
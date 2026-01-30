import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AddCandidate() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const token = useSelector(state => state.user.token);

  const [formData, setFormData] = useState({
    name: "", age: "", email: "", mobile: "", party: "",
  });

  useEffect(() => {
    if (id) {
      const fetchCandidate = async () => {
        const loadToast = toast.loading('Loading candidate...');
        try {
          const res = await fetch(`http://localhost:3002/candidate/get-candidate/${id}`, {
             headers: { authorization: token } 
          });
          const result = await res.json();
          if (result.success) {
            setFormData(result.candidate);
            toast.dismiss(loadToast);
          } else throw new Error(result.message);
        } catch (error) {
          toast.error("Fetch failed", { id: loadToast });
        }
      };
      fetchCandidate();
    }
  }, [id, token]);

  const handleForm = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading('Saving...');
    
    try {
      const url = id 
        ? `http://localhost:3002/candidate/update/${id}`
        : "http://localhost:3002/candidate/add-candidate";
      
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", authorization: token },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message, { id: loadToast });
        navigate("/candidates");
      } else throw new Error(result.message);
    } catch (err) {
      toast.error(err.message, { id: loadToast });
    }
  };

  const inputClass = "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors";

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          {id ? 'Update Candidate' : 'Add Candidate'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Candidate Name" value={formData.name} onChange={handleForm} className={inputClass} required />
          <div className="grid grid-cols-2 gap-4">
             <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleForm} className={inputClass} required />
             <input type="text" name="party" placeholder="Party Name" value={formData.party} onChange={handleForm} className={inputClass} required />
          </div>
          <input type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleForm} className={inputClass} />
          <input type="email" name="email" placeholder="Email (Optional)" value={formData.email} onChange={handleForm} className={inputClass} />
          
          <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95">
            {id ? 'Save Changes' : 'Add Candidate'}
          </button>
        </form>
      </div>
    </div>
  );
}
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import api from '../apiConfig.js';

export default function VoterList() {
    const token = useSelector(state => state.user.token);
    const [allVoters, setAllVoters] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    async function getVoters() {
        const loadingToast = toast.loading('Fetching Voters...');
        try {
            const response = await fetch(`${api}/user/all-voters`, {
                headers: { authorization: token }
            });
            const result = await response.json();
            if (result.success) {
                toast.dismiss(loadingToast);
                setAllVoters(result.allVoters);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            toast.error(error.message, { id: loadingToast });
        }
    }

    async function removeVoter(id) {
        if(!window.confirm("Are you sure you want to delete this voter?")) return;
        
        try {
            const response = await fetch(`${api}/user/delete-voter/${id}`, {
                method: 'DELETE',
                headers: { authorization: token }
            });
            const result = await response.json();
            if (result.success) {
                toast.success('Voter deleted');
                getVoters();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to delete');
        }
    }

    useEffect(() => { getVoters(); }, []);

    // Filter Voters
    const filteredData = useMemo(() => {
        return allVoters.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.aadharCardNumber.toString().includes(searchQuery)
        );
    }, [allVoters, searchQuery]);

    return (
        <div className="max-w-6xl mx-auto mt-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-white">Voter List</h2>
                <div className="flex w-full md:w-auto gap-4">
                    <input 
                        type="text" 
                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-violet-500 w-full md:w-64"
                        placeholder="Search by Name or Aadhar..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                        onClick={() => navigate('/register')}
                        className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl text-white font-medium transition-colors whitespace-nowrap"
                    >
                        + Add Voter
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="bg-violet-700 uppercase text-sm font-semibold text-gray-300">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Aadhar</th>
                                <th className="px-6 py-4">Age</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredData.map((voter) => (
                                <tr key={voter._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{voter.name}</td>
                                    <td className="px-6 py-4 font-mono text-sm">{voter.aadharCardNumber}</td>
                                    <td className="px-6 py-4">{voter.age}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">{voter.email}</div>
                                        <div className="text-xs text-gray-500">{voter.mobile}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${voter.isVoted ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {voter.isVoted ? 'Voted' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button onClick={() => navigate(`/register?id=${voter._id}`)} className="text-blue-400 hover:text-blue-300">Edit</button>
                                            <button onClick={() => removeVoter(voter._id)} className="text-red-400 hover:text-red-300">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredData.length === 0 && (
                    <div className="text-center py-10 text-gray-500">No voters found</div>
                )}
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";

export default function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch candidates
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3002/user/allCandidates");
      const result = await response.json();
      setCandidates(result);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [message]); // only refetch when message changes

  // Handle vote
  const handleVote = async (id) => {
    try {
      const response = await fetch(`http://localhost:3002/user/vote/${id}`, {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      const result = await response.json();
      setMessage(result.message);

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  return (
    <div className="text-white my-10 mx-auto items-center w-[95vw] max-w-[600px] relative">
      {message && (
        <div className="w-full mx-auto text-center bg-gray-600 p-3 text-xl border-orange-600 border-2 rounded-lg text-orange-400 font-bold absolute top-[40%]">
          {message}
        </div>
      )}

      <div className="grid grid-cols-[4fr_2fr_2fr_2fr] text-2xl text-red-500 font-semibold">
        <div>Candidate Name</div>
        <div>Party</div>
        <div>Count</div>
        <div>Vote</div>
      </div>

      {candidates.map((candidate) => (
        <div
          key={candidate.id}
          className="grid grid-cols-[4fr_2fr_2fr_2fr] py-2 text-xl w-full mx-auto"
        >
          <div>{candidate.name}</div>
          <div>{candidate.party}</div>
          <div>{candidate.votes}</div>
          <button
            className="border py-1 rounded-xl border-orange-950 hover:bg-orange-900 cursor-pointer bg-orange-600"
            onClick={() => handleVote(candidate.id)}
          >
            Vote
          </button>
        </div>
      ))}
    </div>
  );
}

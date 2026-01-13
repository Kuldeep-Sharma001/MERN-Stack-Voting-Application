import { useEffect, useState } from "react";

export default function Candidate() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3002/user/allCandidates"
        );
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="text-white my-10 mx-auto w-[95vw] max-w-[600px]">
      <div className="grid grid-cols-[4fr_2fr_2fr] text-2xl text-red-500 font-semibold">
        <div>Candidate Name</div>
        <div>Party</div>
        <div>Votes</div>
      </div>
      {data.map((candidate, i) => (
        <div key={i} className="grid grid-cols-[4fr_2fr_2fr] py-2 text-xl">
          <div>{candidate.name}</div>
          <div>{candidate.party}</div>
          <div>{candidate.votes}</div>
        </div>
      ))}
    </div>
  );
}

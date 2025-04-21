import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getHeaders } from "@/utils/auth";
import { useSearchParams } from "react-router-dom";

function StudentCards() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");


  const fetchCards = async (): Promise<any[]> => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/student/client/${clientId}`,
      getHeaders()
    );
    return response.data.data;
  };



  const {
    data: cards,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["student-cards"],
    queryFn: fetchCards,
  });




  if (isLoading) {
    return <div>Loading student cards...</div>;
  }

  if (isError) {
    return <div>Failed to fetch student cards. Please try again later.</div>;
  }


  
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Student Cards</h2>
      {cards && cards.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 gap-4">
          {cards.map((card) => (
            <div key={card._id} className="border  rounded shadow">
              {card.thumbnail && (
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}/${card.thumbnail}`}
                  alt={card.name}
                  className="mt-2 w-full object-contain rounded"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No student cards available.</p>
      )}
    </div>
  );
}

export default StudentCards;

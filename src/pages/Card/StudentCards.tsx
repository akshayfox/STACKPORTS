import React, { useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getHeaders } from "@/utils/auth";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getGroups } from "@/services/groupService";
import { Loader, Image, Filter, AlertCircle } from "lucide-react";

function StudentCards() {
  const [searchParams, setSearchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");
  const [selectedGroup, setSelectedGroup] = useState<string>(
    searchParams.get("groupId") || "all" // Default to "all" instead of ""
  );
  const fetchCards = async (): Promise<any[]> => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/student/client/${clientId}`,
      {
        ...getHeaders(),
        params: selectedGroup !== "all" ? { groupId: selectedGroup } : {},      }
    );
    return response.data.data ?? [];
  };

  const {
    data: cards,
    isLoading: isCardsLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["student-cards", clientId, selectedGroup],
    queryFn: fetchCards,
    enabled: !!clientId,
  });

  const { data: groups = [], isLoading: isGroupsLoading } = useQuery({
    queryKey: ["groups", clientId],
    queryFn: getGroups,
    enabled: !!clientId,
    select: (groups: any[]) =>
      groups.map((group) => ({
        label: group.fullname,
        value: group._id,
      })),
  });

  const handleGroupChange = (value: string) => {
    console.log(value)
    setSelectedGroup(value);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (value !== "all") {
        updated.set("groupId", value);
      } else {
        updated.delete("groupId");
      }
      return updated;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Student Cards
        </h1>

        {!isGroupsLoading && groups.length > 0 && (
          <Select value={selectedGroup} onValueChange={handleGroupChange}>
          <SelectTrigger className="w-full md:w-64">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <SelectValue placeholder="All Groups" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {groups.map((group: any) => (
              <SelectItem key={group.value} value={group.value}>
                {group.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        )}
      </div>

      {/* Loading State */}
      {isCardsLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg aspect-[3/4] w-full"></div>
              <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">
              Failed to load student cards.{" "}
              <button
                onClick={() => refetch()}
                className="font-medium underline hover:text-red-800">
                Try again
              </button>
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isCardsLoading && !isError && cards && cards.length === 0 && (
        <div className="text-center py-12">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No student cards found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {selectedGroup
              ? "This group doesn't have any cards yet."
              : "No cards have been created yet."}
          </p>
        </div>
      )}

      {/* Success State */}
      {!isCardsLoading && !isError && cards && cards.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {cards.map((card) => (
            <div
              key={card._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-center">
                {card.thumbnail ? (
                  <img
                    src={`${import.meta.env.VITE_IMAGE_URL}/${card.thumbnail}`}
                    alt={card.name}
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-gray-400 ">
                    <Image className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentCards;

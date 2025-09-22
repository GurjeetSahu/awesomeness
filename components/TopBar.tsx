"use client";

import { RotateCcw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { ThemeChanger } from "@/components/ThemeChanger";
import { Button } from "./ui/button";

export default function TopBar() {
  const queryClient = useQueryClient();
  return (
    <div className="flex items-center justify-between bg-gray-800 p-4">
      <div className="text-white text-lg font-bold">Awesomeness</div>
      <div className="flex space-x-4"></div>
      <div className="flex space-x-4">
        <Button
          onClick={() =>
           { queryClient.invalidateQueries({ queryKey: ["all-stars"] })
            alert("Refreshing! Please wait for the data to load.")}
          }
          variant="outline"
          size="icon"
        >
          <RotateCcw />
        </Button>
        <ThemeChanger />
      </div>
    </div>
  );
}

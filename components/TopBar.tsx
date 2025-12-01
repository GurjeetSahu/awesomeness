"use client";
import { ThemeChanger } from "@/components/ThemeChanger";
import { User } from "@/components/User";
import Ai from "@/components/Ai";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";

export default function TopBar() {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cursor = localStorage.getItem("cursor");

    if (!cursor) {
      console.log("No cursor found");

      const unsubscribe = queryClient.getQueryCache().subscribe(() => {
        const q = queryClient.getQueryData(["all-stars"]);
        if (q) {
          console.log("All-stars query detected → invalidating...");
          queryClient.invalidateQueries({ queryKey: ["all-stars"] });
          unsubscribe();
        }
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-between bg-gray-800 p-4">
      <div className="text-white text-lg font-bold">Awesomeness</div>
      <div className="flex space-x-4"></div>
      <div className="flex space-x-4">
        {/* Work in Progress */}
        {/* <Ai /> */}
        <ThemeChanger />
        <User />
        <Button
          className="ml-3"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["all-stars"] });
          }}
        ></Button>
      </div>
    </div>
  );
}

"use client";
import { ThemeChanger } from "@/components/ThemeChanger";
import { User } from "@/components/User";
import Ai from "@/components/Ai";
export default function TopBar() {
  return (
    <div className="flex items-center justify-between bg-gray-800 p-4">
      <div className="text-white text-lg font-bold">Awesomeness</div>
      <div className="flex space-x-4"></div>
      <div className="flex space-x-4">
        <Ai />
        <ThemeChanger />
        <User />
      </div>
    </div>
  );
}

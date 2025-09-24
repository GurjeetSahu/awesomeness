"use client";
import { ThemeChanger } from "@/components/ThemeChanger";

export default function TopBar() {
  return (
    <div className="flex items-center justify-between bg-gray-800 p-4">
      <div className="text-white text-lg font-bold">Awesomeness</div>
      <div className="flex space-x-4"></div>
      <div className="flex space-x-4">
        <ThemeChanger />
      </div>
    </div>
  );
}

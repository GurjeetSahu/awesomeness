"use server";

import { Separator } from "@/components/ui/separator";

import ReposTable from "@/components/ReposTable";
import TopBar from "@/components/TopBar";
import GroupTable from "@/components/SideBar";

export default async function Home() {
  const token = process.env.PAT;
  if (token) {
    return (
      <div className="flex flex-col h-dvh">
        <TopBar />
        <div className="flex flex-row h-full  ">
          <div className="flex flex-col flex-30 p-4">
            <GroupTable />
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col flex-70 p-4">
            <ReposTable />
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-row h-dvh bg-gradient-to-r from-slate-900 to-indigo-600">
        <div className="flex-40 content-center p-10">
          <h1 className="text-4xl font-bold  md:text-5xl ">
            Club your GitHub Stars into lists with more features!
          </h1>
          <h2>Please Provide Token</h2>
        </div>

        <div className="flex-60"></div>
      </div>
    </>
  );
}

"use server";
import { auth } from "@/lib/auth";
import { signIn } from "@/lib/auth";

import { Separator } from "@/components/ui/separator";

import ReposTable from "@/components/ReposTable";
import TopBar from "@/components/TopBar";
import GroupTable from "@/components/SideBar";

import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();
  async function onSignIn() {
    "use server";
    await signIn();
  }
  if (session?.user) {
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

          <Button className="mt-3" onClick={onSignIn}>
            Login With Github
          </Button>
        </div>

        <div className="flex-60"></div>
      </div>
    </>
  );
}

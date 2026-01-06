"use client";
import { signOut } from "next-auth/react";
import { ChevronsDown, LogOut, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import useStars from "@/lib/useStars";

export function User() {
  const { isFetching } = useStars();
  const queryClient = useQueryClient();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <Avatar>
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
          <ChevronsDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg "
        align="end"
        sideOffset={4}
      >
        <DropdownMenuItem>
          <RefreshCcw />
          <Button
            disabled={isFetching}
            className="ml-3"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["all-stars"] });
            }}
          >
            Refresh
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut />
          <Button className="ml-3" onClick={() => signOut()}>
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

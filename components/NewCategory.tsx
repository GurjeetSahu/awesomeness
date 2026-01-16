"use client";

//TOP LEVEL
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

//MID LEVEL
import RepoManager from "@/lib/repoManager";
import { useCategoryStore } from "@/lib/useStore";

//UI LEVEL
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export default function MultipleSelectorWithDisabledOption() {
  const { options: OPTIONS, setOptions } = useCategoryStore();
  const [repoManager] = useState(() => new RepoManager());

  const FormSchema = z.object({
    name: z.string(),
    id: z.string(),
    repos: z.string(),
  });

  const { register, handleSubmit, setValue } =
    useForm<z.infer<typeof FormSchema>>();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
     setValue("repos", "")
    await repoManager.addCategory(
      data.name,
      data.repos ? Number(data.repos) : null
    );
    const cats = await repoManager.getCategoryTreeFromDexie();
    setOptions(
      cats.map(({ name, id }) => ({ value: String(id), label: name }))
    );
  }
  //Add Parent Category Options
  useEffect(() => {
    (async () => {
      const cats = await repoManager.getCategoryTreeFromDexie();
      setOptions(
        cats.map(({ name, id }) => ({ value: String(id), label: name }))
      );
    })();
  }, []);
  return (
    <div className="">
      <Dialog>
        <DialogTrigger asChild>
          <Button className=" w-full mb-2 bg-green-500">
            <Plus />
            Add Category
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogDescription></DialogDescription>

          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="name">Name</Label>
            <input
              placeholder="Name of Category"
              className="border border-2 mb-4 p-1 w-full rounded-md"
              {...register("name", { required: true })}
            />

            <MultipleSelector
              className="border border-2  p-2 w-full rounded-md"
              defaultOptions={OPTIONS.map((opt) => ({
                ...opt,
                value: String(opt.value),
              }))}
              placeholder="Add Parent Category"
              emptyIndicator={<p className="">no results found.</p>}
              onChange={(selected: any) => {
                setValue("repos", selected[0].value);
              }}
            />
            <DialogClose asChild>
              <Button
               
                className="border border-2 mt-4 p-1 w-full rounded-md"
                type="submit"
                variant="outline"
              >
                Save
              </Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

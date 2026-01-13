"use client";
//TOP LEVEL
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//MID LEVEL
import RepoManager from "@/lib/repoManager";

//UI LEVEL
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  categories: z.array(z.string()),
});

export default function RepoCheckBox({ repoId }: { repoId: string }) {
  const [repoManager] = useState(() => new RepoManager());
  const [cats, setCats] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState<string[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories: [],
    },
  });

  useEffect(() => {
    (async function () {
      setIsChecked(await repoManager.getCategoriesByRepo(repoId.toString()));
      setCats(await repoManager.getAllCategories());
    })();
  }, []);

  function onSubmit(local: z.infer<typeof FormSchema>) {
    local.categories.forEach((categoryName) => {
      console.log(categoryName);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              {cats.map((cat: any) => (
                <FormItem
                  key={cat.id}
                  className="flex flex-row p-1 items-start"
                >
                  <FormControl>
                    <Checkbox
                      checked={isChecked.some(
                        (user: any) => user.id === cat.id
                      )}
                      onCheckedChange={async (checked) => {
                        if (!checked) {
                          await repoManager.ModifyRepoCategory(
                            repoId,
                            cat.id,
                            false
                          );
                          setIsChecked((prev) =>
                            prev.filter((user: any) => user.id !== cat.id)
                          );
                        } else {
                          await repoManager.ModifyRepoCategory(
                            repoId,
                            cat.id,
                            true
                          );
                          setIsChecked((prevUsers) => [...prevUsers, cat]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    {cat.name}
                  </FormLabel>
                </FormItem>
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

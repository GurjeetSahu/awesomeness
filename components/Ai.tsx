import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function Ai() {
  const [text, setText] = useState("Work in Progress...");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setText("Processing...");
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3-0324",
          messages: [
            {
              role: "user",
              content: "Say only Hi nothing else",
            },
          ],
        }),
      }
    );
    const data = await response.json();
    setLoading(false);
    return data;
  }
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Ai ✨</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Auto-Categorise in one click.</DialogTitle>
            <DialogDescription>{text}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled
              onClick={async () => {
                await handleSubmit().then((res: any) => {
                  setText(res.choices[0].message.content);
                });
              }}
              type="submit"
            >
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

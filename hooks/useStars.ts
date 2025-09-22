import { useQuery } from "@tanstack/react-query";

export default function useStars() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["all-stars"],
    queryFn: async () => {
      console.log("Fetching from github")
      const res = await fetch("/api/github")
      if (!res.ok) throw new Error("Failed to fetch")
      const dataArray = new Map(await res.json())
      return dataArray
    },
  })
  return { allStars: data, isError, isLoading }
}

import { useQuery } from "@tanstack/react-query";

export default function useStars() {

  const { data, isError, isLoading } = useQuery({
    queryKey: ["all-stars"],
    queryFn: async () => {
      console.log("Fetching from github")
      const retrievedString = localStorage.getItem('cursor');

      if (!retrievedString) {
        console.log("No cursor found, fetching first page")
        const res = await fetch("/api/github")
        if (!res.ok) throw new Error("Failed to fetch")

        const { stars, cursor } = await res.json();
        const dataArray = new Map(stars);

        // Optionally store the new cursor
        if (cursor) {
          localStorage.setItem('cursor', cursor);
        }

        return dataArray;
      }
      else {
        console.log("Cursor found, fetching next page")
        const params = new URLSearchParams({ cursor: retrievedString! });
        const res = await fetch(`/api/github?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to fetch")

        const { stars, cursor } = await res.json();
        const dataArray = new Map(stars);

     
        // Optionally store the new cursor
        if (cursor) {
          localStorage.setItem('cursor', cursor);
        }

        return dataArray;
      }
    },
  })
  return { allStars: data, isError, isLoading }
}

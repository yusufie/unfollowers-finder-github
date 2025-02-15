"use client"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import CardDemo from "@/components/Cards/UserCard";
import SkeletonDemo from "@/components/Loading/Skeleton";
import { Button } from "@/components/ui/button"
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export default function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  })

  const [loading, setLoading] = React.useState(false);
  const [unfollowers, setUnfollowers] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  // Function to fetch data from GitHub API
  const fetchGitHubData = async (url: string) => {
    const response = await fetch(url);
    if (!response?.ok) {
      throw new Error(`GitHub API request failed: ${response?.statusText}`);
    }
    return response.json();
  };

  // Function to fetch all pages for a paginated API
  const fetchAllPages = async (url: string) => {
    let allData: any[] = [];
    let page = 1;

    while (true) {
      const data = await fetchGitHubData(`${url}&page=${page}`);
      if (data?.length === 0) {
        break;
      }
      allData = allData?.concat(data);
      page++;
    }

    return allData;
  };

  // Function to handle form submission
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setError(null);
    setLoading(true);
    setUnfollowers([]);
    
    try {
      // Remove @ symbol if present
      const cleanUsername = data?.username?.replace('@', '');

      // Fetch both following and followers data
      const [following, followers] = await Promise.all([
        fetchAllPages(`https://api.github.com/users/${cleanUsername}/following?per_page=100`),
        fetchAllPages(`https://api.github.com/users/${cleanUsername}/followers?per_page=100`)
      ]);

      // Identify users who are not following back
      const notFollowing = following?.filter((follow) => 
        !followers?.some((follower) => follower?.login === follow?.login)
      );

      setUnfollowers(notFollowing);
    } catch (err) {
      setError('Failed to fetch GitHub data. Please check the username and try again.');
      setUnfollowers([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row items-center justify-center w-full max-w-[50rem] max-lg:w-[25rem] gap-16 max-lg:gap-4 text-base">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter GitHub username (without @)" 
                    {...field} 
                    className="text-base"
                    onChange={(e) => field?.onChange(e.target.value.replace('@', ''))}
                  />
                </FormControl>
                <FormDescription>
                  Find out who unfollowed you on GitHub
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="ml-auto text-base" disabled={loading}>
            {loading ? <span>Loading...</span> : <span>Find Unfollowers</span>}
          </Button>
        </form>
      </Form>

      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          <SkeletonDemo />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pb-20 max-lg:grid-cols-1">
          {unfollowers?.length > 0 && (
            unfollowers?.map((unfollower) => (
              <CardDemo key={unfollower?.id} unfollower={unfollower} />
            ))
          )}
        </div>
      )}
      
      {!loading && !error && unfollowers?.length === 0 && (
        <p className="text-2xl font-bold text-primary">No unfollowers found</p>
      )}
    </>
  )
}
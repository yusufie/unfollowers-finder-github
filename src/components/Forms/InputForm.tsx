"use client"
import * as React from "react"
import useSWR from 'swr';
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

const fetcher = async (url: any) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('API request failed');
  }
  return response.json();
};

export default function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  })

  // Remove @ symbol if present in username
  const sanitizedUsername = form.watch('username')?.replace('@', '');

  // SWR Hooks for Following and Followers with error handling
  const { data: followingData, error: followingError } = useSWR(
    sanitizedUsername ? `https://api.github.com/users/${sanitizedUsername}/following?per_page=100` : null,
    fetcher
  );

  const { data: followersData, error: followersError } = useSWR(
    sanitizedUsername ? `https://api.github.com/users/${sanitizedUsername}/followers?per_page=100` : null,
    fetcher
  );

  // loading state while the API request is in progress
  const [loading, setLoading] = React.useState(false);
  // State to store unfollowers
  const [unfollowers, setUnfollowers] = React.useState<any[]>([]);
  // State to store error message
  const [error, setError] = React.useState<string | null>(null);

  // Function to handle form submission
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setError(null);
    setLoading(true);
    
    try {
      // Remove @ symbol if present
      const cleanUsername = data?.username?.replace('@', '');

      // Access followingData and followersData here
      if (followingData && followersData) {
        // Fetch all pages for followings and followers
        const allFollowings = await fetchAllPages(`https://api.github.com/users/${cleanUsername}/following?per_page=100`);
        const allFollowers = await fetchAllPages(`https://api.github.com/users/${cleanUsername}/followers?per_page=100`);

        // Identify users who are not following back
        const notFollowing = allFollowings?.filter((follow: any) => (
          !allFollowers?.some((follower:any) => follower?.login === follow?.login)
        ));

        // Update state to store unfollowers
        setUnfollowers(notFollowing);
      }
    } catch (err) {
      setError('Failed to fetch GitHub data. Please check the username and try again.');
      setUnfollowers([]);
    } finally {
      setLoading(false);
    }
  }

  // Function to fetch all pages for a paginated API
  const fetchAllPages = async (url: string) => {
    let allData: any = [];
    let page = 1;

    while (true) {
      const response = await fetch(`${url}&page=${page}`);
      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response?.statusText}`);
      }
      const data = await response?.json();

      if (data.length === 0) {
        break;
      }

      allData = allData?.concat(data);
      page++;
    }

    return allData;
  };

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
                    onChange={(e) => field.onChange(e.target.value.replace('@', ''))}
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
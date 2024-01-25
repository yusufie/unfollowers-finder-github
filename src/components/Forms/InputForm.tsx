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
  return response.json();
};

export default function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  })

  // SWR Hooks for Following and Followers
  const { data: followingData } = useSWR(
    form.watch('username') ? `https://api.github.com/users/${form.watch('username')}/following?per_page=100` : null,
    fetcher
  );

  const { data: followersData } = useSWR(
    form.watch('username') ? `https://api.github.com/users/${form.watch('username')}/followers?per_page=100` : null,
    fetcher
  );

    // loading state while the API request is in progress
    const [loading, setLoading] = React.useState(false);
    // State to store unfollowers
    const [unfollowers, setUnfollowers] = React.useState<any[]>([]);

  // Function to handle form submission
  async function onSubmit(data: z.infer<typeof FormSchema>) {

    // Set loading to true while fetching data
    setLoading(true);

    // Access followingData and followersData here
    if (followingData && followersData) {
      // Fetch all pages for followings and followers
      const allFollowings = await fetchAllPages(`https://api.github.com/users/${data.username}/following?per_page=100`);
      const allFollowers = await fetchAllPages(`https://api.github.com/users/${data.username}/followers?per_page=100`);

      // Identify users who are not following back
      const notFollowing = allFollowings.filter((follow: any) => (
        !allFollowers.some((follower:any) => follower.login === follow.login)
      ));

      // Update state to store unfollowers
      setUnfollowers(notFollowing);
    }

    // Set loading back to false after fetching data
    setLoading(false);
  }

  // Function to fetch all pages for a paginated API
  const fetchAllPages = async (url: any) => {
    let allData: any = [];
    let page = 1;

    while (true) {
      const response = await fetch(`${url}&page=${page}`);
      const data = await response.json();

      if (data.length === 0) {
        break;
      }

      allData = allData.concat(data);
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
                placeholder="Enter your GitHub username" {...field} 
                className="text-base"
                />
              </FormControl>
              <FormDescription>
                Find out who unfollowed you on GitHub
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="ml-auto text-base" >
          {loading && ( 
            <span> loading... </span>
          ) || (
            <span> Find Unfollowers </span>
          )}
        </Button>
      </form>
    </Form>

    {loading ? (
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1 " >
          <SkeletonDemo />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pb-20 max-lg:grid-cols-1" >
          {unfollowers.length > 0 && (
      
              unfollowers.map((unfollower) => (
                <CardDemo key={unfollower.id} unfollower={unfollower} />
              ))
          )}
        </div>
      )}
      {unfollowers.length === 0 && (
        <p className="text-2xl font-bold text-primary ">No unfollowers found</p>
      )}
    </>
  )
}
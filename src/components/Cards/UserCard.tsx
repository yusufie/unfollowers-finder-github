import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

type UnfollowerType = {
  avatar_url: string;
  html_url: string;
  login: string;
};

type CardProps = React.ComponentProps<typeof Card> & {
  unfollower: UnfollowerType;
}

export default function CardDemo({ className, unfollower, ...props }: CardProps) {
  return (
    <Link href={`${unfollower?.html_url}`} target="_blank">
    <Card 
      className={cn("flex flex-row items-center w-96 gap-8 p-4", className)} {...props}
      >
          <Image
            src={unfollower?.avatar_url}
            alt={unfollower?.login} width={48} height={48}
            className="rounded-full"
           />
          
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
            {unfollower?.login}
            </p>
            <p className="text-sm text-muted-foreground">
              {unfollower?.html_url}
            </p>
          </div>

    </Card>
    </Link>
  )
}

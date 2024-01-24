import { BellIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

type CardProps = React.ComponentProps<typeof Card>

export default function CardDemo({ className, ...props }: CardProps) {
  return (
    <Card className={cn("w-1/2 flex flex-row items-center gap-8 p-4", className)} {...props}>

          <BellIcon />
          
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>

    </Card>
  )
}
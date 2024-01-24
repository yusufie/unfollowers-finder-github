import { ModeToggle } from "@/components/ui/theme-toggle";
import { Card, CardHeader, CardTitle, } from "@/components/ui/card"

const Footer: React.FC = () => {
  return (
    <Card className=" fixed bottom-8 flex flex-row justify-center items-center gap-4 w-1/2 h-12" >

      <CardHeader>
        <CardTitle>Star GitHub Repository </CardTitle>
      </CardHeader>

      <ModeToggle />
    </Card>
  )
}

export default Footer
import { ModeToggle } from "@/components/ui/theme-toggle";
import { Card, CardHeader, CardTitle, } from "@/components/ui/card"

const Navbar: React.FC = () => {
  return (
    <Card className="relative flex flex-row justify-center items-center gap-4 w-[50rem] h-12 max-lg:w-[25rem] " >

      <CardHeader>
        <CardTitle>GitHub Unfollowers Finder</CardTitle>
      </CardHeader>

      <ModeToggle />
    </Card>
  )
}

export default Navbar
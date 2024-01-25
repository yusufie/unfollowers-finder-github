import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { Card, CardHeader, CardTitle, } from "@/components/ui/card"

const Footer: React.FC = () => {
  return (
    <Card className=" fixed bottom-4 flex flex-row justify-center items-center w-[50rem] h-12 max-lg:w-[25rem]" >

      <Image src={"/icons/star-filled.svg"} width={24} height={24} alt="star" />

      <Link href={"https://github.com/yusufie/unfollowers-finder-github"} >
        <CardHeader>
          <CardTitle>Star GitHub Repository </CardTitle>
        </CardHeader>
      </Link>
        <ModeToggle />
      </Card>
  )
}

export default Footer
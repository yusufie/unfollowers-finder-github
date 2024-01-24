import { ModeToggle } from "@/components/ui/theme-toggle";

const Navbar: React.FC = () => {
  return (
    <nav className="flex flex-row justify-center items-center gap-4 w-full h-12 bg-muted" >
      <h1>GitHub Unfollowers Finder </h1>
      <ModeToggle />
    </nav>
  )
}

export default Navbar
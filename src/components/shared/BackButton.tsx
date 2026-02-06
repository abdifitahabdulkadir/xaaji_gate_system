import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "../ui/button";

interface Props {
  to: string;
}
export default function BackButton({ to }: Props) {
  return (
    <Link to={to} className={cn(buttonVariants(), "cursor-pointer")}>
      <ArrowLeft />
      Go Back
    </Link>
  );
}

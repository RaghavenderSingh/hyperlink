import { signInAction } from "@/lib/signInAction";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa6";

export default function SignIn() {
  return (
    <form action={signInAction}>
      <Button type="submit">
        <span className="flex items-center gap-2">
          Login
          <FaGoogle />
        </span>
      </Button>
    </form>
  );
}

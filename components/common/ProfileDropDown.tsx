import UserImage from "@/components/Appbar/UserImage";
import { UserRound } from "lucide-react";
import ClientProfileDropDown from "./ClientProfileDropDown";

export interface User {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

const ProfileDropDown = ({ name, email, image }: User) => {
  return (
    <ClientProfileDropDown
      triggerContent={
        !image ? (
          <div className="p-1 border-2 rounded-md">
            <UserRound />
          </div>
        ) : (
          <UserImage image={image} />
        )
      }
      userName={name}
      userEmail={email}
      userImage={image}
    />
  );
};

export default ProfileDropDown;

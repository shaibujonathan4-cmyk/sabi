import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="p-6 pb-24 flex justify-center">
      <UserProfile />
    </div>
  );
}
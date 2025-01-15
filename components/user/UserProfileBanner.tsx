import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Shield, User } from "lucide-react";
import { useGetAllUserProfileQuery } from "@/redux/api/userApi";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type UserProfile = {
  username: string;
  email: string;
  profileImage: string;
  roles: string[] | null;
};

const UserProfileBanner = ({ name }: { name: string }) => {
  // Fetch user profile data
  const { data: userProfile, isLoading, isError } = useGetAllUserProfileQuery();

  // State for dialog open/close
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      </div>
    );
  }

  if (isError || !userProfile) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load user profile.
      </div>
    );
  }

  // Find the specific user by username
  const user = userProfile.find((user: UserProfile) => user.username === name);

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">User not found</div>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 border border-purple-500/50 backdrop-blur-md rounded-xl shadow-lg mb-6 my-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-2xl font-bold font-mono">
          User Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-6">
        {/* Avatar with glowing effect and click-to-view functionality */}
        <div className="relative">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg shadow-purple-500/20 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src={user.profileImage} alt={user.username} />
                <AvatarFallback className="bg-purple-900 text-purple-400">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
            </DialogTrigger>

            {/* Dialog to display the full-size image */}
            <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
              <div className="flex items-center justify-center p-4">
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-full h-full max-w-[500px] max-h-[500px] object-contain rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Glowing effect */}
          <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-md animate-pulse" />
        </div>

        {/* User details */}
        <div className="space-y-2">
          {/* Username */}
          <div className="pb-2 border-b border-purple-500/30 flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-100" />
            <h2 className="text-2xl font-bold text-white bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              {user.username}
            </h2>
          </div>

          {/* Email */}
          <div className="pb-2 border-b border-purple-500/30 flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-100" />
            <p className="text-sm text-white">{user.email}</p>
          </div>

          {/* Role */}
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gray-100" />
            <p className="text-sm text-white">
              Role: {user.roles?.join(", ") || "No roles assigned"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileBanner;
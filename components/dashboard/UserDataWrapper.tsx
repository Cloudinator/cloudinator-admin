"use client";

import { useGetMeQuery } from "@/redux/api/userApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../Loading";
import { Loader2 } from "lucide-react";

export default function UserDataWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = useGetMeQuery();
  const router = useRouter();

  // Redirect logic for expired token
  useEffect(() => {
    if (!isLoading && isError) {
      // Assuming isError indicates an expired token
      router.push("/expired-token");
    }
  }, [data, isLoading, isError, router]);

  // Show a loading state while fetching user data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <Loading />
        </div>
      </div>
    );
  }

  // Render children if user data is available
  return <>{children}</>;
}

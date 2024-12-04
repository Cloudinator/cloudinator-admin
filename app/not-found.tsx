import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function PageNotFound() {
  return (
    <main className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
      <section className="text-center">
        <Image
          src="/logo/cloudinator.png"
          alt="Cloudinator Logo"
          width={400}
          height={400}
          className=""
        />
        <h1 className="text-primary text-[60px] font-semibold mb-4">404</h1>
        <p className="text-gray-700 text-lg">
          The requested URL was not found on this server.
        </p>
      </section>
      <Link href="/dashboard">
        <p className="mt-6 text-white bg-primary py-2 px-6 rounded-lg hover:bg-primary-dark transition duration-200">
          Go to dashboard
        </p>
      </Link>
    </main>
  );
}

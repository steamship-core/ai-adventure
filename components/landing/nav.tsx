"use client";
import { useUser } from "@clerk/nextjs";
import { MoveRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const Nav = () => {
  const { user } = useUser();
  return (
    <nav className="w-full flex justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-6">
        <Button variant="link" asChild>
          <Link href="/">
            <Image
              src="/android-chrome-512x512.png"
              width={42}
              height={42}
              alt="Steamship Logo"
            />
          </Link>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="link" asChild>
          <Link href="https://steamship.com/discord">Join our Discord</Link>
        </Button>
        <Button variant={user ? "outline" : "link"}>
          <Link href={user ? "/adventures" : "/sign-in"} className="flex">
            {user ? (
              "Adventures"
            ) : (
              <>
                Login <MoveRightIcon size={20} className="ml-2" />
              </>
            )}
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Nav;

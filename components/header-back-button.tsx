"use client";

import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const HeaderBackButton = () => {
  const pathname = usePathname();
  const params = useParams();
  let href = "/adventures";

  if (pathname.indexOf("/quest") !== -1) {
    href = `/play/${params.handle}/camp`;
  }

  return (
    <Link href={href}>
      <MoveLeft size={24} />
    </Link>
  );
};

export default HeaderBackButton;

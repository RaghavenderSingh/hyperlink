import React from "react";
import Link from "next/link";
import Image from "next/image";
interface LogoProps {
  className?: string;
  fill?: string;
}

const Logo: React.FC<LogoProps> = ({ className, fill }) => (
  <Link href="/">
    <Image src="/icons/logo.png" alt="logo" width={40} height={40} />
  </Link>
);

export default Logo;

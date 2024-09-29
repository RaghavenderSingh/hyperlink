import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
}

const LogoLight: React.FC<LogoProps> = () => (
  <Link href="/">
    <Image src="/icons/logo.png" alt="logo" width={40} height={40} />
  </Link>
);

export default LogoLight;

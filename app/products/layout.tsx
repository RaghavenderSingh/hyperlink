import Appbar from "@/components/Appbar/Appbar";
import "../globals.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Appbar />
        {children}
      </body>
    </html>
  );
}

// components/ProtectedRoute.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { status } = useSession(); // Ambil status sesi
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Jika tidak terautentikasi, arahkan ke halaman login
      router.push("/login");
    }
  }, [status, router]);

  // Sementara tidak merender apa pun sampai status sesi diketahui
  if (status === "loading") return null;

  return <>{children}</>; // Jika terautentikasi, tampilkan anak komponen
};

export default ProtectedRoute;

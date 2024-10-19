"use client";

import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";

interface FormData {
  username?: string;
  email: string;
  password: string;
  error: string;
}

const AuthForm = ({ type }: { type: "register" | "login" }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues:
      type === "register"
        ? { username: "", email: "", password: "" }
        : { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    let res;

    if (type === "register") {
      try {
        res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          toast.success("Registrasi berhasil! Silakan login.");
          router.push("/login");
        } else {
          toast.error("Terjadi kesalahan saat registrasi.");
        }
      } catch (err) {
        toast.error("Terjadi kesalahan jaringan.");
      }
    }

    if (type === "login") {
      try {
        res = await signIn("credentials", {
          ...data,
          redirect: false,
        });

        if (res && res.ok) {
          toast.success("Login berhasil!");
          router.push("/");
        } else {
          toast.error("Email atau password salah.");
        }
      } catch (err) {
        toast.error("Terjadi kesalahan saat login.");
      }
    }
    setLoading(false);
  };

  // save to token to local storage namanya guest
  const saveTokenGuest = (token: string) => {
    localStorage.setItem("token", token);
    router.push("/");
  };

  return (
    <div className="auth">
      <div className="overlay">
        <div className="content">
          <img src="/assets/logo.png" alt="logo" className="logo" />

          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            {type === "register" && (
              <>
                <div className="input">
                  <input
                    {...register("username", {
                      required: "Username wajib diisi",
                      validate: (value: string | undefined) => {
                        if (!value || value.length < 2) {
                          return "Username harus lebih dari 1 karakter";
                        }
                        return true;
                      },
                    })}
                    type="text"
                    placeholder="Username"
                    className="input-field"
                  />
                  <PersonOutline sx={{ color: "white" }} />
                </div>
                {errors.username && (
                  <p className="error">{errors.username.message}</p>
                )}
              </>
            )}

            <div className="input">
              <input
                {...register("email", {
                  required: "Email wajib diisi",
                })}
                type="email"
                placeholder="Email"
                className="input-field"
              />
              <EmailOutlined sx={{ color: "white" }} />
            </div>
            {errors.email && <p className="error">{errors.email.message}</p>}

            <div className="input">
              <input
                {...register("password", {
                  required: "Password wajib diisi",
                })}
                type="password"
                placeholder="Password"
                className="input-field"
              />
              <LockOutlined sx={{ color: "white" }} />
            </div>
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}

            <button className="button" type="submit" disabled={loading}>
              {loading
                ? "Tunggu..."
                : type === "register"
                ? "Daftar Gratis"
                : "Masuk"}
            </button>
          </form>

          {type === "register" ? (
            <Link href="/login">
              <p className="link">Sudah punya akun? Masuk di sini</p>
            </Link>
          ) : (
            <Link href="/register">
              <p className="link">Belum punya akun? Daftar di sini</p>
            </Link>
          )}
          <Link
            href="/"
            onClick={() => {
              saveTokenGuest("guest");
            }}
          >
            <p className="link">Lanjutkan Sebagai Tamu </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

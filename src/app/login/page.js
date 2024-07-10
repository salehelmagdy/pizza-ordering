"use client";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoadingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);
  async function handleFormSubmit(e) {
    e.preventDefault();
    setLoginInProgress(true);
    setError(false);
    setUserCreated(false);

    await signIn("credentials", { email, password, callbackUrl: "/" });
    const response = await fetch("/api/login", {
      method: "GET",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);
    response.ok ? setUserCreated(true) : setError(true);
    setLoginInProgress(false);
  }
  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">Login</h1>
      <form onSubmit={handleFormSubmit} className="max-w-xs mx-auto">
        <input
          type="email"
          placeholder="email"
          value={email}
          disabled={loginInProgress}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          disabled={loginInProgress}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loginInProgress}>
          Login
        </button>
        <div className="my-4 text-center text-gray-500 ">
          Or Login With Provider
        </div>
        <button
          className="flex gap-4 justify-center items-center "
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Image src={"/google.png"} width={24} height={24} />
          Login With Google
        </button>
      </form>
    </section>
  );
}

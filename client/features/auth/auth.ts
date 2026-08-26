import { authClient } from "@/lib/auth-client";
import { SignIn, SignUp } from "./types";

export async function signIn(data: SignIn) {
  return authClient.signIn.email({
    email: data.email,
    password: data.password,
    callbackURL: "/dashboard",
  });
}

export async function signUp(data: SignUp) {
  return authClient.signUp.email({
    name: data.name,
    email: data.email,
    password: data.password,
    callbackURL: "/dashboard",
  });
}

export async function signOut() {
  return authClient.signOut();
}

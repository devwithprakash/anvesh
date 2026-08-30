import { authClient } from "@/lib/auth-client";
import { SignIn, SignUp } from "./types";

export async function forgotPassword(email: string) {
  return authClient.requestPasswordReset({
    email,
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });
}

export async function resetPassword(newPassword: string, token: string) {
  return authClient.resetPassword({
    newPassword,
    token,
  });
}

export async function sendVerificationEmail(email: string) {
  return authClient.sendVerificationEmail({
    email,
    callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });
}

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

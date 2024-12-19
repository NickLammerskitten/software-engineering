"use server"

import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login");
  }

  return redirect("/gallery");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};

export const getGalleryAction = async (page: number | undefined = 0, pageSize: number | undefined = 10) => {
  const response = await fetch("http://localhost:3000/api/image", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  const json = await response.json();

  if (!response.ok) {
    return json["message"];
  }

  return json["data"];
};

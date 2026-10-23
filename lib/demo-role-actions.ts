"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEMO_ROLE_COOKIE, type ViewerRole } from "@/lib/demo-role";

export async function setDemoViewerRole(role: ViewerRole) {
  const store = await cookies();
  store.set(DEMO_ROLE_COOKIE, role, { path: "/" });
  redirect("/events");
}

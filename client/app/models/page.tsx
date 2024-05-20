import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase";
import Models from "./Models";

export default async function ModelPage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/contact");
  }

  return <Models />;
}

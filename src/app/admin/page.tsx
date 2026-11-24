import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { RegistrationRecord } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let registrations: RegistrationRecord[] = [];
  let userEmail = "";
  let loadError: string | null = null;

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }

    userEmail = user.email ?? "Panitia BDCA";

    const { data, error } = await supabase
      .from("registrations")
      .select(
        "id, created_at, full_name, nim, major, semester, whatsapp, division, reason, experience, organization"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed loading registrations in /admin:", error.message);
      loadError =
        "Gagal memuat data pendaftar dari database. Pastikan kebijakan RLS untuk akun panitia sudah aktif.";
    } else {
      registrations = (data ?? []) as RegistrationRecord[];
    }
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Unexpected error in /admin:", error);
    loadError = "Konfigurasi layanan autentikasi atau database belum lengkap.";
  }

  return (
    <AdminDashboardClient
      registrations={registrations}
      userEmail={userEmail}
      loadError={loadError}
    />
  );
}

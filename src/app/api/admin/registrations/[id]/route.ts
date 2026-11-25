import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { registrationSchema } from "@/lib/validation";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function jsonResponse(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

async function requireAuthenticatedAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await requireAuthenticatedAdmin();
  if (!user) {
    return jsonResponse({ error: "Akses ditolak. Silakan login terlebih dahulu." }, 401);
  }

  const { id } = await context.params;
  if (!UUID_REGEX.test(id)) {
    return jsonResponse({ error: "ID pendaftar tidak valid." }, 400);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Format data tidak valid." }, 400);
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstMessage =
      Object.values(fieldErrors).flat()[0] ??
      "Mohon periksa kembali data yang diubah.";
    return jsonResponse({ error: firstMessage, fieldErrors }, 400);
  }

  const payload = parsed.data;

  try {
    const adminSupabase = createAdminSupabaseClient();

    const [nimConflict, nameConflict] = await Promise.all([
      adminSupabase
        .from("registrations")
        .select("id")
        .eq("nim", payload.nim)
        .neq("id", id)
        .maybeSingle(),
      adminSupabase
        .from("registrations")
        .select("id")
        .ilike("full_name", escapeLikePattern(payload.full_name))
        .neq("id", id)
        .limit(1)
        .maybeSingle(),
    ]);

    if (nimConflict.error || nameConflict.error) {
      console.error(
        "Admin update conflict check failed:",
        nimConflict.error?.message ?? nameConflict.error?.message
      );
      return jsonResponse({ error: "Gagal memeriksa duplikasi data." }, 500);
    }

    if (nimConflict.data) {
      return jsonResponse(
        { error: "NIM tersebut sudah digunakan oleh pendaftar lain." },
        409
      );
    }

    if (nameConflict.data) {
      return jsonResponse(
        { error: "Nama lengkap tersebut sudah digunakan oleh pendaftar lain." },
        409
      );
    }

    const { data: updated, error: updateError } = await adminSupabase
      .from("registrations")
      .update({
        full_name: payload.full_name,
        nim: payload.nim,
        major: payload.major,
        semester: payload.semester,
        whatsapp: payload.whatsapp,
        division: payload.division,
        reason: payload.reason,
        experience: payload.experience,
        organization: payload.organization,
      })
      .eq("id", id)
      .select(
        "id, created_at, full_name, nim, major, semester, whatsapp, division, reason, experience, organization"
      )
      .maybeSingle();

    if (updateError) {
      if (updateError.code === "23505") {
        return jsonResponse(
          { error: "NIM tersebut sudah digunakan oleh pendaftar lain." },
          409
        );
      }
      console.error("Failed updating registration:", updateError.message);
      return jsonResponse({ error: "Gagal menyimpan perubahan data." }, 500);
    }

    if (!updated) {
      return jsonResponse({ error: "Data pendaftar tidak ditemukan." }, 404);
    }

    return jsonResponse(
      { message: "Data pendaftar berhasil diperbarui.", data: updated },
      200
    );
  } catch (error) {
    console.error("Unexpected error in PATCH /api/admin/registrations/[id]:", error);
    return jsonResponse({ error: "Terjadi gangguan server saat menyimpan data." }, 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await requireAuthenticatedAdmin();
  if (!user) {
    return jsonResponse({ error: "Akses ditolak. Silakan login terlebih dahulu." }, 401);
  }

  const { id } = await context.params;
  if (!UUID_REGEX.test(id)) {
    return jsonResponse({ error: "ID pendaftar tidak valid." }, 400);
  }

  try {
    const adminSupabase = createAdminSupabaseClient();
    const { data: deleted, error: deleteError } = await adminSupabase
      .from("registrations")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (deleteError) {
      console.error("Failed deleting registration:", deleteError.message);
      return jsonResponse({ error: "Gagal menghapus data pendaftar." }, 500);
    }

    if (!deleted) {
      return jsonResponse({ error: "Data pendaftar tidak ditemukan." }, 404);
    }

    return jsonResponse({ message: "Data pendaftar berhasil dihapus.", id }, 200);
  } catch (error) {
    console.error("Unexpected error in DELETE /api/admin/registrations/[id]:", error);
    return jsonResponse({ error: "Terjadi gangguan server saat menghapus data." }, 500);
  }
}

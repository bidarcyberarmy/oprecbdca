import { NextResponse } from "next/server";
import { isRegistrationOpen, oprecConfig } from "@/config/oprec.config";
import {
  checkRegistrationRateLimit,
  extractClientIp,
} from "@/lib/rate-limit";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { registrationSchema } from "@/lib/validation";

const DUPLICATE_NIM_MESSAGE =
  "NIM ini sudah terdaftar sebelumnya. Hubungi panitia via WhatsApp (0822-7833-0156) jika terjadi kesalahan input.";
const DUPLICATE_NAME_MESSAGE =
  "Nama lengkap ini sudah terdaftar sebelumnya. Hubungi panitia via WhatsApp (0822-7833-0156) jika terjadi kesalahan input atau kesamaan nama.";
const MAX_BODY_BYTES = 16 * 1024; // 16 KB

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

function jsonResponse(body: Record<string, unknown>, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      ...headers,
    },
  });
}

export async function POST(request: Request) {
  if (!isRegistrationOpen()) {
    return jsonResponse({ error: oprecConfig.closedMessage }, 403);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonResponse(
      { error: "Tipe konten harus application/json." },
      415
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonResponse(
      { error: "Ukuran data pendaftaran terlalu besar." },
      413
    );
  }

  const clientIp = extractClientIp(request);
  const rateLimit = checkRegistrationRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return jsonResponse(
      {
        error:
          "Terlalu banyak percobaan pendaftaran dari jaringan ini. Silakan tunggu beberapa menit lalu coba lagi.",
      },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) }
    );
  }

  let rawText: string;
  try {
    rawText = await request.text();
  } catch {
    return jsonResponse(
      { error: "Gagal membaca data pendaftaran." },
      400
    );
  }

  if (rawText.length > MAX_BODY_BYTES) {
    return jsonResponse(
      { error: "Ukuran data pendaftaran terlalu besar." },
      413
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawText);
  } catch {
    return jsonResponse(
      { error: "Format data pendaftaran tidak valid." },
      400
    );
  }

  // Honeypot anti-bot field: real users never fill hidden "website" input
  if (
    body &&
    typeof body === "object" &&
    "website" in body &&
    typeof (body as { website?: unknown }).website === "string" &&
    (body as { website: string }).website.trim().length > 0
  ) {
    return jsonResponse({ error: "Permintaan tidak dapat diproses." }, 400);
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstMessage =
      Object.values(fieldErrors).flat()[0] ??
      "Mohon periksa kembali isian formulir pendaftaran.";

    return jsonResponse(
      {
        error: firstMessage,
        fieldErrors,
      },
      400
    );
  }

  const payload = parsed.data;

  try {
    const supabase = createAdminSupabaseClient();

    const [nimLookup, nameLookup] = await Promise.all([
      supabase
        .from("registrations")
        .select("id")
        .eq("nim", payload.nim)
        .maybeSingle(),
      supabase
        .from("registrations")
        .select("id")
        .ilike("full_name", escapeLikePattern(payload.full_name))
        .limit(1)
        .maybeSingle(),
    ]);

    if (nimLookup.error) {
      console.error("Failed checking existing NIM:", nimLookup.error.message);
      return jsonResponse(
        {
          error:
            "Terjadi kendala saat memeriksa data pendaftaran. Coba lagi sesaat lagi.",
        },
        500
      );
    }

    if (nimLookup.data) {
      return jsonResponse({ error: DUPLICATE_NIM_MESSAGE }, 409);
    }

    if (nameLookup.error) {
      console.error("Failed checking existing name:", nameLookup.error.message);
      return jsonResponse(
        {
          error:
            "Terjadi kendala saat memeriksa data pendaftaran. Coba lagi sesaat lagi.",
        },
        500
      );
    }

    if (nameLookup.data) {
      return jsonResponse({ error: DUPLICATE_NAME_MESSAGE }, 409);
    }

    const { data: inserted, error: insertError } = await supabase
      .from("registrations")
      .insert({
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
      .select("id, created_at, full_name, nim, major, semester, whatsapp, division")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return jsonResponse({ error: DUPLICATE_NIM_MESSAGE }, 409);
      }

      console.error("Failed inserting registration:", insertError.message);
      return jsonResponse(
        { error: "Gagal menyimpan data pendaftaran. Silakan coba lagi." },
        500
      );
    }

    return jsonResponse(
      {
        message: "Pendaftaran berhasil disimpan.",
        data: inserted,
      },
      201
    );
  } catch (error) {
    console.error("Unexpected error in POST /api/register:", error);
    return jsonResponse(
      {
        error:
          "Layanan pendaftaran sedang mengalami gangguan konfigurasi server. Hubungi panitia BDCA.",
      },
      500
    );
  }
}

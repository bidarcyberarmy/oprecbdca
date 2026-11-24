import { z } from "zod";
import { SEMESTER_OPTIONS, oprecConfig } from "@/config/oprec.config";

const validDivisionNames = new Set(oprecConfig.divisions.map((division) => division.name));
const validSemesters = new Set<string>(SEMESTER_OPTIONS);

export function normalizeNim(rawNim: string): string {
  return rawNim.replace(/\s+/g, "").trim();
}

export function normalizeIndonesianWhatsapp(rawPhone: string): string {
  const cleaned = rawPhone.replace(/[\s\-().]/g, "").trim();

  if (cleaned.startsWith("+62")) {
    return `62${cleaned.slice(3)}`;
  }
  if (cleaned.startsWith("62")) {
    return cleaned;
  }
  if (cleaned.startsWith("0")) {
    return `62${cleaned.slice(1)}`;
  }

  return cleaned;
}

export function normalizeOptionalText(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export const registrationSchema = z.object({
  full_name: z
    .string()
    .transform((val) => val.replace(/\s+/g, " ").trim())
    .pipe(
      z
        .string()
        .min(3, "Nama lengkap minimal 3 karakter.")
        .max(120, "Nama lengkap maksimal 120 karakter.")
    ),
  nim: z
    .string()
    .transform(normalizeNim)
    .pipe(
      z
        .string()
        .regex(/^\d{8,12}$/, "NIM harus berupa angka 8 sampai 12 digit.")
    ),
  major: z
    .string()
    .transform((val) => val.replace(/\s+/g, " ").trim())
    .pipe(
      z
        .string()
        .min(2, "Jurusan / Program Studi wajib diisi.")
        .max(100, "Jurusan / Program Studi maksimal 100 karakter.")
    ),
  semester: z
    .string()
    .trim()
    .refine(
      (val) => validSemesters.has(val),
      "Pilih semester Anda saat ini."
    ),
  whatsapp: z
    .string()
    .transform(normalizeIndonesianWhatsapp)
    .pipe(
      z
        .string()
        .regex(
          /^628\d{7,12}$/,
          "Nomor WhatsApp harus berupa nomor HP Indonesia yang valid (contoh: 081234567890)."
        )
    ),
  division: z
    .string()
    .trim()
    .refine(
      (val) => validDivisionNames.has(val),
      "Pilih salah satu divisi yang tersedia."
    ),
  reason: z
    .string()
    .transform((val) => val.replace(/\s+/g, " ").trim())
    .pipe(
      z
        .string()
        .min(10, "Alasan bergabung minimal 10 karakter.")
        .max(500, "Alasan bergabung maksimal 500 karakter.")
    ),
  experience: z
    .string()
    .max(2000, "Pengalaman maksimal 2000 karakter.")
    .optional()
    .nullable()
    .transform(normalizeOptionalText),
  organization: z
    .string()
    .max(2000, "Riwayat organisasi maksimal 2000 karakter.")
    .optional()
    .nullable()
    .transform(normalizeOptionalText),
});

export type RegistrationInput = z.input<typeof registrationSchema>;
export type NormalizedRegistration = z.output<typeof registrationSchema>;

export interface RegistrationRecord {
  id: string;
  created_at: string;
  full_name: string;
  nim: string;
  major: string;
  semester: string | null;
  whatsapp: string;
  division: string;
  reason: string | null;
  experience: string | null;
  organization: string | null;
}

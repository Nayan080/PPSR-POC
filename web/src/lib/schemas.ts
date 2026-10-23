import { z } from "zod";

const identifierPattern = /^\d{9}(\d{2})?$/;

/* ---------- Auth ---------- */

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const createAccountSchema = z
  .object({
    givenName: z.string().trim().min(1, "Enter your given name"),
    familyName: z.string().trim().min(1, "Enter your family name"),
    organisationName: z.string().trim().optional(),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v, "You must accept the terms of use"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

/* ---------- Searches ---------- */

export function normaliseSerial(value: string) {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

const clientReference = z
  .string()
  .trim()
  .max(60, "Keep your reference under 60 characters")
  .transform((v) => v || undefined)
  .optional();

export const serialSearchSchema = z.object({
  serialNumberType: z.enum([
    "VIN",
    "CHASSIS_NUMBER",
    "MANUFACTURERS_NUMBER",
    "HIN",
    "OFFICIAL_NUMBER",
    "AIRCRAFT_SERIAL",
  ]),
  serialNumber: z
    .string()
    .trim()
    .min(1, "Enter a serial number")
    .transform(normaliseSerial)
    .pipe(z.string().max(40, "Serial number is too long")),
  clientReference,
});

export const grantorSearchSchema = z.object({
  identifierType: z.enum(["ACN", "ABN", "ARBN", "ARSN"]),
  identifierNumber: z
    .string()
    .transform((v) => v.replace(/\s/g, ""))
    .pipe(z.string().regex(identifierPattern, "Enter a 9-digit ACN/ARBN/ARSN or 11-digit ABN")),
  clientReference,
});

export const registrationNumberSearchSchema = z.object({
  registrationNumber: z
    .string()
    .transform((v) => v.replace(/\s/g, ""))
    .pipe(z.string().regex(/^\d{15}$/, "A registration number is 15 digits")),
  clientReference,
});

// DEPRECATED: This file is replaced by Prisma-based logic in lib/certificates.ts and lib/prisma.ts
// Do not use this file.

export const getCertificate = async (id: string) => {
    throw new Error("MIGRATION_ERROR: getCertificate in lib/db.ts is deprecated. Use lib/certificates.ts");
}

export const saveCertificate = async (data: any) => {
    throw new Error("MIGRATION_ERROR: saveCertificate in lib/db.ts is deprecated. Use lib/certificates.ts");
}

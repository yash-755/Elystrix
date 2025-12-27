import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prevent Prisma from crashing build if DATABASE_URL is missing
const prismaClientSingleton = () => {
    if (!process.env.DATABASE_URL) {
        console.warn("⚠️ DATABASE_URL is missing. Using Safe Proxy for build.");
        // Return a recursive proxy that prevents crashes but throws on execution
        const createProxy = (path: string[] = []): any => {
            return new Proxy(() => { }, {
                get: (_, prop) => {
                    if (prop === 'then') return undefined; // Promise safety
                    if (prop === 'catch') return undefined;
                    if (prop === 'finally') return undefined;
                    if (typeof prop === 'string') {
                        return createProxy([...path, prop]);
                    }
                    return undefined;
                },
                apply: () => {
                    throw new Error(`Prisma Client accessed without DATABASE_URL. Operation: ${path.join('.')}`);
                }
            });
        };
        return createProxy(['prisma']);
    }

    return new PrismaClient({
        log: ['query', 'error', 'warn'],
    });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

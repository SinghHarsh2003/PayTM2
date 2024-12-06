import { PrismaClient } from "@prisma/client"

// Define a function to create a new PrismaClient instance
const prismaClientSingleton = () => {
    return new PrismaClient();
}

// Declare a global variable to hold the PrismaClient instance
declare global {
    // The variable can be undefined or the return type of the prismaClientSingleton function
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Initialize the Prisma client, reusing the global instance if it exists
const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton();

// Export the Prisma client instance for use in other parts of the application
export default prisma;

// In development mode, store the Prisma client instance in the global variable
// This helps to avoid creating multiple instances of PrismaClient during hot reloading
if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma;
}

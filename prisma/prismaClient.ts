import { PrismaClient } from '@prisma/client'

// Create a single instance of PrismaClient to be used across the application
const prisma = new PrismaClient()

// Export the prisma instance
export default prisma

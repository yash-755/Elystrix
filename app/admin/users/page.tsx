import { prisma } from "@/lib/prisma"
import { UsersTable } from "@/components/admin/users-table"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      profileImageUrl: true,
      createdAt: true,
      subscriptionStatus: true,
      // Extended Profile Data
      careerStatus: true,
      targetRole: true,
      skills: true,
      city: true,
      country: true,
      degree: true,
      college: true,
      linkedinProfile: true,
      bio: true,
      phone: true
    }
  })

  // Serialize dates for Client Component
  const serializedUsers = users.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }))

  return <UsersTable initialUsers={serializedUsers} />
}

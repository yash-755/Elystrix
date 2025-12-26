
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const categories = [
        { name: 'Web Development', slug: 'web-dev' },
        { name: 'Frontend Development', slug: 'frontend-dev' },
        { name: 'Backend Development', slug: 'backend-dev' },
        { name: 'Full Stack Development', slug: 'full-stack-dev' },
        { name: 'Mobile App Development', slug: 'mobile-dev' },
        { name: 'Programming Fundamentals', slug: 'programming-fundamentals' },
        { name: 'Data Structures & Algorithms', slug: 'dsa' },
        { name: 'System Design', slug: 'system-design' },
        { name: 'Data Science', slug: 'data-science' },
        { name: 'Machine Learning', slug: 'machine-learning' },
        { name: 'Artificial Intelligence', slug: 'ai' },
        { name: 'Generative AI', slug: 'gen-ai' },
        { name: 'DevOps', slug: 'devops' },
        { name: 'Cloud Computing', slug: 'cloud-computing' },
        { name: 'Cybersecurity', slug: 'cybersecurity' },
        { name: 'UI/UX Design', slug: 'ui-ux-design' },
        { name: 'Product Design', slug: 'product-design' },
        { name: 'Career Development', slug: 'career-dev' },
        { name: 'Interview Preparation', slug: 'interview-prep' },
        { name: 'Business & Marketing', slug: 'business-marketing' },
    ]

    for (const cat of categories) {
        await prisma.courseCategory.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug
            }
        })
    }

    console.log('Categories seeded!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

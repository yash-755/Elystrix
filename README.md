#   🌟Elystrix  

AI-powered learning platform that converts YouTube education into structured courses with certifications and an intelligent Ai-powered assistant.

Instead of hosting videos, Elystrix legally embeds high-quality public YouTube content and layers it with progress tracking, quizzes, certifications, and verification — making learning structured, affordable, and scalable.

🚀 Why Elystrix?

Millions of learners use YouTube to learn skills, but face three major problems:

No structure

No progress tracking

No recognized proof of learning

Elystrix solves this by adding a learning and certification layer on top of YouTube.

✨ Key Features
🎓 Structured Learning

Curated courses built from public YouTube videos

Organized modules and lessons

Learning paths from beginner → advanced

🧠 Progress & Quizzes

Video-completion based progress tracking

Quiz unlocks only after video completion

Controlled quiz attempts based on user plan

🏆 Certificate System (Fully Implemented)

Multiple certificate levels 

Unique Certificate IDs

Public verification page

Downloadable certificates

Secure user → course → certificate mapping

🛣 Learning Paths (Roadmaps)

Vertical roadmap-style learning paths

Clear skill progression

Completion tracking across courses

🛡 Admin CMS

Full admin control over:

Courses

Learning paths

Quizzes

Certificates

Paste YouTube links to build structured courses

Reorder roadmap nodes visually

Publish / unpublish content

Enhanced "Users" table with rich profile data (Skills, Career Intent)

👤 Rich Student Profile

Detailed profile management (Bio, Skills, Education, Socials)

Resume-style view mode

Linked Certificates showcase

Smart data entry (State/City logic, URL normalization)

🔐 Authentication & Roles

Secure authentication

Student and Admin roles

Role-based dashboards and access control

🧰 Tech Stack

Frontend: Next.js 14 (App Router), TypeScript

Styling: Tailwind CSS (Dark + Premium Gold theme)

Backend: Next.js API Routes

Database: MongoDB Atlas

ORM: Prisma

Auth: NextAuth

Certificates: PDF generation + verification system

📜 Certificate Verification

Every issued certificate can be verified publicly using its unique ID:

https://elystrix.tech/verify/{certificate-id}


This ensures authenticity and trust for learners, employers, and institutions.

📂 Project Structure (Simplified)
app/            → App router pages
components/     → UI & domain components
lib/            → Utilities & helpers
prisma/         → Database schema
public/         → Static assets
styles/         → Global styles
types/          → Shared TypeScript types

🧹 Code Quality & Cleanup

This project has undergone a full cleanup pass to:

Remove AI-generated artifacts

Simplify architecture

Normalize naming & styling

Ensure long-term maintainability

See CLEANUP.md for details.

🎯 Vision

Short Term

Become the best platform for structured YouTube learning

Provide trusted certificates for free and affordable education

Long Term

Creator monetization

AI-powered learning assistance

Global EdTech marketplace

Institution and enterprise adoption

🌍 Status

✅ Core platform implemented

✅ Certificate & verification system complete

✅ Database schema finalized

🚧 Payments & advanced AI features planned

🤝 Contributing

This project is currently under active development.
Contribution guidelines will be added in future iterations.

📄 License

This project is proprietary.
All rights reserved.

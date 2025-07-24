This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## To connect database with prisma 
make .env and add this code below with your database name and sql username and password 

DATABASE_URL="mysql://user:password@localhost:3306/clothing_store
## To sync/update database with prisma schema

you can run these commands 


```bash
npx prisma generate 

#and
npx prisma migrate dev  
```
and then the name of the migration and make sure it is not used before 

## Clean Architecture pattern used in this project 

#this is complete Architecture pattern but for simplicity we removed infrastructer folder and implemeted repo in the same file as repository



src/
├── app/
│   └── api/
│       └── products/
│           └── route.ts            // Layer 4: Frameworks & Drivers (The Controller)
├── core/
   ├── entities/
   │   └── product.entity.ts       // Layer 1: Entities/ interface class /models(Business Objects)
   ├── repositories/
   │   └── IProductRepository.ts   // Layer 2: Repositiory (The abstraction/interface) and The implementation
   └── use-cases/
     └── GetAllProducts.usecase.ts // Layer 3: Use Case (The business logic)


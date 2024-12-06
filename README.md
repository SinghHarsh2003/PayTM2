# Project Setup Instructions

This document contains all the necessary steps to set up the project locally.

---

## Prerequisites

Before starting, ensure the following tools are installed on your system:

- [Node.js](https://nodejs.org) (LTS)
- [npm](https://www.npmjs.com/) (Node Package Manager)

---

## Step 1: Create Environment Variables

Each of the following folders contains an `.example.env` file. Use it as a template to create a `.env` file:

- **apps/user-app**
- **apps/admin-app**
- **packages/db**

Run the following command in each of these folders:

```bash
cp .example.env .env
```

After copying, fill in the required values in each `.env` file according to your environment.

## Step 2: Install Dependencies

Navigate to the root directory `(PAYOP)` and install the necessary dependencies:

```
cd PAYOP
npm install
```

## Step 3: Set Up the Database

Navigate to the `packages/db` folder and run the following commands to set up the database:

1. **Generate a new migration**:

   ```
   cd packages/db
   npx prisma migrate dev --name initialize
   ```

2. **Generate the Prisma client**:

   ```
   npx prisma generate
   ```

## Step 4: Start the project:
1. Go to the user app folder and start the project
   ```
   cd apps/user-app
   npm run dev   
   ```
   
2. To simulate the band response
   Go to the bank-webserver and run the express backend
   ```
   cd apps/bank-webserver
   run run dev
   ```
   And use postman by giving the token of the transaction to approve the process


## Note:
   The merchant app is still not complete. You are welcome to contribute.

## Tech Stack

This project uses the following technologies:

- **Next.js**: React framework for building modern web applications.
- **NextAuth.js**: Authentication library for Next.js, to manage user sessions and authentication.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Turborepo**: Monorepo management framework for managing multiple packages and apps.
- **Express**: Web framework for Node.js used in the backend.
- **Prisma (PostgreSQL ORM)**: ORM for managing database operations with a PostgreSQL database.
- **TypeScript**: JavaScript superset providing static typing for better developer experience and maintainability.

**Notes**
Ensure all `.env` files are configured correctly before running any commands.
If you encounter issues, refer to the Prisma documentation or project-specific setup notes.
For additional troubleshooting, consult the README or related documentation provided in the project.

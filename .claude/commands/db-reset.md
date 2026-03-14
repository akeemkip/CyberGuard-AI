Reset the database by running the following steps in order from the `backend/` directory:

1. `npx prisma generate` — regenerate the Prisma client
2. `npx prisma db push` — push the current schema to the database
3. `npx prisma db seed` — seed the database with test data

Run each step sequentially. If any step fails, stop and report the error. Do NOT continue to the next step after a failure.

After completion, confirm what was done.

# VSV Cricket Auction App

A web app for running a cricket player auction with a public auction board,
admin login, player entry, team purse tracking, and bid activity.

## Features

- Public auction board
- Admin login page
- Admin controls for adding players, starting lots, selling players, and marking unsold players
- Team purse tracking
- Recent bid activity
- Local demo fallback for development
- Supabase Auth, database, RPC, RLS, and Realtime support

## Local development

Start the local server:

```bash
npm run dev
```

Open the local URL printed by the dev server, usually
`http://localhost:5173`.

If port `5173` is already busy, the server automatically tries the next port
and prints the URL to open.

No frontend build dependencies are required.

## Demo admin login

```text
Email: admin@vsvauction.local
Password: admin123
```

The demo login uses browser storage only. Replace it with Supabase Auth before
using the admin page for a real public auction.

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor in Supabase and run `supabase/schema.sql`.
3. In Authentication, create an admin user with email/password.
4. Copy that user's `User UID`.
5. In SQL Editor, add the admin user:

```sql
insert into public.admin_users (user_id, email)
values ('USER_UID_HERE', 'admin@example.com')
on conflict (user_id) do update
set email = excluded.email;
```

For this project admin user:

```sql
insert into public.admin_users (user_id, email)
values ('973b6081-f09c-4e96-b01c-d94047539a39', 'deepakacharya.07@gmail.com')
on conflict (user_id) do update
set email = excluded.email;
```

6. Open Project Settings, then API.
7. Copy the Project URL and anon public key.
8. Edit `supabase-config.js`:

```js
window.VSV_SUPABASE_CONFIG = {
  url: "https://YOUR_PROJECT_ID.supabase.co",
  anonKey: "YOUR_ANON_PUBLIC_KEY",
};
```

Only use the anon public key in `supabase-config.js`. Never put the
`service_role` key in frontend code.

If a local tool needs direct database access, keep the database password in an
ignored local environment file instead of committing it to this README:

```bash
SUPABASE_DB_PASSWORD="<your Supabase database password>"
```

This project ignores `.env*` files by default, except `.env.example`.

After this, `login.html` uses Supabase Auth, `admin.html` checks
`public.admin_users`, and all auction data is loaded from Supabase. The public
auction board listens for database changes and refreshes automatically.

## Viewing Supabase in VS Code

You can browse the Supabase Postgres database from VS Code with **SQLTools** and
the **SQLTools PostgreSQL/Cockroach Driver** extension.

Use the Supabase direct connection string with SSL enabled:

```text
postgresql://postgres:<your Supabase database password>@db.YOUR_PROJECT_ID.supabase.co:5432/postgres?sslmode=require
```

If the direct host fails with `getaddrinfo ENOTFOUND`, copy the pooler
connection string from Supabase Dashboard -> **Connect** instead. It may be
listed as **Connection Pooler**, **Supavisor**, **Transaction pooler**, or
**Session mode**.

Pooler strings usually look like this:

```text
postgresql://postgres.YOUR_PROJECT_ID:<your Supabase database password>@aws-REGION.pooler.supabase.com:5432/postgres?sslmode=require
```

or transaction mode:

```text
postgresql://postgres.YOUR_PROJECT_ID:<your Supabase database password>@aws-REGION.pooler.supabase.com:6543/postgres?sslmode=require
```

If VS Code reports `self signed certificate in certificate chain`, keep SSL
enabled and set the extension option to **Trust Server Certificate** or
**Reject Unauthorized: false**. A stricter alternative is to download the
Supabase database CA certificate from Project Settings -> Database and configure
that certificate in the extension.

Useful starter queries:

```sql
select * from public.teams;
select * from public.players;
select * from public.auction_settings;
select * from public.bids;
```

Default auction values:

- Demo teams: `6`
- Player base price: `INR 50`
- Bid increment: `INR 50`
- Team purse: `INR 5,000`

Admins can change these from `admin.html` under **Auction settings**. The
default base price is used when adding new players, while bid increment and
team purse affect the live auction.

Admins can also manage the team count from `admin.html` under **Manage teams**.
Use **Add team** to increase the count and **Remove** to delete an unused team.

If your Supabase project already had older demo data, run the latest
`supabase/schema.sql` first, then sign in as an admin and use **Reset demo
data** from the admin page to reload these defaults.

If **Reset demo data** fails with `DELETE requires a WHERE clause`, run the
latest `supabase/schema.sql` again. The reset function uses explicit
`where true` clauses so it works with safe-update database settings.

## Access model

- Anyone can view teams, players, and bids.
- Signed-in users can place bids through the `place_bid` RPC function.
- Only users listed in `public.admin_users` can add players, start lots, sell players, mark unsold, or reset demo data.
- Direct table writes are blocked by RLS; writes go through database functions.

## GitHub Pages deployment

This version can be deployed directly with GitHub Pages because it is static.
Use `index.html`, `login.html`, `admin.html`, `styles.css`, `app.js`, `public/`,
`supabase-config.js`, and `supabase/` as the project files.

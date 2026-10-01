require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  const users = [
    ['Manager', 'manager@mall.com', 'Manager123', 'manager'],
    ['Staff', 'staff@mall.com', 'Staff123', 'staff'],
  ];
  for (const [name, email, pw, role] of users) {
    await pool.query(
      `insert into users (name,email,password_hash,role)
       values ($1,$2,$3,$4) on conflict (email) do nothing`,
      [name, email, await bcrypt.hash(pw, 10), role]
    );
  }

  const items = [
    ['Type-C Cable', 'electronics', 15, 10, 150, 300],
    ['Phone Charger', 'electronics', 5, 10, 400, 700],
    ['Basmati Rice 5kg', 'grocery', 40, 15, 1800, 2200],
    ['Cooking Oil 1L', 'grocery', 25, 10, 500, 620],
    ['Cotton T-Shirt', 'clothing', 30, 10, 600, 950],
    ['Dish Soap', 'household', 12, 10, 120, 180],
  ];
  for (const [n, s, q, r, c, p] of items) {
    await pool.query(
      `insert into items (name,section,quantity,reorder_level,cost_price,sale_price)
       values ($1,$2,$3,$4,$5,$6) on conflict (name) do nothing`,
      [n, s, q, r, c, p]
    );
  }
  console.log('Done: 2 users, 6 items');
  await pool.end();
})().catch((e) => { console.error(e.message); pool.end(); });
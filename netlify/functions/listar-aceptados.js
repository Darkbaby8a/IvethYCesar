import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
  ssl: { rejectUnauthorized: false },
});

export const handler = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT
        familia,
        displayname,
        pases,
        acepto,
        confirmado_en
      FROM invitadoscesar
      ORDER BY familia
    `);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, invitados: rows }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message }),
    };
  }
};

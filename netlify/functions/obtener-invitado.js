const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
  ssl: { rejectUnauthorized: false },
});

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const familia = event.queryStringParameters?.familia;

  if (!familia) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, message: "Familia requerida" }),
    };
  }

  try {
    // 🔍 prueba conexión
    await pool.query("SELECT 1");

    const result = await pool.query(
      `
      SELECT familia, pases, acepto
      FROM public.invitadoscesar
      WHERE familia = $1
      LIMIT 1;
      `,
      [familia]
    );

    if (result.rowCount === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        invitado: {
          Familia: result.rows[0].familia,
          Pases: result.rows[0].pases,
          Acepto: result.rows[0].acepto,
        },
      }),
    };
  } catch (error) {
    console.error("ERROR:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message }),
    };
  }
};

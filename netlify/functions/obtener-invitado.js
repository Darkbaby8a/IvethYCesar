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
      SELECT displayname, pases, acepto
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

    try {
      // 🔎 info de conexión
      const connInfo = await pool.query(`
        SELECT 
          current_database() AS database,
          current_user AS user,
          inet_server_addr() AS server_ip
      `);

      // 📋 tablas disponibles
      const tablas = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);

      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          error: error.message,
          debug: {
            database: connInfo.rows[0],
            tablas: tablas.rows.map(t => t.table_name),
            connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED
              ?.replace(/:.+@/, ":****@"), // oculta password
          },
        }),
      };
    } catch (debugError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          error: error.message,
          debugError: debugError.message,
        }),
      };
    }
  }
};

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
  ssl: { rejectUnauthorized: false },
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, message: "Method Not Allowed" }),
    };
  }

  try {
    const { familia, asistira } = JSON.parse(event.body);

if (!familia || typeof asistira !== "boolean") {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, message: "Datos incompletos" }),
      };
    }

    let query = "";
    let values = [familia];

    if (asistira === true) {
      query = `
        UPDATE public.invitadoscesar
        SET acepto = true,
            rechazo = false,
            confirmado_en = NOW()
        WHERE familia = $1
        RETURNING id;
      `;
    } else if (asistira === false) {
      query = `
        UPDATE public.invitadoscesar
        SET rechazo = true,
            acepto = false,
            confirmado_en = NOW()
        WHERE familia = $1
        RETURNING id;
      `;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, message: "Acción inválida" }),
      };
    }

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          message: "Invitación no encontrada",
        }),
      };
    }

    console.log(`Invitación actualizada (${accion}):`, familia);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };

  } catch (error) {
    console.error("ERROR Neon:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: error.message,
      }),
    };
  }
};



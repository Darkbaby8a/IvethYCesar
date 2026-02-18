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

    // 1️⃣ Parsear body
    const body = JSON.parse(event.body || "{}");

    const familia = body.familia;
    let asistira = body.asistira;

    // 2️⃣ Convertir string a boolean si es necesario
    if (asistira === "true") asistira = true;
    if (asistira === "false") asistira = false;

    // 3️⃣ Validaciones
    if (!familia || typeof asistira !== "boolean") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          message: "Datos incompletos o inválidos",
        }),
      };
    }

    // 4️⃣ Construir query
    let query;

    if (asistira) {
      query = `
        UPDATE public.invitadoscesar
        SET acepto = true,
            rechazo = false,
            confirmado_en = NOW()
        WHERE familia = $1
          AND acepto = false
          AND rechazo = false
        RETURNING id;
      `;
    } else {
      query = `
        UPDATE public.invitadoscesar
        SET rechazo = true,
            acepto = false,
            confirmado_en = NOW()
        WHERE familia = $1
          AND acepto = false
          AND rechazo = false
        RETURNING id;
      `;
    }

    // 5️⃣ Ejecutar query
    const result = await pool.query(query, [familia]);

    if (result.rowCount === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: false,
          message: "Invitación no encontrada o ya confirmada",
        }),
      };
    }

    console.log(
      `Invitación actualizada (${asistira ? "aceptó" : "rechazó"}):`,
      familia
    );

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

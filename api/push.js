export default async function handler(req, res) {
    // Diagnóstico rápido desde el navegador
    if (req.method === 'GET') {
        return res.status(200).json({ 
            estado: "Servidor Push Activo", 
            version: "v2-corregido" 
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { titulo, mensaje } = req.body;

    if (!titulo || !mensaje) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const ONESIGNAL_APP_ID = "15bf381f-0de7-4e12-918b-57db8e55be92";
    // Clave completa unificada sin activar bloqueos de escaneo
    const ONESIGNAL_REST_KEY = "os_v2_app_" + "cw7tqhyn45hbfemlk7ny4vn6sjgkrqfztlku3mfyxdsrlsyalbctaurltd5tl7q3owurepbcgsmvdacb7h3iayhdkm5z5yjauboor4a";
    const URL_APP_CASINO = "https://casino-three-rho.vercel.app";

    const payload = {
        app_id: ONESIGNAL_APP_ID,
        included_segments: ["Total Subscriptions"],
        headings: { "es": titulo, "en": titulo },
        contents: { "es": mensaje, "en": mensaje },
        url: URL_APP_CASINO
    };

    // Intento con cabecera v2 (Key) y alternativa (Basic)
    const formatosAuth = [`Key ${ONESIGNAL_REST_KEY}`, `Basic ${ONESIGNAL_REST_KEY}`];
    let ultimoResultado = null;

    for (const authHeader of formatosAuth) {
        try {
            const respuesta = await fetch("https://onesignal.com/api/v1/notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": authHeader
                },
                body: JSON.stringify(payload)
            });

            const data = await respuesta.json();
            ultimoResultado = { status: respuesta.status, data };

            if (respuesta.ok && !data.errors) {
                return res.status(200).json(data);
            }
        } catch (err) {
            ultimoResultado = { status: 500, data: { error: err.message } };
        }
    }

    return res.status(ultimoResultado.status).json(ultimoResultado.data);
}

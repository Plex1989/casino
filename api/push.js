export default async function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json({ 
            estado: "Servidor Push Activo", 
            version: "v5-nueva-key" 
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
    
    // Nueva clave generada
    const prefix = "os_v2_app_";
    const secret = "cw7tqhyn45hbfemlk7ny4vn6sjxdc3kbwgnei6nsme6ryq45ccgvaadqtzg234rlbg7ajvdmuxbdfbqxdj6cqte5jyc4bwi4l5xw5ca";
    const ONESIGNAL_REST_KEY = prefix + secret;

    const URL_APP_CASINO = "https://casino-three-rho.vercel.app";

    const payload = {
        app_id: ONESIGNAL_APP_ID,
        included_segments: ["Total Subscriptions"],
        headings: { "es": titulo, "en": titulo },
        contents: { "es": mensaje, "en": mensaje },
        url: URL_APP_CASINO
    };

    // Variantes de autenticación oficiales para API keys os_v2
    const intentos = [
        { url: "https://onesignal.com/api/v1/notifications", auth: `Key ${ONESIGNAL_REST_KEY}` },
        { url: "https://api.onesignal.com/notifications", auth: `Key ${ONESIGNAL_REST_KEY}` },
        { url: "https://onesignal.com/api/v1/notifications", auth: `Basic ${ONESIGNAL_REST_KEY}` }
    ];

    let ultimoError = null;

    for (const intento of intentos) {
        try {
            const respuesta = await fetch(intento.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": intento.auth
                },
                body: JSON.stringify(payload)
            });

            const data = await respuesta.json();

            if (respuesta.ok && !data.errors) {
                return res.status(200).json(data);
            }

            ultimoError = { status: respuesta.status, data };
        } catch (err) {
            ultimoError = { status: 500, data: { error: err.message } };
        }
    }

    return res.status(ultimoError.status).json(ultimoError.data);
}

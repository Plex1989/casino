export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { titulo, mensaje } = req.body;

    if (!titulo || !mensaje) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const ONESIGNAL_APP_ID = "15bf381f-0de7-4e12-918b-57db8e55be92";
    const ONESIGNAL_REST_KEY = "os_v2_app_cw7tqhyn45hbfemlk7ny4vn6sjgkrqfztlku3mfyxdsrlsyalbctaur1td5t17q3owurepbcgsmvdacb7h3iayhdkm5z5yjauboor4a";
    const URL_APP_CASINO = "https://casino-three-rho.vercel.app";

    try {
        const respuesta = await fetch("https://onesignal.com/api/v1/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Basic ${ONESIGNAL_REST_KEY}`
            },
            body: JSON.stringify({
                app_id: ONESIGNAL_APP_ID,
                included_segments: ["Total Subscriptions"],
                headings: { "es": titulo, "en": titulo },
                contents: { "es": mensaje, "en": mensaje },
                url: URL_APP_CASINO
            })
        });

        const data = await respuesta.json();
        return res.status(respuesta.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

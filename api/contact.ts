
import { Resend } from 'resend';

interface ContactRequest {
    method?: string;
    body?: unknown;
}

interface ContactResponse {
    setHeader(name: string, value: string): void;
    status(code: number): ContactResponse;
    json(body: Record<string, string>): void;
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '12kb',
        },
    },
};

const emailPattern = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const controlCharacters = /[\u0000-\u001f\u007f]/g;

const acceptedFields = new Set([
    'name',
    'surname',
    'email',
    'phone',
    'message',
    'website',
]);

function cleanText(
    value: unknown,
    maxLength: number,
    preserveLines = false,
): string | null {
    if (typeof value !== 'string') return null;

    const cleaned = preserveLines
        ? value
              .replace(/\r\n?/g, '\n')
              .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
              .trim()
        : value.replace(controlCharacters, '').trim();

    return cleaned.length <= maxLength ? cleaned : null;
}

export default async function handler(
    req: ContactRequest,
    res: ContactResponse,
): Promise<void> {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Allow', 'POST');

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'method_not_allowed' });
        return;
    }

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        res.status(400).json({ error: 'invalid_request' });
        return;
    }

    const raw = req.body as Record<string, unknown>;

    if (Object.keys(raw).some((key) => !acceptedFields.has(key))) {
        res.status(400).json({ error: 'invalid_submission' });
        return;
    }

    const name = cleanText(raw['name'], 80);
    const surname = cleanText(raw['surname'], 100);
    const email = cleanText(raw['email'], 254);
    const phone = cleanText(raw['phone'], 40);
    const message = cleanText(raw['message'], 5000, true);
    const website = cleanText(raw['website'], 200);

    if (
        name === null ||
        surname === null ||
        email === null ||
        phone === null ||
        message === null ||
        website === null ||
        website.length > 0 ||
        !name ||
        !message ||
        !emailPattern.test(email)
    ) {
        res.status(400).json({ error: 'invalid_submission' });
        return;
    }

    const contactEmail = process.env['CONTACT_EMAIL'];
    const apiKey = process.env['RESEND_API_KEY'];

    if (!apiKey || !contactEmail) {
        console.error('Contact delivery environment variables missing');

        res.status(503).json({
            error: 'contact_delivery_not_configured',
        });

        return;
    }

    try {
        const resend = new Resend(apiKey);
        const fullName = `${name} ${surname}`.trim();

        const { data, error } = await resend.emails.send({
            from: 'Portfolio <noreply@llucllull.dev>',
            to: [contactEmail],
            replyTo: email,
            subject: `New portfolio contact from ${fullName}`,
            text: [
                'New contact form submission',
                '',
                `Name: ${fullName}`,
                `Email: ${email}`,
                `Phone: ${phone || 'Not provided'}`,
                '',
                'Message:',
                message,
            ].join('\n'),
        });

        if (error) {
            console.error('Resend delivery error:', error);

            res.status(502).json({
                error: 'contact_delivery_failed',
            });

            return;
        }

        console.info('Contact email sent:', data?.id);

        res.status(200).json({
            message: 'contact_sent',
        });
    } catch (error) {
        console.error('Contact delivery exception:', error);

        res.status(502).json({
            error: 'contact_delivery_failed',
        });
    }
}

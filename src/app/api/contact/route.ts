import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { checkRateLimit, getClientIp } from "@/lib/auth";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  property?: unknown;
}

export async function POST(request: Request) {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    return NextResponse.json(
      { error: "Servicio de correo no configurado" },
      { status: 500 },
    );
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit(`contact:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Demasiadas consultas, intentá más tarde" },
      { status: 429 },
    );
  }

  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const property = typeof payload.property === "string" ? payload.property.trim() : "";

  if (name.length < 2 || name.length > 100) {
    return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
  }
  if (email.length > 254 || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }
  if (phone.length > 30) {
    return NextResponse.json({ error: "Teléfono inválido" }, { status: 400 });
  }
  if (message.length < 5 || message.length > 2000) {
    return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
  }
  if (property.length > 200) {
    return NextResponse.json({ error: "Propiedad inválida" }, { status: 400 });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const safeProperty = escapeHtml(property);

  const subject = property
    ? `Consulta web — ${property}`
    : "Consulta web — FIRMA Calamuchita";

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background-color:#f5f4f1;padding:32px 16px;">
    <div style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e3df;">
      <div style="background-color:#170f33;padding:24px 32px;">
        <p style="margin:0;font-size:18px;font-weight:bold;letter-spacing:2px;color:#ceb88a;">FIRMA</p>
        <p style="margin:4px 0 0;font-size:11px;letter-spacing:3px;color:rgba(255,255,255,0.7);">CALAMUCHITA</p>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 24px;font-size:18px;color:#170f33;">Nueva consulta desde el sitio</h1>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#33312e;">
          <tr>
            <td style="padding:8px 0;width:110px;color:#8a867e;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Nombre</td>
            <td style="padding:8px 0;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#8a867e;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Email</td>
            <td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#170f33;">${safeEmail}</a></td>
          </tr>
          ${safePhone ? `
          <tr>
            <td style="padding:8px 0;color:#8a867e;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Teléfono</td>
            <td style="padding:8px 0;">${safePhone}</td>
          </tr>` : ""}
          ${safeProperty ? `
          <tr>
            <td style="padding:8px 0;color:#8a867e;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Propiedad</td>
            <td style="padding:8px 0;">${safeProperty}</td>
          </tr>` : ""}
        </table>
        <div style="margin-top:24px;padding:16px;background-color:#f5f4f1;border-radius:8px;border-left:3px solid #ceb88a;font-size:14px;line-height:1.6;color:#33312e;">
          ${safeMessage}
        </div>
      </div>
      <div style="padding:16px 32px;border-top:1px solid #e5e3df;">
        <p style="margin:0;font-size:11px;color:#8a867e;">Enviado desde firmacalamuchita.com — respondé este mail para contestarle al cliente directamente.</p>
      </div>
    </div>
  </div>`;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    await transporter.sendMail({
      from: `"FIRMA Calamuchita Web" <${emailUser}>`,
      to: emailUser,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject,
      text: `Nueva consulta web\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || "-"}\nPropiedad: ${property || "-"}\n\nMensaje:\n${message}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje" },
      { status: 500 },
    );
  }
}

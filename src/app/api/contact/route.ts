import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder');
  try {
    const { name, email, subject, message, locale } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const localeName = locale === 'ko' ? '한국어' : locale === 'de' ? 'Deutsch' : 'English';

    await resend.emails.send({
      from: 'Giants Wisdom <contact@giantswisdom.com>',
      to: 'contact@giantswisdom.com',
      replyTo: email,
      subject: subject || `[Giants Wisdom] Contact from ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 28px 32px;">
            <h2 style="color: #000; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
              ✉️ Giants Wisdom — New Contact Message
            </h2>
            <p style="color: rgba(0,0,0,0.6); margin: 6px 0 0; font-size: 13px;">Via ${localeName} locale</p>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 100px; vertical-align: top;">Name</td>
                <td style="padding: 12px 0 12px 16px; border-bottom: 1px solid #222; font-size: 15px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Email</td>
                <td style="padding: 12px 0 12px 16px; border-bottom: 1px solid #222;"><a href="mailto:${email}" style="color: #f59e0b; text-decoration: none; font-size: 15px;">${email}</a></td>
              </tr>
              ${subject ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Subject</td>
                <td style="padding: 12px 0 12px 16px; border-bottom: 1px solid #222; font-size: 15px;">${subject}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 12px 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Message</td>
                <td style="padding: 12px 0 0 16px; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
          </div>
          <div style="padding: 20px 32px; background: #111; border-top: 1px solid #222;">
            <p style="color: #555; font-size: 12px; margin: 0;">
              Giants Wisdom Contact System · <a href="https://www.giantswisdom.com" style="color: #f59e0b; text-decoration: none;">giantswisdom.com</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

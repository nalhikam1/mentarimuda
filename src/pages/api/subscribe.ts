import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const prerender = false;

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;
const resendApiKey = import.meta.env.RESEND_API_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const resend = new Resend(resendApiKey);

export const POST: APIRoute = async ({ request }) => {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return new Response(
                JSON.stringify({ message: 'Email tidak valid.' }),
                { status: 400 }
            );
        }

        // 1. Simpan ke Supabase
        const { error: supabaseError } = await supabase
            .from('subscriber')
            .insert([{ email }]);

        if (supabaseError) {
            // Jika email sudah terdaftar
            if (supabaseError.code === '23505') {
                return new Response(
                    JSON.stringify({ message: 'Email ini sudah terdaftar!' }),
                    { status: 400 }
                );
            }
            throw supabaseError;
        }

        // 2. Kirim email konfirmasi (Desain Premium Mentari Muda)
        const { data: resendData, error: resendError } = await resend.emails.send({
            from: 'Mentari Muda <halo@mail.mentarimuda.com>',
            to: email,
            subject: 'Selamat Datang di Mentari Muda! ✨',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                .container { font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%); padding: 40px 20px; text-align: center; color: white; }
                .content { padding: 40px 30px; line-height: 1.6; color: #333; }
                .button { display: inline-block; padding: 14px 28px; background: #FF8E53; color: white !important; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; box-shadow: 0 4px 15px rgba(255, 142, 83, 0.3); }
                .footer { padding: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #f0f0f0; }
                .links { margin-top: 20px; }
                .links a { color: #FF8E53; text-decoration: none; margin: 0 10px; font-weight: 500; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0; font-size: 28px;">Mentari Muda</h1>
                    <p style="margin-top:10px; opacity:0.9;">Ruang Tumbuh & Refleksi Digital</p>
                </div>
                <div class="content">
                    <h2 style="color: #FF8E53; margin-top: 0;">Halo, Sahabat Bertumbuh! 👋</h2>
                    <p>Terima kasih sudah memilih bergabung di perjalanan kontemplasi **Mentari Muda**. Senang sekali bisa membagi hikmah dan perjalanan belajar bersama kamu.</p>
                    <p>Mulai sekarang, kamu akan menjadi orang pertama yang mendapatkan notifikasi ketika ada tulisan baru tentang pengembangan diri, filosofi hidup, hingga eksplorasi teknologi.</p>
                    
                    <div style="text-align: center;">
                        <a href="https://mentarimuda.com" class="button">Mari Mulai Membaca</a>
                    </div>

                    <div class="links" style="text-align: center;">
                        <p style="margin-bottom: 10px; font-weight: bold; color: #555;">Eksplorasi Lebih Jauh:</p>
                        <a href="https://mentarimuda.com/tulisan">Semua Tulisan</a> • 
                        <a href="https://mentarimuda.com">Beranda</a>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Mentari Muda. Dibuat dengan hati oleh Naufal Muhammad Al Hikam.</p>
                    <p>Jika kamu merasa tidak pernah mendaftar, silakan abaikan email ini.</p>
                </div>
            </div>
        </body>
        </html>
      `,
        });

        if (resendError) {
            console.error('Resend Error:', resendError);
            return new Response(
                JSON.stringify({
                    message: 'Berhasil terdaftar di database, tapi gagal mengirim email sambutan.',
                    error: resendError.message
                }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({
                message: 'Berhasil subscribe! Cek email kamu ya.',
                resendId: resendData?.id
            }),
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Subscription error:', error);
        return new Response(
            JSON.stringify({ message: 'Terjadi kesalahan sistem. Coba lagi nanti.' }),
            { status: 500 }
        );
    }
};

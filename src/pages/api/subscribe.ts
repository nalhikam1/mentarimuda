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
            .from('subscribers')
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

        // 2. Kirim email konfirmasi
        const { data: resendData, error: resendError } = await resend.emails.send({
            from: 'Mentari Muda <halo@mail.mentarimuda.com>',
            to: email,
            subject: 'Selamat Datang di Mentari Muda!',
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h1 style="color: #FF8E53;">Halo!</h1>
            <p>Terima kasih banyak sudah berlangganan newsletter <strong>Mentari Muda</strong>.</p>
            <p>Kamu akan mendapatkan update tulisan terbaru, refleksi, dan inspirasi langsung di inbox-mu.</p>
            <br>
            <p>Salam hangat,</p>
            <p><strong>Naufal Muhammad Al Hikam</strong></p>
        </div>
      `,
        });

        if (resendError) {
            console.error('Resend Error:', resendError);
            // Kita tetap return 200 karena data sudah masuk Supabase, 
            // tapi kita beri log agar tahu masalahnya.
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

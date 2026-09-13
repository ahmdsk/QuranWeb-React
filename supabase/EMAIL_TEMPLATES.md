# Supabase Email Templates for Quread

File ini menyimpan template email konfirmasi dan reset kata sandi dalam Bahasa Indonesia. Salin isi template ini ke **Supabase Dashboard -> Authentication -> Email Templates**.

---

## 1. Confirm Signup (Konfirmasi Pendaftaran)

- **Subject**:
  ```text
  Konfirmasi Pendaftaran Akun Quread
  ```

- **Body (HTML)**:
  ```html
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b;">
    <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #059669; font-size: 24px; font-weight: 800; margin: 0;">Quread</h1>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Aplikasi Al-Qur'an & Jadwal Shalat Digital</p>
      </div>

      <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Selamat Datang di Quread!</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
        Terima kasih telah mendaftar. Silakan klik tombol di bawah ini untuk mengonfirmasi email Anda dan mengaktifkan akun Anda:
      </p>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="{{ .ConfirmationURL }}" style="background-color: #059669; color: #ffffff; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; text-decoration: none; display: inline-block;">
          Konfirmasi Email Saya
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">
        Jika Anda tidak merasa mendaftar di Quread, silakan abaikan pesan email ini.
      </p>
    </div>
  </div>
  ```

---

## 2. Reset Password (Pemulihan Kata Sandi)

- **Subject**:
  ```text
  Permintaan Pemulihan Kata Sandi Quread
  ```

- **Body (HTML)**:
  ```html
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #1e293b;">
    <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #059669; font-size: 24px; font-weight: 800; margin: 0;">Quread</h1>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Pemulihan Kata Sandi Akun</p>
      </div>

      <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Reset Kata Sandi Anda</h2>
      <p style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
        Kami menerima permintaan untuk mereset kata sandi akun Quread Anda. Silakan klik tombol di bawah ini untuk membuat kata sandi baru:
      </p>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="{{ .ConfirmationURL }}" style="background-color: #059669; color: #ffffff; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; text-decoration: none; display: inline-block;">
          Buat Kata Sandi Baru
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">
        Jika Anda tidak meminta permintaan pemulihan ini, akun Anda tetap aman dan Anda dapat mengabaikan email ini.
      </p>
    </div>
  </div>
  ```

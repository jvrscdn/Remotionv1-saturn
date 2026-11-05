> **v3 (tema kosmik):** palet ungu dari logo Saturn X, latar galaksi permanen (satu kamera untuk seluruh video),
> logo sebagai hero di intro dan outro, cover album bertekstur, dan UI Spotify yang dirapikan.
> Aset ada di `public/` (logo-hero.jpg, bg-plate.jpg, planet.jpg, hero-half.jpg). Font Spotify memakai Figtree
> (padanan gratis terdekat untuk Circular).

# Saturn X Promo (Remotion)

Video promo 60 detik, 1920x1080, 30 fps. Arah visual: biru kobalt, emas Saturnus, tipografi besar, tanpa gradien
dan tanpa ikon emoji. Layar Telegram dan Mini App Spotify digambar ulang lewat kode (cover dan judul lagu fiktif,
tidak ada logo Spotify).

Struktur: intro (5 dtk), angka (5), 4 fitur umum (16), sorotan Spotify (22), grid command (5), penutup (7).

## Ubah isi

| Mau ubah | File |
|---|---|
| Naskah / subtitle | `src/captions.ts` |
| Angka 110+, 20+, 8 | `src/scenes/Stats.tsx` |
| Demo chat fitur umum | `src/scenes/Features.tsx` |
| Layar Spotify, judul lagu, lirik | `src/scenes/SpotifyScreens.tsx` |
| Warna | `src/theme.ts` |

Suara narasi dan musik (opsional): taruh `voice.mp3` dan/atau `music.mp3` di folder `public/`.
Render lokal otomatis memakainya kalau lo kasih `--props='{"voice":"voice.mp3","music":"music.mp3"}'`.
GitHub Actions mendeteksinya sendiri.

## Cara A: GitHub Actions (disarankan, tanpa install apa pun di HP)

Render jalan di server GitHub, gratis, sekitar 5-15 menit.

1. Buat akun di github.com, lalu repo baru (misal `saturn-x-promo`). Boleh private.
2. Upload project. Ada dua jalan:

   **Lewat Termux** (paling mudah karena folder `.github` ikut):
   ```bash
   pkg install -y git unzip
   termux-setup-storage
   cp ~/storage/shared/Download/saturn-x-promo.zip ~
   cd ~ && unzip saturn-x-promo.zip && cd saturn-x-promo
   git init -b main
   git add -A
   git commit -m "promo saturn x"
   git remote add origin https://github.com/USERNAME/saturn-x-promo.git
   git push -u origin main
   ```
   Saat diminta password, pakai Personal Access Token, bukan password akun:
   GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic) > Generate new token,
   centang `repo` dan `workflow`.

   **Lewat browser**: di repo klik Add file > Upload files, upload semua isi folder KECUALI `.github`.
   Lalu Add file > Create new file, di kolom nama ketik `.github/workflows/render.yml`
   (garis miring otomatis membuat folder), tempel isi file `render.yml`, Commit.

3. Buka tab **Actions**. Kalau muncul tombol "I understand my workflows, go ahead and enable them", klik.
4. Pilih **Render video promo** di sisi kiri, klik **Run workflow**, lalu **Run workflow** hijau.
5. Tunggu sampai centang hijau. Klik run-nya, scroll ke bagian **Artifacts**, ketuk `saturn-x-promo`
   untuk mengunduh zip berisi `saturn-x-promo.mp4`. Artifact disimpan 14 hari.

Kalau merah: buka run, klik step yang gagal, kirim teks error-nya ke Claude.

## Cara B: PC / laptop

```bash
npm install
npm run studio     # pratinjau interaktif
npm run render     # hasil: out/saturn-x-promo.mp4
```

## Cara C: Termux (proot Debian, lambat)

Remotion butuh Chromium glibc, jadi harus lewat Debian proot. Butuh ruang sekitar 4 GB. Render 1080p
bisa 30-90 menit. Pakai Termux dari F-Droid atau GitHub, bukan Play Store.

```bash
pkg update -y && pkg upgrade -y
pkg install -y proot-distro
termux-setup-storage
termux-wake-lock
proot-distro install debian
proot-distro login debian --shared-tmp --bind $HOME/storage/shared:/sdcard
```

Di dalam Debian:

```bash
apt update && apt install -y curl ca-certificates unzip ffmpeg chromium \
  fonts-inter fonts-noto-color-emoji fonts-liberation
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
cp /sdcard/Download/saturn-x-promo.zip ~ && cd ~ && unzip saturn-x-promo.zip && cd saturn-x-promo
npm install
export B=/usr/bin/chromium
npx remotion still src/index.ts SaturnXPromo out/tes.png --frame=1100 --browser-executable=$B --gl=swangle --concurrency=1
npx remotion render src/index.ts SaturnXPromo out/saturn-x-promo.mp4 --browser-executable=$B --gl=swangle --concurrency=1 --scale=0.67 --timeout=300000
cp out/saturn-x-promo.mp4 /sdcard/Download/
```

Kalau Android membunuh proses: Opsi Developer > "Nonaktifkan batasan proses anak", dan matikan optimasi baterai
untuk Termux. Font kustom (Bricolage Grotesque, DM Sans) diunduh Remotion dari Google Fonts, jadi butuh internet
saat render.

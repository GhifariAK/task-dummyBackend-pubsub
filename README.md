# Backend Pub/Sub (Create User) - Task Dummy Microservices

Repository ini adalah service yang khusus bertugas untuk menangani pembuatan User baru (_Create User_). Layanan ini menggunakan pola arsitektur _Publish-Subscribe_ (Pub/Sub) dengan `EventEmitter` bawaan Node.js untuk mengeksekusi _background task_.

## 💻 Tech Stack

- Node.js & Express.js
- Node.js `EventEmitter` (Pub/Sub)
- PostgreSQL (pg)

## ⚙️ Persyaratan (Environment Variables)

Tambahkan file `.env` di _root folder_ yang berisi _connection string_ ke database Azure PostgreSQL.

## 🚀 Cara Menjalankan Server

1. Install dependencies:
   ```bash
   npm install
   ```
2. Lalu jalankan :
   ```bash
   node server.js
   ```
3. Server akan berjalan pada Port 3001

## Daftar Endpoint & Parameter:

3. Create User (Pub/Sub Express)

- Endpoint: POST /api/pubsub/user
  Cara pakai (postman): Kirim data name dan email via tab Body -> raw (JSON).

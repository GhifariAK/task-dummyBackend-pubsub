const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json()); 

require('dotenv').config();
const pool = require('./db'); 

// Create User
app.post('/api/users', async (req, res) => {
    try {
        const { username, full_name, email_address, password } = req.body;

        if (!username || !full_name || !email_address || !password) {
            return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
        }

        // Query
        const query = `
                INSERT INTO tb_users (username, full_name, email_address, password, tenant_id, type, status_ad, create_at) 
                VALUES ($1, $2, $3, $4, 50, 1, 0, NOW()) 
                RETURNING *
        `;

        const values = [username, full_name, email_address, password];
        const newUser = await pool.query(query, values);

        console.log(`\n[CREATE SUKSES] -> User baru berhasil dibuat di database:`);
        console.log(newUser.rows[0]);

        // Balas FE kalau sudah sukses masuk DB
        res.status(201).json({ 
            success: true, 
            message: 'User berhasil dibuat!',
            data: newUser.rows[0]
        });
    } catch (err) {
        console.error(`\n[CREATE ERROR] -> Gagal membuat user:`, err.message);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
});

// Menjalankan server di port 3001 
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server Pub/Sub jalan di http://localhost:${PORT}`);
});
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json()); 

require('dotenv').config();
const pool = require('./db'); 

// SETUP PUBSUB (BACKGROUND TASK)
const EventEmitter = require('events');
const pubsub = new EventEmitter();

// SUBSCRIBER: Mengeksekusi query INSERT ke database
pubsub.on('create_user_event', async (userData) => {
    try {
        const { username, full_name, email_address, password } = userData;
        
        const query = `
            INSERT INTO tb_users (username, full_name, email_address, password, tenant_id, type, status_ad, create_at) 
            VALUES ($1, $2, $3, $4, 50, 1, 0, NOW()) 
            RETURNING *
        `;

        const values = [username, full_name, email_address, password];
        const newUser = await pool.query(query, values);
        
        console.log(`\n[SUBSCRIBER SUKSES] -> User baru berhasil dibuat di database:`);
        console.log(newUser.rows[0]);
    } catch (err) {
        console.error(`\n[SUBSCRIBER ERROR] -> Gagal membuat user:`, err.message);
    }
});

// PUBLISHER: Menerima request dari Frontend
app.post('/api/pubsub/user', (req, res) => {
    try {
        const { username, full_name, email_address, password } = req.body;

        if (!username || !full_name || !email_address || !password) {
            return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
        }

        // Publisher menyiarkan event beserta datanya ke Subscriber
        pubsub.emit('create_user_event', { username, full_name, email_address, password });

        // Publisher langsung membalas ke Frontend TANPA menunggu proses insert DB selesai
        res.json({ 
            success: true, 
            message: 'Request diterima! User sedang dibuat di background oleh Subscriber.' 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }
});

// Menjalankan server di port 3001 
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server Pub/Sub jalan di http://localhost:${PORT}`);
});
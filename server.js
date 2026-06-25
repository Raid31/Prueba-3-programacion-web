const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

//config conex base de datos
const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'prueba3'
});

//conex base de datos
db.connect(err => {
    if(err){
        console.error('error conenctando a la base de datos:', err);
        return;
    }
    console.log('conexion exitosa');
});

//endpoint para guardar datos del formulario
app.post('/api/guardar', (req, res) => {
    const{nombre, correo, artista_favorito, mensaje} = req.body;

    const sql = 'INSERT INTO formulario (nombre, correo, artista_favorito, mensaje) VALUES (?, ?, ?, ?)';

    db.query(sql, [nombre, correo, artista_favorito, mensaje], (err, result) => {
        if(err){
            console.error('error al guardar datos:', err);
            res.status(500).json({error: 'Error interno del servidor'});
        }
        res.status(200).json({message: 'Datos guardados exitosamente'});
    });
});

//endpoint para obtener datos del formulario
app.get('/api/cargar', (req, res) => {
    // Ordena por ID descendente y toma solo 1 (el último)
    const sql = 'SELECT  * FROM  formulario ORDER BY id DESC LIMIT 1';

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al obtener los datos:", err);
            return res.status(500).json({error: "error interno"});
        }
        if (result.length > 0){
            res.status(200).json(result[0]); //devuelve el último registro
        } else {
            res.status(404).json({ message: "No se encontraron datos" });
        }
    });
});

    // Endpoint para cargar el último dato
    app.get('/api/cargar', (req, res) => {
        const sql = 'SELECT * FROM formulario ORDER BY id DESC LIMIT 1';
        db.query(sql, (err, result) => {
            if (err) return res.status(500).json({ error: "Error interno" });
            if (result.length > 0) res.status(200).json(result[0]);
            else res.status(404).json({ message: "No hay datos" });
        });
    });

    //iniciar servidor
    const port = 3000;
app.listen(port, () => {
    console.log(`servidor corriendo en http://localhost:${port}`);
});
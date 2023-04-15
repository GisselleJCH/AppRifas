import express from 'express';
import { createPool } from 'mysql2/promise';

//ORM



const app = express();

//middlewares

app.use(express.json());

const PORT = process.env.PORT || 3000;

//DB Configuration
const DB_HOST = "localhost";
const DB_PORT = 3306;
const DB_USER = "root";
const DB_PASSWORD = "Educa2023*";
const DB_DATABASE = "apprifas";

const pool = createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
});


// EndPoints
//API RESTful

app.get('/',(req,res)=>{
    res.send("<h1>Hola</h1>");
})

app.get('/usuarios',async (req, res)=>{
    try{
        const [rows] = await pool.query(
            "SELECT idUsuario, nombreUsuario, fechaCreacion FROM usuarios");

        res.json(rows);
    } catch(error){
        console.error("Error",error);

        return res.status(500).json({message:"Error al procesar la solicitud"});
    }   
})

app.get('/usuarios/:nombreUsuario',async (req,res)=>{
    try {
        const { nombreUsuario }=req.params;

        const [rows]= await pool.query(
            "SELECT idUsuario, nombreUsuario, fechaCreacion FROM usuarios WHERE nombreUsuario = ?",[nombreUsuario]);

        if(rows.length==0){
            return res.status(404).json({message:"Usuario no encontrado"});
        }

        res.json(rows);

    } catch (error) {
        console.error("Error",error);

        return res.status(500).json({message:"Error al procesar la solicitud"});
    }
});

app.post('/usuarios',async (req,res)=>{
    try {
        const { nombreUsuario, password } = req.body;

        const [rows] = await pool.query(
            "INSERT INTO usuarios(idUsuario,nombreUsuario,password) VALUES (uuid(),?,?)",
            [nombreUsuario,password]
        );

        res.status(201).json({message:"Usuario Creado"});

    } catch (error) {
        console.error("Error",error);

        return res.status(500).json({message:"Error al procesar la solicitud"});
    }
})

app.put('/usuarios/:nombreUsuario',async (req,res)=>{
    try {
        const { nombreUsuario }=req.params;
        const { nuevoNombreUsuario, password } =req.body;

        const [result] = await pool.query(
            "UPDATE usuarios SET nombreUsuario = IFNULL(?,nombreUsuario), password = IFNULL(?,password) WHERE nombreUsuario = ?",
            [nuevoNombreUsuario,password,nombreUsuario]
        )

        if(result.affectedRows === 0 )
            return res.status(404).json({message: "Usuario no encontrado"});
        else
            res.json({message:"Datos guardados"});
        
        
        
    } catch (error) {
        console.error("Error",error);

        return res.status(500).json({message:"Error al procesar la solicitud"});
    }
})

app.delete("/usuarios/:nombreUsuario",async (req,res)=>{
    try {
        
        const {nombreUsuario}=req.params;

        const [rows] =await pool.query(
            "DELETE FROM usuarios WHERE nombreUsuario = ?",
            [nombreUsuario]
        );

        if(rows.affectedRows<=0){
            return res.status(404).json({message:"Usuario no encontrado"});
        }
        else
            res.status(204).json({ message:"Usuario eliminado"});

    } catch (error) {
        console.error("Error",error);

        return res.status(500).json({message:"Error al procesar la solicitud"});
    }
})


app.listen(PORT,()=>{
    console.log("Aplicacion corriendo en puerto",PORT);
})

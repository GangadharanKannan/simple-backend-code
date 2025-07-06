const { PrismaClient } = require('@prisma/client');
const express = require('express');
const {v4: uuidv4} = require("uuid")

const app = express();
const prisma = new PrismaClient();

app.use(express.json())

app.get("/hospital", async (req, res) => {
    try {
        const data = await prisma.hospital.findMany();

        res.status(200).json({ message: "Fetched all Data", data: data})
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"})
    }
})

app.get("/hospital/:patient_id", async (req,res) => {
    try {
        const { patient_id } = req.params;

        const reqData = await prisma.hospital.findUnique({
            where: {
                patient_id: patient_id
            }
        })

        res.status(200).json({ message: "Getting a single Data", data: reqData})
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"})
    }
})

app.post("/hospital", async (req,res) => {
    try {
        const data = req.body;

        const existing = await prisma.hospital.findFirst({
            where: {
                patient_name: data.patient_name
            }
        })

        if(existing){
           return res.status(404).json({ message: "Already Exist"})
        }

        const addData = await prisma.hospital.create({
            data: {
                patient_id: uuidv4(),
                patient_name: data.patient_name,
                disease: data.disease,
                address: data.address
            }
        })
        res.status(200).json({ message: "Added a data", data: addData})
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error",error: err})
    }
})

app.put("/hospital", async (req,res) => {
    try {
        const data = req.body;

        const updData = await prisma.hospital.update({
            where:{
                patient_id: data.patient_id
            },
            data: {
                patient_name: data.patient_name,
                disease: data.disease,
                address: data.address
            }
        })

        res.status(200).json({ message: "Updated a  Data", data: updData});
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"})
    }
})

app.delete("/hospital", async (req,res) => {
    try {
        const data = req.body;

        await prisma.hospital.delete({
            where: {
                patient_id: data.patient_id
            }
        })

        res.status(200).json({ message: "Deleted a data"})
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"})
    }
})
app.listen(5000);
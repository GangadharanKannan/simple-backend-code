const express = require("express");
const { PrismaClient } = require("@prisma/client")

const app = express();
app.use(express.json())

const prisma = new PrismaClient()

app.get("/student", async (req,res) => {
    try {
        //1. Data from Frontend

        //2. DB Logic
        const student = await prisma.student.findMany()
        //3. Data to Frontend
        res.status(200).json({ message: "Fetched a data", data: student})
    } catch (err) {
        res.status(500).json({ meassage: "Internal server Error"})
    }
})

app.get("/student/:student_id", async (req,res) => {
    try {
        //1. Data from Frontend
        const { student_id } = req.params
        //2. DB Logic
        const singleStudent = await prisma.student.findUnique({
            where:{
                student_id: student_id
            }
        })
        //3. Data to Frontend
        res.status(200).json({ message: "Fetched a Unique Student", data: singleStudent})
    } catch(err) {
        res.status(500).json({ message: "Internal Server Error"})
    }
})

app.post("/student", async (req,res) => {
    try {
        //1. Data from Frontend
        const data = req.body;
        //2. DB Logic
        const addStudent = await prisma.student.create({
            data: {
                student_name: data.student_name,
                grade: data.grade,
                blood_group: data.blood_group
            }
        })
        //3. Data to Frontend
        res.status(200).json({ message: "Added a Student", data: addStudent})
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"})
    }
})

app.put("/student", async (req,res) => {
    try {
        //1. Data from Frontend
        const data = req.body;
        //2. DB Logic
        const updStudent = await prisma.student.update({
            where: {
                student_id: data.student_id
            },
            data: {
                student_name: data.student_name,
                grade: data.grade,
                blood_group: data.blood_group
            }
        })
        //3. Data to Frontend
        res.status(200).json({ message: "Updated a Student", data: updStudent})
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"})
    }
})

app.delete("/student", async (req,res) => {
    try {
        //1. Data from Frontend
        const data = req.body;
        //2. DB Logic
        const delStudent = await prisma.student.delete({
            where: {
                student_id: data.student_id
            }
        })
        //3. Data to Frontend
        res.status(200).json({ message: "Deleted a Student"})
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"})
    }
})
app.listen(3000)
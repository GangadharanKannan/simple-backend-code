const { PrismaClient } = require('@prisma/client');
const express = require('express')

const prisma = new PrismaClient();
const app = express();

app.use(express.json())

app.get("/restaurant", async (req,res) => {
    try {
        const restaurant = await prisma.restaurant.findMany();

        res.status(200).json({
            message: "Fetched a Data",
            data: restaurant
        })
    } catch {
        res.status(500).json({ message: "Internal Server Error"})
    }
})

app.get("/restaurant/:restaurant_id", async (req,res) => {
    try {
        const { restaurant_id } = req.params;
        const oneRestaurant = await prisma.restaurant.findUnique({
            where: {
                restaurant_id: restaurant_id
            }
        })

        res.status(200).json({
            message: "Get Single a Data",
            data: oneRestaurant
        })
    } catch {
        res.status(500).json({ message: "Internal Server Error"})
    }
})

app.post("/restaurant", async (req,res) => {
    try {
        const data = req.body;

        const addRestaurant = await prisma.restaurant.create({
            data: {
                restaurant_id: data.restaurant_id,
                restaurant_name: data.restaurant_name,
                rating: data.rating,
                address: data.address
            }
        })
        res.status(200).json({ message: "Added a data", data: addRestaurant})
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"})
    }
})

app.put("/restaurant", async (req,res) => {
    try {
        const data = req.body;

        const updRestaurant = await prisma.restaurant.update({
            where: {
                restaurant_id: data.restaurant_id
            },
            data: {
                restaurant_name: data.restaurant_name,
                rating: data.rating,
                address: data.address
            }
        })
        res.status(200).json({ message: "Updated a data", data: updRestaurant})
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"})
    }
})

app.delete("/restaurant", async (req,res) => {
    try {
        const data = req.body;

        await prisma.restaurant.delete({
            where: {
                restaurant_id: data.restaurant_id
            }
        })
        res.status(200).json({ message: "Deleted a data"})
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error"})
    }
})


app.listen(3000)
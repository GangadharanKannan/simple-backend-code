const { PrismaClient } = require("@prisma/client");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();

const authmiddleware = (req,res,next) => {
  const data = req.headers.authorization.split(" ")[1];
  jwt.verify(data, 'temp-key', function(err, decoded) {
    if(err){
      res.status(400).json({ message: "Invalid token"})
    } else {
      next()
    }
  });
}

app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const data = req.body;

    const existing = await prisma.user.findUnique({
      where: {
        user_name: data.user_name,
      },
    });

    if (existing) {
      return res.status(401).json({ message: "User Already Exist" });
    }

    const hashedpass = await bcrypt.hash(data.password, 10);

    const addData = await prisma.user.create({
      data: {
        user_name: data.user_name,
        email: data.email,
        password: hashedpass,
      },
    });

    res.status(200).json({ message: "Added new user", data: addData });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const data = req.body;

    const checkdata = await prisma.user.findUnique({
      where: {
        user_name: data.user_name,
      },
    });

    if (checkdata) {
      const cmp = await bcrypt.compare(data.password, checkdata.password);

      if (cmp) {
        const temp_token = jwt.sign({ email: data.email }, 'temp-key',{ expiresIn: '1h' });
        const perm_token = jwt.sign({ email: data.email }, 'perm-key',{ expiresIn: '1d' });
        const token = {
            temp_token,perm_token
        }

        res.status(200).json({ message: "Login", token: token});
      } else {
        res.status(400).json({ message: "Incorrect Password"});
      }
    } else {
        res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/refresh", async (req, res) => {
    try {
        const data = req.body;
        
        jwt.verify(data.token, 'perm-key', function(err, decoded) {
          if(err){
            res.status(404).json({ message: "Invalid credentials"})
          } else {
            const temp_key = jwt.sign({ email: decoded.email }, 'temp-key',{ expiresIn: '1h' });
            res.status(200).json({ message:"new token", data: temp_key})
          }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Errpr"})
    }
})

app.get("/post", authmiddleware, (req,res) => {
  res.status(200).json({ message: "Accessed the post"})
})

app.listen(5000);

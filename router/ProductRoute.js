const express = require("express");
const {Product} = require("../dbHandler/createTabel");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const fileUpload = require("express-fileupload");
const verifyToken = require('../middleware.js')

router.use(fileUpload());

router.get("/products", async (req, res) => {
  try {
    const response = await Product.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const response = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/products", verifyToken, async (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No file uploaded" });

  const name = req.body.name;
  const stok = req.body.stok;
  const harga = req.body.harga;
  const category = req.body.category;

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid image" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Images must be less than 5MB" });

  file.mv(`./public/images/${fileName}`, async (error) => {
    if (error) return res.status(500).json({ msg: error.message });
    try {
      await Product.create({
        name: name,
        stok: stok,
        harga: harga,
        category: category,
        image: fileName,
        url: url,
      });
      res.status(201).json({ msg: "produk creates successfully" });
    } catch (error) {
      console.log(error.message);
    }
  });
});

router.patch("/products/:id", verifyToken, async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!product) return res.status(404).json({ msg: "No Data Found" });

  let fileName = product.image;

  if (req.files !== null) {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid image" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Images must be less than 5MB" });
    const filepathToDelete = `./public/images/${product.image}`;
    if (fs.existsSync(filepathToDelete)) {
      fs.unlinkSync(filepathToDelete);
    }
    file.mv(`./public/images/${fileName}`, (error) => {
      if (error) return res.status(500).json({ msg: error.message });
    });
  }

  const name = req.body.name;
  const stok = req.body.stok;
  const harga = req.body.harga;
  const category = req.body.category;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    await Product.update(
      {
        name: name,
        stok: stok,
        harga: harga,
        category: category,
        image: fileName,
        url: url,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Product Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

router.delete("/products/:id", verifyToken, async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!product) {
    return res.status(404).json({ msg: "No Data Found" });
  }
  try {
    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);

    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ msg: "Product Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;

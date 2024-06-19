const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const Groq = require("groq-sdk");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });
const groq = new Groq({
  apiKey: "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",
});

const getGroqChatCompletion = async (text) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `${text} Convert the following text into a JSON file format:`,
      },
    ],
    model: "llama3-8b-8192",
  });
};

app.post("/get-text", upload.single("file"), async (req, res) => {
  try {
    const data = await pdfParse(req.file.buffer);

    const sumJson = await getGroqChatCompletion(data.text);

    res.status(200).json({
      status: "sucess",
      text: sumJson.choices[0]?.message?.content || "",
    });
  } catch (error) {
    res.status(500).send("Error parsing PDF");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

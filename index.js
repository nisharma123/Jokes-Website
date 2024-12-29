import express from "express"
import axios from "axios"

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/joke/";


app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.render("index.ejs")
  });

app.get("/submit", async (req, res) => {
  try {
    let apiUrl = API_URL;
    const categories = req.query.categories || "Any";
    var categoriesUpperCase = categories.slice(0, 1);
    var categoriesLen = categories.length
    var newName = categoriesUpperCase.toUpperCase() + categories.slice(1, categoriesLen)
    const blacklistFlags = req.query.blacklistFlags;
    const amount = req.query.amount || 1;

    if (newName) {
      apiUrl += newName;
    }
    
    if (blacklistFlags) {
      apiUrl += (newName ? "&" : "?") + `blacklistFlags=${blacklistFlags}`; 
    }
    
    if (amount < 1) {
      apiUrl += (newName || blacklistFlags) ? "&" : "?" + `amount=${amount}`; 
    }

    apiUrl += "?format=txt";
    
    const response = await axios.get(apiUrl);
    console.log(response.data); 

    if (response.status === 200) {
      res.render("joke.ejs", {
        url: apiUrl, 
        categories: categories, 
        blacklistFlags: blacklistFlags, 
        amount: amount, 
        joke: response.data,
      });
    } else {
      throw new Error(`Request failed with status code ${response.status}`); 
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching joke: " + error.message); 
  }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

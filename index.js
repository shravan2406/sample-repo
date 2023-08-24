const express = require("express");
const http = require("https");

const app = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.post("/repositories/:owner/:repository/commits/:oid", (req, res) => {
    const owner = req.params['owner'];
    const repository = req.params['repository'];
    const commitId = req.params['oid'];
    const options = {
        hostname : ` https://api.github.com/`,
        path: `repos/${owner}/${repository}/commits/${oid}`,
        method: "GET"
    }
    
    const commitDescription = http.request(options, response => {
        console.log(response);
    });
    commitDescription.setHeader(Authorization, "Bearer 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");
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});


//API token = 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
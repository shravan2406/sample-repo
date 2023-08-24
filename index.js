const express = require("express");
const https = require("https"); 

const app = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended : true}));

//Api description for getting the commit details for a certain ref
app.get("/repositories/:owner/:repository/commits/:oid", async (req, res) => {
    //Extracting the required params from the api url to use in external api
    const owner = req.params['owner'];
    const repository = req.params['repository'];
    const commitId = req.params['oid'];
    const headers = {
        "Authorization": "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",
        'Accept': "application/json",
        "User-Agent" : "sample-app"
    }
    const options = {
        hostname: "api.github.com",
        path: `/repos/${owner}/${repository}/commits/${commitId}`,
        method: "GET",
        headers: headers
    };
    let commitDescription={};
    try {
    const request = await https.request(options, response => {
        let responseData = "";
        //Stitching data from response chunks
        response.on('data', (chunk) => {
            responseData += chunk;
        });
        response.on('end', () => {
            jsonData = JSON.parse(responseData);
            commitDescription = {
                oid: jsonData.sha,
                message: jsonData.message,
                author: jsonData.commit.author,
                committer: jsonData.commit.committer,
                parents: jsonData.parents
            };
            return res.status(200).json({
                data : commitDescription
            })
        });
    });
    request.end();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "There seems to be an error while fetching commit information",
            error
        })
    }
});

app.get("/repositories/:owner/:repository/commits/:oid/diff", async (req, res) => {
    const owner = req.params['owner'];
    const repository = req.params['repository'];
    const commitId = req.params['oid'];
    const headers = {
        "Authorization": "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",
        'Accept': "application/json",
        "User-Agent" : "sample-app"
    }
    const options = {
        hostname: "api.github.com",
        path: `/repos/${owner}/${repository}/compare/${commitId}~1...${commitId}`,
        method: "GET",
        headers: headers
    };
    try {
    let currentReq = await https.request(options, response => {
        let currentdata = '';
        response.on('data', (chunk) => {
            currentdata += chunk;
        });
        
        response.on('end', () => {
            let jsonData = JSON.parse(currentdata);
            console.log(jsonData);
            res.status(200).json({
                data : jsonData
            })
            currentOid = jsonData.sha;
        });
    });
    currentReq.end();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "There seems to be an error while fetching commit information",
            error
        })
    }
    
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

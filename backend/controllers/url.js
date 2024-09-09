const shortid = require('shortid');
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: "URL is required!" });
    }

    const shortID = shortid();

    try {
        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
        });

        return res.render("index", {
            id: shortID,
        });
    } catch (error) {
        console.error("Error creating short URL:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  }

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
};

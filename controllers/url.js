const shortid = require("shortid");
const URL = require("../models/url");


async function handleGenerateNewShortURL(req, res) {
    const shortID = shortid.generate();
    const body = req.body;

    if (!body.url) return res.status(400).json({ error: "URL is required" });

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

    // Redirect to home page with `id` as a query parameter
    res.redirect(`/?id=${shortID}`);
}
    // return res.json({ id: shortID }); // Use `shortID` here to match the variable created above

async function handleGetAnalytics (req, res) {
    const shortId = req.params.shortId;
    const result = await URL. findOne({ shortId });
    return res.json({
        totalClicks: result.visitHistory. length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortURL,handleGetAnalytics,
};

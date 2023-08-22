const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  const urls = Array.isArray(url) ? url : [url];

  const responses = await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await axios.get(url);
        return response.data.numbers || [];
      } catch (error) {
        console.error(`Error fetching ${url}: ${error.message}`);
        return [];
      }
    })
  );

  const mergedNumbers = responses.reduce((merged, numbers) => {
    return [...merged, ...numbers];
  }, []);

  const uniqueNumbers = Array.from(new Set(mergedNumbers)).sort((a, b) => a - b);

  res.json({ numbers: uniqueNumbers });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

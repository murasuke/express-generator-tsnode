import axios from 'axios';
import express from 'express';
var router = express.Router();

const API_KEY = 'e9e375651c4bbb41c956f670fd2a278a';
// http://api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key}
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

/* GET weather. */
router.get('/:zip', async(req, res) => {
  const zip = req.params.zip;
  const url = `${BASE_URL}?zip=${zip},${'jp'}&appid=${API_KEY}`;
  try{
    const result = await axios.get(url);
    console.log(JSON.stringify(result.data, null, '  '));
    res.json(result.data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
export default router;

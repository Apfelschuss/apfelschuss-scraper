import dotenv from 'dotenv';
import { scrapeSocialMedia } from './scraping-bot/scrapeSocialMedia';

dotenv.config();

const username = process.env.SCRAPINGBOT_USERNAME;
const apiKey = process.env.SCRAPINGBOT_API_KEY;
const auth = 'Basic ' + Buffer.from(username + ':' + apiKey).toString('base64');

scrapeSocialMedia({
  params: {
    auth,
    scraper: 'facebookOrganization',
    url: 'https://www.facebook.com/stromfressergesetznein',
  },
})
  .then((result) => {
    console.log('Tries:', result.numOfTries.toString());
    console.log('Final Data:', result.data);
  })
  .catch((error) => {
    console.error(error);
  });

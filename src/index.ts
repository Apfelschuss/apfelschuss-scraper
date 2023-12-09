import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface ResponseData {
  responseId: string;
}

const username = process.env.SCRAPINGBOT_USERNAME;
const apiKey = process.env.SCRAPINGBOT_API_KEY;
const apiEndPoint = 'http://api.scraping-bot.io/scrape/data-scraper';
const auth = 'Basic ' + Buffer.from(username + ':' + apiKey).toString('base64');

async function scrape() {
  try {
    const response = await axios.post(
      apiEndPoint,
      {
        scraper: 'linkedinCompanyProfile',
        url: 'https://linkedin.com/company/google',
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: auth,
        },
      },
    );
    console.log(JSON.stringify(response.data, null, 2));

    const data = response.data as ResponseData;

    const responseUrl =
      'http://api.scraping-bot.io/scrape/data-scraper-response?scraper=linkedinCompanyProfile&responseId=' +
      data.responseId;
    const finalResponse = await axios.get(responseUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: auth,
      },
    });
    return finalResponse.data as string;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

scrape()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });

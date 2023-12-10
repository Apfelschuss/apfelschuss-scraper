import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface ResponseData {
  responseId: string;
}

interface FinalResponseData {
  status: string;
  message: string;
}

const username = process.env.SCRAPINGBOT_USERNAME;
const apiKey = process.env.SCRAPINGBOT_API_KEY;
const apiEndPoint = 'http://api.scraping-bot.io/scrape/data-scraper';
const auth = 'Basic ' + Buffer.from(username + ':' + apiKey).toString('base64');

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function scrape() {
  try {
    const response = await axios.post(
      apiEndPoint,
      {
        scraper: 'linkedinCompanyProfile',
        url: 'https://linkedin.com/company/sintio',
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: auth,
        },
      },
    );
    console.log(JSON.stringify(response.data, null, 2));

    let finalData: FinalResponseData | null;
    let loopCount: number = 0;

    const data = response.data as ResponseData;

    do {
      await sleep(1000);
      const responseUrl =
        'http://api.scraping-bot.io/scrape/data-scraper-response?scraper=linkedinCompanyProfile&responseId=' +
        data.responseId;
      const finalResponse = await axios.get(responseUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: auth,
        },
      });
      loopCount++;
      finalData = finalResponse.data as FinalResponseData;
    } while (finalData == null || finalData.status === 'pending');

    return { finalData, loopCount };
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
    if (typeof result === 'string') {
      console.log('Error:', result);
    } else {
      console.log('Tries:', result.loopCount.toString());
      console.log('Final Data:', result.finalData);
    }
  })
  .catch((error) => {
    console.error(error);
  });

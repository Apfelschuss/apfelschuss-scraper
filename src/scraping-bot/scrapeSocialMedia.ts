import axios from 'axios';
import { sleep } from '../lib/helper';

interface Props {
  params: {
    auth: string; // 'Basic ' + Buffer.from(username + ':' + apiKey).toString('base64');
    scraper: string; // 'linkedinCompanyProfile'
    url?: string; // 'https://linkedin.com/company/sintio'
    account?: string; // 'sintio'
  };
}

interface ResponseData {
  responseId: string;
}

interface FinalResponseData {
  status: string;
  message: string;
}

export async function scrapeSocialMedia({ params: { auth, scraper, url, account } }: Props) {
  try {
    const response = await axios.post(
      'http://api.scraping-bot.io/scrape/data-scraper',
      {
        scraper,
        url,
        account,
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: auth,
        },
      },
    );

    const scraperInit = response.data as ResponseData;

    let data: FinalResponseData | null;
    let numOfTries: number = 0;

    do {
      await sleep(1000);
      const responseUrl =
        'http://api.scraping-bot.io/scrape/data-scraper-response?scraper=' +
        scraper +
        '&responseId=' +
        scraperInit.responseId;
      console.log('Response URL:', responseUrl);
      const finalResponse = await axios.get(responseUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: auth,
        },
      });
      numOfTries++;
      console.log('Tries:', numOfTries.toString());
      data = finalResponse.data as FinalResponseData;
    } while (data == null || data.status === 'pending');

    return { data, numOfTries };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    } else {
      throw error;
    }
  }
}

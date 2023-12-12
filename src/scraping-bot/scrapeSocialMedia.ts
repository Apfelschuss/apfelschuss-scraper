import axios from 'axios';
import { sleep } from '../lib/helper';

interface Props {
  params: {
    auth: string; // 'Basic ' + Buffer.from(username + ':' + apiKey).toString('base64');
    scraperType: string; // 'linkedinCompanyProfile'
    urlToScrap: string; // 'https://linkedin.com/company/sintio'
  };
}

interface ResponseData {
  responseId: string;
}

interface FinalResponseData {
  status: string;
  message: string;
}

export async function scrapeSocialMedia({ params: { auth, scraperType, urlToScrap } }: Props) {
  try {
    const response = await axios.post(
      'http://api.scraping-bot.io/scrape/data-scraper',
      {
        scraper: scraperType,
        url: urlToScrap,
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
        scraperType +
        '&responseId=' +
        scraperInit.responseId;
      const finalResponse = await axios.get(responseUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: auth,
        },
      });
      numOfTries++;
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

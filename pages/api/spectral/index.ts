import { NextApiRequest, NextApiResponse } from "next";
import ky from "ky";

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (_req.method === "POST") {
      // get list of wallets
      const wallets = _req.body.wallets as string[];

      // setup authorization header
      const api = ky.extend({
        hooks: {
          beforeRequest: [
            (request) => {
              request.headers.set(
                "Authorization",
                `Bearer ${process.env.SPECTRAL_KEY}`
              );
            },
          ],
        },
      });

      // make post request to spectral
      wallets.forEach((wallet) => {
        api.post(
          `https://api.spectral.finance/api/v1/addresses/${wallet}/calculate_score`
        );
      });

      // HACK: wait 3 seconds before attempting to get the wallet info from spectral
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const walletInfos: { [wallet: string]: unknown } = {};

      // make get requests to spectral
      wallets.forEach(async (wallet) => {
        const walletInfo = await api
          .get(`https://api.spectral.finance/api/v1/addresses/${wallet}`)
          .json();
        walletInfos.wallet = walletInfo;
      });

      console.log({ wallets, walletInfos });

      res.status(200).json(walletInfos);
    }
    // Do nothing on any other HTTP method
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;

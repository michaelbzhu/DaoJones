import { NextApiRequest, NextApiResponse } from "next";
import ky from "ky";

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  console.log("spectral api call");
  try {
    if (_req.method === "POST") {
      // get list of wallets
      const wallets = JSON.parse(_req.body).wallets as string[];
      console.log("wallets", wallets);

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

      var walletScheduleScorePromises = [];
      // make post request to spectral
      wallets.forEach((wallet) => {
        walletScheduleScorePromises.push(
          api
            .post(
              `https://api.spectral.finance/api/v1/addresses/${wallet}/calculate_score`
            )
            .then(() => {
              console.log("success", wallet);
            })
            .catch((err) => {
              console.log("error", { wallet, err });
            })
        );
      });

      await Promise.all(walletScheduleScorePromises);

      console.log("made post reqs to ", wallets);

      // HACK: wait 3 seconds before attempting to get the wallet info from spectral
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const walletGetInfoPromises = [];
      const walletInfos: { [wallet: string]: unknown } = {};

      // make get requests to spectral
      wallets.forEach((wallet) => {
        walletGetInfoPromises.push(
          api
            .get(`https://api.spectral.finance/api/v1/addresses/${wallet}`)
            .json()
            .then((walletInfo) => {
              console.log({ wallet, walletInfo });
              walletInfos.wallet = walletInfo;
            })
        );
      });

      await Promise.all(walletGetInfoPromises);

      console.log({ wallets, walletInfos });

      res.status(200).json({ wallets, walletInfos });
    }
    // Do nothing on any other HTTP method
  } catch (err: any) {
    console.log("failed");
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;

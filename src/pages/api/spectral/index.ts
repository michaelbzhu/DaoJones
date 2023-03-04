import { NextApiRequest, NextApiResponse } from "next";
import ky from "ky";
import { scheduleSpectralScores } from "../../../../utils/scheduleSpectralScores";
import { getSpectralScores } from "../../../../utils/getSpectralScores";

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  // console.log("spectral api call");
  try {
    if (_req.method === "POST") {
      // get list of wallets
      const wallets = JSON.parse(_req.body).wallets as string[];
      // console.log("wallets", wallets);

      await scheduleSpectralScores({ wallets });

      // console.log("made post reqs to ", wallets);

      // HACK: wait 3 seconds before attempting to get the wallet info from spectral
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const walletInfos = await getSpectralScores({ wallets });

      console.log("success-----------------", { wallets, walletInfos });

      res.status(200).json({ wallets, walletInfos });
    }
    // Do nothing on any other HTTP method
  } catch (err: any) {
    console.log("failed------------------", err);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;

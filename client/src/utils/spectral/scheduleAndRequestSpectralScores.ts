import { getSpectralScores } from "./getSpectralScores";
import { scheduleSpectralScores } from "./scheduleSpectralScores";

export const scheduleAndRequestSpectralScores = async ({
  wallets,
}: {
  wallets: string[];
}) => {
  try {
    // console.log("wallets", wallets);

    await scheduleSpectralScores({ wallets });

    // console.log("made post reqs to ", wallets);

    // HACK: wait 3 seconds before attempting to get the wallet info from spectral
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const walletInfos = await getSpectralScores({ wallets });

    console.log("success-----------------", { wallets, walletInfos });

    return { walletInfos };
  } catch (err: any) {
    console.log("failed------------------", err);
  }
};

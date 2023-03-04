import { getAuthedSpectralApi } from "./getAuthedSpectralApi";

/**
 *
 * @param wallets string[] containing list of wallet address
 * @returns string[] list of wallet addresses who have been successfully scheduled for MACRO score calculation on spectral
 */
export const scheduleSpectralScores = async ({
  wallets,
}: {
  wallets: string[];
}): Promise<string[]> => {
  const api = getAuthedSpectralApi();

  var walletScheduleScorePromises: unknown[] = [];
  var successfullyScheduledWallets: string[] = [];
  // make post request to spectral
  wallets.forEach((wallet) => {
    walletScheduleScorePromises.push(
      api
        .post(
          `https://api.spectral.finance/api/v1/addresses/${wallet}/calculate_score`
        )
        .then(() => {
          console.log("success", wallet);
          successfullyScheduledWallets.push(wallet);
        })
        .catch((err) => {
          // console.log("error", { wallet, err });
        })
    );
  });

  await Promise.all(walletScheduleScorePromises);
  return successfullyScheduledWallets;
};

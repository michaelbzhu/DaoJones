import { getAuthedSpectralApi } from "./getAuthedSpectralApi";

// spectral api return object
// walletInfos: {
//     '0xbbF183972487410abdcD76f53f89406c226Cc8E9': {
//       probability_of_liquidation: '65.01',
//       risk_level: 'HIGH_RISK',
//       score: '579.00',
//       score_ingredients: [Object],
//       score_timestamp: '2023-03-04T02:32:09.050932Z',
//       status: 'processing',
//       wallet_address: '0xbbF183972487410abdcD76f53f89406c226Cc8E9'
//     }
//   }

type SpectralWalletInfoWithScore = {
  probability_of_liquidation: string;
  risk_level: string;
  score: string;
  score_ingredients: object;
  score_timestamp: string;
  status: string;
  wallet_address: string;
};

// type SpectralWalletInfoWithoutScore = {
//   status: string;
//   wallet_address: string;
// };

/**
 *
 * @param wallets string[] list of wallets to request spectral for information
 * @returns map of of wallet --> spectral metadata objects
 */
export const getSpectralScores = async ({
  wallets,
}: {
  wallets: string[];
}): Promise<{ [wallet: string]: SpectralWalletInfoWithScore }> => {
  const spectralPromises = [];
  const walletInfos: { [wallet: string]: SpectralWalletInfoWithScore } = {};

  const api = getAuthedSpectralApi();

  // make get requests to spectral
  wallets.forEach((wallet) => {
    spectralPromises.push(
      api
        .get(`https://api.spectral.finance/api/v1/addresses/${wallet}`)
        .json()
        .then((walletInfo) => {
          //   console.log("spectral/index single wallet -------------------", {
          //     wallet,
          //     walletInfo,
          //   });
          if ((walletInfo as object).hasOwnProperty("score")) {
            walletInfos[wallet] = walletInfo as SpectralWalletInfoWithScore;
          }
        })
    );
  });

  await Promise.all(spectralPromises);
  return walletInfos;
};

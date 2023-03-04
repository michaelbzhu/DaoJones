import ky from "ky";

/**
 * get a ky api object that has already setup the auth header with the spectral api key
 */
export const getAuthedSpectralApi = () => {
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
  return api;
};

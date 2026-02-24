require("dotenv").config();
const axios = require("axios");

let cachedToken = null;
let tokenExpiration = null;

async function getAccessToken() {
  const now = Date.now();

  // Se já existe token válido, retorna ele
  if (cachedToken && tokenExpiration && now < tokenExpiration) {
    return cachedToken;
  }

  // Caso contrário, gera um novo
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", "l728a221269f0c4b5e8dc81b5d68aab908");
  params.append("client_secret", "12215ca4e6164f71b380f6a8c6a3c4c9");

  const response = await axios.post(
    "https://apigtwb2c.us.dell.com/auth/oauth/v2/token",
    params,
  );

  cachedToken = response.data.access_token;

  // Expira em 1 hora
  tokenExpiration = now + response.data.expires_in * 1000;

  return cachedToken;
}

exports.getWarrantyInfo = async function (serviceTag) {
  const token = await getAccessToken();

  console.log("Using Token:", token);

  const url = `https://apigtwb2c.us.dell.com/PROD/sbil/eapi/v5/asset-entitlements/?servicetags=${serviceTag}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  return response.data;
};

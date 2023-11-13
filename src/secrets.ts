import InfisicalClient from "infisical-node";

const infisicalClient = new InfisicalClient({
  token: process.env.INFISICAL_TOKEN,
  siteURL: "https://secrets.fascinated.cc",
});

export default infisicalClient;

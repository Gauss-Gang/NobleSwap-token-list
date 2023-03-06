import fs from "fs";
import path from "path";
import { version as nobleswapGILVersion } from "../lists/nobleswap-gil.json";
import { version as nobleswapGILTop15Version } from "../lists/nobleswap-gil-top-15.json";
import { version as nobleswapGILTop100Version } from "../lists/nobleswap-gil-top-100.json";
import { version as coingeckoVersion } from "../lists/coingecko.json";
import { version as cmcVersion } from "../lists/cmc.json";
import nobleswapGIL from "./tokens/nobleswap-gil.json";
import nobleswapGILTop100 from "./tokens/nobleswap-gil-top-100.json";
import nobleswapGILTop15 from "./tokens/nobleswap-gil-top-15.json";
import coingecko from "./tokens/coingecko.json";
import cmc from "./tokens/cmc.json";

export enum VersionBump {
  "major" = "major",
  "minor" = "minor",
  "patch" = "patch",
}

type Version = {
  major: number;
  minor: number;
  patch: number;
};

const lists = {
  "nobleswap-gil": {
    list: nobleswapGIL,
    name: "NobleSwap GIL",
    keywords: ["nobleswap", "gil"],
    logoURI: "https://nobleswap.io/logo.png",
    sort: false,
    currentVersion: nobleswapGILVersion,
  },
  "nobleswap-gil-top-100": {
    list: nobleswapGILTop100,
    name: "NobleSwap GIL Top 100",
    keywords: ["NobleSwap", "gil", "top 100"],
    logoURI: "https://nobleswap.io/logo.png",
    sort: true,
    currentVersion: nobleswapGILTop100Version,
  },
  "nobleswap-gil-top-15": {
    list: nobleswapGILTop15,
    name: "NobleSwap GIL Top 15",
    keywords: ["NobleSwap", "gil", "top 15"],
    logoURI: "https://nobleswap.io/logo.png",
    sort: true,
    currentVersion: nobleswapGILTop15Version,
  },
  coingecko: {
    list: coingecko,
    name: "CoinGecko",
    keywords: ["defi"],
    logoURI:
      "https://www.coingecko.com/assets/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png",
    sort: true,
    currentVersion: coingeckoVersion,
  },
  cmc: {
    list: cmc,
    name: "CoinMarketCap",
    keywords: ["defi"],
    logoURI: "https://ipfs.io/ipfs/QmQAGtNJ2rSGpnP6dh6PPKNSmZL8RTZXmgFwgTdy5Nz5mx",
    sort: true,
    currentVersion: cmcVersion,
  }
};

const getNextVersion = (currentVersion: Version, versionBump?: VersionBump) => {
  const { major, minor, patch } = currentVersion;
  switch (versionBump) {
    case VersionBump.major:
      return { major: major + 1, minor, patch };
    case VersionBump.minor:
      return { major, minor: minor + 1, patch };
    case VersionBump.patch:
    default:
      return { major, minor, patch: patch + 1 };
  }
};

export const buildList = (listName: string, versionBump?: VersionBump) => {
  const { list, name, keywords, logoURI, sort, currentVersion, schema } = lists[listName];
  const version = getNextVersion(currentVersion, versionBump);
  return {
    name,
    timestamp: new Date().toISOString(),
    version,
    logoURI,
    keywords,
    // @ts-ignore
    schema,
    // sort them by symbol for easy readability (not applied to default list)
    tokens: sort
      ? list.sort((t1, t2) => {
          if (t1.chainId === t2.chainId) {
            // CAKE first in extended list
            if ((t1.symbol === "NOBLE") !== (t2.symbol === "NOBLE")) { /// Replaced CAKE with NOBLE
              return t1.symbol === "NOBLE" ? -1 : 1;
            }
            return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
          }
          return t1.chainId < t2.chainId ? -1 : 1;
        })
      : list,
  };
};

export const saveList = (tokenList, listName: string): void => {
  const tokenListPath = `${path.resolve()}/lists/${listName}.json`;
  const stringifiedList = JSON.stringify(tokenList, null, 2);
  fs.writeFileSync(tokenListPath, stringifiedList);
  console.info("Token list saved to ", tokenListPath);
};

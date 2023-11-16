import fs from "fs";
import path from "path";
import { getAddress } from "@ethersproject/address";
import nobleswapGAUSS from "./tokens/nobleswap-gauss.json";
import nobleswapGIL from "./tokens/nobleswap-gil.json";
import nobleswapGILTop100 from "./tokens/nobleswap-gil-top-100.json";
import nobleswapGILTop15 from "./tokens/nobleswap-gil-top-15.json";
import coingecko from "./tokens/coingecko.json";
import cmc from "./tokens/cmc.json";

const lists = {
  "nobleswap-gauss": nobleswapGAUSS,
  "nobleswap-gil": nobleswapGIL,
  "nobleswap-gil-top-100": nobleswapGILTop100,
  "nobleswap-gil-top-15": nobleswapGILTop15,
  coingecko,
  cmc,
};

const checksumAddresses = (listName: string): void => {
  let badChecksumCount = 0;
  const listToChecksum = lists[listName];
  const updatedList = listToChecksum.reduce((tokenList, token) => {
    const checksummedAddress = getAddress(token.address);
    if (checksummedAddress !== token.address) {
      badChecksumCount += 1;
      const updatedToken = { ...token, address: checksummedAddress };
      return [...tokenList, updatedToken];
    }
    return [...tokenList, token];
  }, []);

  if (badChecksumCount > 0) {
    console.info(`Found and fixed ${badChecksumCount} non-checksummed addreses`);
    const tokenListPath = `${path.resolve()}/src/tokens/${listName}.json`;
    console.info("Saving updated list to ", tokenListPath);
    const stringifiedList = JSON.stringify(updatedList, null, 2);
    fs.writeFileSync(tokenListPath, stringifiedList);
    console.info("Checksumming done!");
  } else {
    console.info("All addresses are already checksummed");
  }
};

export default checksumAddresses;

import srcGIL from "./tokens/nobleswap-gil.json";
import srcTop100 from "./tokens/nobleswap-gil-top-100.json";
import srcTop15 from "./tokens/nobleswap-gil-top-15.json";
import srcCoingecko from "./tokens/coingecko.json";
import srcCmc from "./tokens/cmc.json";
import nobleGilList from "../lists/nobleswap-gil.json";
import top15List from "../lists/nobleswap-gil-top-15.json";
import top100tList from "../lists/nobleswap-gil-top-100.json";
import coingeckoList from "../lists/coingecko.json";
import cmcList from "../lists/cmc.json";

const lists = [
  {
    name: "nobleswap-gil",
    src: srcGIL,
    actual: nobleGilList,
  },
  {
    name: "nobleswap-gil-top-15",
    src: srcTop15,
    actual: top15List,
  },
  {
    name: "nobleswap-gil-top-100",
    src: srcTop100,
    actual: top100tList,
  },
  {
    name: "coingeckoList",
    src: srcCoingecko,
    actual: coingeckoList,
  },
  {
    name: "cmcList",
    src: srcCmc,
    actual: cmcList,
  },
];

const compareLists = (listPair) => {
  const { name, src, actual } = listPair;
  if (src.length !== actual.tokens.length) {
    throw Error(
      `List ${name} seems to be not properly regenerated. Soure file has ${src.length} tokens but actual list has ${actual.tokens.length}. Did you forget to run yarn makelist?`
    );
  }
  src.sort((t1, t2) => (t1.address < t2.address ? -1 : 1));
  actual.tokens.sort((t1, t2) => (t1.address < t2.address ? -1 : 1));
  src.forEach((srcToken, index) => {
    if (JSON.stringify(srcToken) !== JSON.stringify(actual.tokens[index])) {
      throw Error(
        `List ${name} seems to be not properly regenerated. Tokens from src/tokens directory don't match up with the final list. Did you forget to run yarn makelist?`
      );
    }
  });
};

/**
 * Check in CI that author properly updated token list
 * i.e. not just changed token list in src/tokens but also regenerated lists with yarn makelist command.
 * Github Action runs only on change in src/tokens directory.
 */
const ciCheck = (): void => {
  lists.forEach((listPair) => {
    compareLists(listPair);
  });
};

export default ciCheck;

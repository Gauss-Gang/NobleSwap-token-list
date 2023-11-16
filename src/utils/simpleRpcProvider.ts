import { ethers } from "ethers";

const RPC_URL = "https://rpc.gaussgang.com";

const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(RPC_URL, 1777);

export default simpleRpcProvider;

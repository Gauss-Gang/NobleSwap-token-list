import { ethers } from "ethers";

const RPC_URL = "https://rpc.giltestnet.com";

const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(RPC_URL, 4242);

export default simpleRpcProvider;

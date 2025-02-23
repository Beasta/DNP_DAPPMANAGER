import { ChainData } from "../../types";
import { ChainDriver } from "@dappnode/dappnodesdk";

export interface Chain {
  dnpName: string; // geth.dnp.dappnode.eth
  api: string; // http://geth.dappnode:8545
  driverName: ChainDriver; // ethereum
}

export type ChainDataResult = Omit<ChainData, "dnpName">;

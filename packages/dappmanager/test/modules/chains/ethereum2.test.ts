import "mocha";
import { expect } from "chai";
import { ChainDataResult } from "../../../src/modules/chains/types";
import { parseNodeSyncingResponse } from "../../../src/modules/chains/drivers/ethereum2";

describe("Watchers > chains > ethereum2Prysm", () => {
  describe("parseEthereum2PrysmState", () => {
    it("Should parse a syncing state", () => {
      const chainData = parseNodeSyncingResponse({
        data: {
          head_slot: "2310476",
          sync_distance: "1",
          is_syncing: false
        }
      });

      const expecteChainData: ChainDataResult = {
        syncing: false,
        error: false,
        message: "Synced #2310476"
      };

      expect(chainData).to.deep.equal(expecteChainData);
    });

    it("Should parse a syncing state", () => {
      const chainData = parseNodeSyncingResponse({
        data: {
          head_slot: "134030",
          sync_distance: "2179666",
          is_syncing: true
        }
      });
      const expecteChainData: ChainDataResult = {
        syncing: true,
        error: false,
        message: "Blocks synced 134030 / 2313696",
        progress: 0.05792895868774463
      };

      expect(chainData).to.deep.equal(expecteChainData);
    });

    it("Should parse a synced state", () => {
      const chainData = parseNodeSyncingResponse({
        data: {
          head_slot: "696",
          sync_distance: "2311112",
          is_syncing: true
        }
      });

      const expecteChainData: ChainDataResult = {
        syncing: true,
        error: false,
        message: "Blocks synced 696 / 2311808",
        progress: 0.00030106306406068326
      };

      expect(chainData).to.deep.equal(expecteChainData);
    });
  });
});

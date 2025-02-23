import "mocha";
import { safeSemver } from "../../../src/modules/dappGet/utils/safeSemver";
import { PackageRequest } from "../../../src/types";
import { DappGetFetcher } from "../../../src/modules/dappGet/fetch";
import { DappGetState, DappGetDnps } from "../../../src/modules/dappGet/types";
import { Dependencies } from "@dappnode/dappnodesdk";

export interface DappgetTestCase {
  // Data for test
  name: string;
  req: PackageRequest;
  dnps: {
    [dnpName: string]: {
      installed?: string;
      versions: {
        [version: string]: Dependencies;
      };
    };
  };
  // Assert result
  expectedState: DappGetState;
  expectedAggregate?: DappGetDnps;
  alreadyUpdated?: DappGetState;
}

export interface MockDnps {
  [dnpName: string]: {
    [version: string]: Dependencies;
  };
}

// No need to re-define a nested module object type
/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
export class DappGetFetcherMock extends DappGetFetcher {
  dnps: MockDnps;

  constructor(dnps: MockDnps) {
    super();
    this.dnps = dnps;
  }

  getDnp(name: string): { [version: string]: Dependencies } {
    const dnp = this.dnps[name];
    if (!dnp) throw Error(`dnp ${name} is not in the case definition`);
    return dnp;
  }

  async dependencies(name: string, version: string): Promise<Dependencies> {
    const dnp = this.getDnp(name);
    const dependencies = dnp[version];
    if (!dependencies)
      throw Error(`Version ${name} @ ${version} is not in the case definition`);
    return dependencies;
  }

  async versions(name: string, versionRange: string): Promise<string[]> {
    const dnp = this.getDnp(name);
    const allVersions = Object.keys(dnp);
    const validVersions = allVersions.filter(version =>
      safeSemver.satisfies(version, versionRange)
    );
    if (!validVersions.length) {
      const versions = allVersions.join(", ");
      throw Error(
        `No version satisfy ${name} @ ${versionRange}, versions: ${versions}`
      );
    }
    return validVersions;
  }
}

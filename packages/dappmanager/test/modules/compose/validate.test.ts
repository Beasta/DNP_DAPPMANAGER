import "mocha";
import { expect } from "chai";
import { mockCompose } from "../../testUtils";
import { Compose } from "@dappnode/dappnodesdk";
import { validateCompose } from "../../../src/modules/compose";

describe("validateCompose", () => {
  it("Should validate a valid compose", () => {
    const compose = mockCompose;
    expect(validateCompose(compose)).to.deep.equal(compose);
  });

  it("Should reject an empty compose", () => {
    expect(function () {
      validateCompose({} as Compose);
    }).to.throw("Invalid compose");
  });

  it("Should validate a compose with unknown extra props", () => {
    const compose = { ...mockCompose, extraProp: true } as Compose;
    expect(validateCompose(compose)).to.deep.equal(compose);
  });
});

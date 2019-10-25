import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";
import * as actions from "./actions";

chai.use(sinonChai);

describe("<Reports /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.not.have.property("fetchCasesByNationality");
    expect(creators).to.not.have.property("fetchCasesByAgeAndSex");
    expect(creators).to.not.have.property("fetchCasesByProtectionConcern");
    expect(creators).to.not.have.property("fetchCasesByAgency");
    expect(creators).to.have.property("fetchReports");

    delete creators.fetchCasesByNationality;
    delete creators.fetchCasesByAgeAndSex;
    delete creators.fetchCasesByProtectionConcern;
    delete creators.fetchCasesByAgency;
    delete creators.fetchReports;

    expect(creators).to.deep.equal({});
  });

  describe("deprecated 'fetchCasesByNationality'", () => {
    it("should be undefined", () => {
      expect(actionCreators.fetchCasesByNationality).to.be.equal(undefined);
    });
  });

  describe("deprecated 'fetchCasesByAgeAndSex'", () => {
    it("should be undefined", () => {
      expect(actionCreators.fetchCasesByAgeAndSex).to.be.equal(undefined);
    });
  });

  describe("deprecated 'fetchCasesByProtectionConcern'", () => {
    it("should be undefined", () => {
      expect(actionCreators.fetchCasesByProtectionConcern).to.be.equal(
        undefined
      );
    });
  });

  describe("deprecated 'fetchCasesByAgency'", () => {
    it("should be undefined", () => {
      expect(actionCreators.fetchCasesByAgency).to.be.equal(undefined);
    });
  });

  it("should check the 'fetchReports' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const data = { options: { page: 1, per: 20 } };
    actionCreators.fetchReports(data)(dispatch);
    const result = dispatch.getCall(0);

    expect(result.returnValue.type).to.equal(actions.FETCH_REPORTS);
    expect(result.returnValue.api.path).to.equal("reports");
    expect(result.returnValue.api.params).to.deep.equal(data.options);
  });
});

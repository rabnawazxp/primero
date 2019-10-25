import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducer";
import actions from "./actions";

chai.use(chaiImmutable);

describe("<Transitions /> - Reducers", () => {
  const defaultState = Map({
    data: []
  });

  it("should handle ASSIGN_USERS_FETCH_SUCCESS", () => {
    const payload = {
      data: [
        { label: "primero_cp", value: "primero_cp" },
        { label: "primero_gbv", value: "primero_gbv" }
      ]
    };
    const expected = Map({
      data: [],
      reassign: Map({
        users: payload.data
      })
    });
    const action = {
      type: actions.ASSIGN_USERS_FETCH_SUCCESS,
      payload
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("should handle ASSIGN_USER_SAVE_FAILURE", () => {
    const payload = {
      errors: [
        {
          status: 422,
          resource: "/api/v2/cases/123abc/assigns",
          detail: "transitioned_to",
          message: ["transition.errors.to_user_can_receive"]
        }
      ]
    };
    const expected = Map({
      data: [],
      reassign: Map({
        errors: true,
        message: ["transition.errors.to_user_can_receive"]
      })
    });
    const action = {
      type: actions.ASSIGN_USER_SAVE_FAILURE,
      payload
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("should handle ASSIGN_USER_SAVE_FINISHED", () => {
    const expected = Map({
      data: [],
      reassign: Map({
        loading: false
      })
    });
    const action = {
      type: actions.ASSIGN_USER_SAVE_FINISHED,
      payload: false
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("should handle ASSIGN_USER_SAVE_STARTED", () => {
    const expected = Map({
      data: [],
      reassign: Map({
        loading: true,
        errors: false
      })
    });
    const action = {
      type: actions.ASSIGN_USER_SAVE_STARTED,
      payload: true
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("should handle ASSIGN_USER_SAVE_SUCCESS", () => {
    const payload = {
      data: {
        id: "b46a12df-4db4-451c-98ff-c6301b90bf51",
        type: "Referral",
        record_id: "2a560934-39fd-4d5b-aedb-93e90f5df706",
        record_type: "case",
        transitioned_to: "primero_mgr_cp",
        transitioned_by: "primero",
        notes: "Some test",
        created_at: "2019-10-23T19:39:14.930Z",
        consent_overridden: false,
        consent_individual_transfer: false,
        rejected_reason: "",
        status: "done"
      }
    };
    const expected = Map({
      data: [payload.data],
      reassign: Map({
        errors: false,
        message: []
      })
    });
    const action = {
      type: actions.ASSIGN_USER_SAVE_SUCCESS,
      payload
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("should handle CLEAR_ERRORS", () => {
    const expected = Map({
      data: [],
      transfer: Map({
        errors: false,
        message: []
      })
    });
    const action = {
      type: actions.CLEAR_ERRORS,
      payload: "transfer"
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("should handle TRANSFER_USERS_FETCH_SUCCESS", () => {
    const payload = {
      data: [{ label: "primero_cp", value: "primero_cp" }]
    };
    const expected = Map({
      data: [],
      transfer: Map({
        users: payload.data
      })
    });
    const action = {
      type: actions.TRANSFER_USERS_FETCH_SUCCESS,
      payload
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("should handle TRANSFER_USER_FAILURE", () => {
    const payload = {
      errors: [
        {
          status: 422,
          resource: "/api/v2/cases/123abc/transfers",
          detail: "consent",
          message: ["transition.errors.consent"]
        }
      ]
    };
    const expected = Map({
      data: [],
      transfer: Map({
        errors: true,
        message: ["transition.errors.consent"]
      })
    });
    const action = {
      type: actions.TRANSFER_USER_FAILURE,
      payload
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("should handle TRANSFER_USER_STARTED", () => {
    const expected = Map({
      data: [],
      transfer: Map({
        errors: false
      })
    });
    const action = {
      type: actions.TRANSFER_USER_STARTED,
      payload: true
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("should handle TRANSFER_USER_SUCCESS", () => {
    const payload = {
      data: {
        id: "b46a12df-4db4-451c-98ff-c6301b90bf51",
        type: "Transitions",
        record_id: "2a560934-39fd-4d5b-aedb-93e90f5df706",
        record_type: "case",
        transitioned_to: "primero_mgr_cp",
        transitioned_by: "primero",
        notes: "Test notes",
        created_at: "2019-10-23T19:39:14.930Z",
        consent_overridden: false,
        consent_individual_transfer: false,
        rejected_reason: "",
        status: "done"
      }
    };
    const expected = Map({
      data: [payload.data],
      transfer: Map({
        errors: false,
        message: []
      })
    });
    const action = {
      type: actions.TRANSFER_USER_SUCCESS,
      payload
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("case Actions.REFERRAL_USERS_FETCH_SUCCESS", () => {
    const payload = {
      data: [{ label: "primero_cp", value: "primero_cp" }]
    };
    const expected = Map({
      data: [],
      referral: Map({
        users: payload.data
      })
    });
    const action = {
      type: actions.REFERRAL_USERS_FETCH_SUCCESS,
      payload
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("case Actions.REFER_USER_FAILURE", () => {
    const payload = {
      errors: [
        {
          status: 422,
          resource: "/api/v2/cases/123abc/transfers",
          detail: "consent",
          message: ["referral.errors.consent"]
        }
      ]
    };
    const expected = Map({
      data: [],
      referral: Map({
        errors: true,
        message: [["referral.errors.consent"]]
      })
    });
    const action = {
      type: actions.REFER_USER_FAILURE,
      payload
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("case Actions.REFER_USER_STARTED", () => {
    const expected = Map({
      data: [],
      referral: Map({
        errors: false
      })
    });
    const action = {
      type: actions.REFER_USER_STARTED,
      payload: true
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });

  it("case Actions.REFER_USER_SUCCESS", () => {
    const payload = {
      data: {
        id: "b46a12df-4db4-451c-98ff-c6301b90bf51",
        type: "Transitions",
        record_id: "2a560934-39fd-4d5b-aedb-93e90f5df706",
        record_type: "case",
        transitioned_to: "primero_mgr_cp",
        transitioned_by: "primero",
        notes: "Test notes",
        created_at: "2019-10-23T19:39:14.930Z",
        consent_overridden: false,
        consent_individual_transfer: false,
        rejected_reason: "",
        status: "done"
      }
    };
    const expected = Map({
      data: [payload.data],
      referral: Map({
        errors: false,
        message: []
      })
    });
    const action = {
      type: actions.REFER_USER_SUCCESS,
      payload
    };

    const newState = r.reducers(defaultState, action);
    expect(newState.toJS()).to.deep.equal(expected.toJS());
  });
});

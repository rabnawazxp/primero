import { fromJS, Map } from "immutable";
import { Badge, StepLabel } from "@material-ui/core";

import { setupMountedComponent, stub } from "../../../../test";
import { PrimeroModuleRecord } from "../../../application/records";

import WorkflowIndicator from "./workflow-indicator";

describe("<WorkflowIndicator />", () => {
  let state;

  const defaultProps = {
    locale: "en",
    primeroModule: "primeromodule-cp",
    recordType: "cases"
  };

  before(() => {
    state = Map({
      user: fromJS({
        modules: ["primeromodule-cp"]
      }),
      application: fromJS({
        modules: [
          PrimeroModuleRecord({
            unique_id: "primeromodule-cp",
            workflows: {
              case: {
                en: [
                  {
                    id: "new",
                    display_text: "New"
                  },
                  {
                    id: "reopened",
                    display_text: "Reopened"
                  },
                  {
                    id: "services",
                    display_text: "Services"
                  },
                  {
                    id: "closed",
                    display_text: "Closed"
                  }
                ]
              }
            }
          })
        ]
      })
    });
  });

  it("renders the workflow indicator", () => {
    const { component } = setupMountedComponent(
      WorkflowIndicator,
      {
        ...defaultProps,
        record: Map({ case_status_reopened: false, workflow: "services" })
      },
      state
    );

    const steps = component.find(StepLabel);

    expect(steps.at(1).props().active).to.equal(true);
    expect(steps.at(0).text()).to.include("New");
    expect(steps.at(1).props().active).to.equal(true);
    expect(steps.at(1).text()).to.include("Services");
    expect(steps.at(2).props().active).to.equal(false);
    expect(steps.at(2).text()).to.include("Closed");
  });

  it("renders status reopened if case has been reopened", () => {
    const { component } = setupMountedComponent(
      WorkflowIndicator,
      {
        ...defaultProps,
        record: Map({ case_status_reopened: true, workflow: "service" })
      },
      state
    );

    const steps = component.find(StepLabel);

    expect(steps.at(0).text()).to.include("Reopened");
  });

  describe("when the mobile is displayed", () => {
    let stubWindow = null;

    beforeEach(() => {
      stubWindow = stub(window, "matchMedia").returns({ matches: true, addListener: () => {} });
    });

    it("renders the smaller workflow indicator", () => {
      const { component } = setupMountedComponent(
        WorkflowIndicator,
        {
          ...defaultProps,
          record: Map({ case_status_reopened: false, workflow: "services" })
        },
        state
      );

      expect(component.find(Badge).text()).to.equal("2");
      expect(component.find(StepLabel)).to.have.lengthOf(0);
    });

    it("should not render the workflow indicator if the module does not support workflows", () => {
      const { component } = setupMountedComponent(
        WorkflowIndicator,
        {
          ...defaultProps,
          record: Map({ case_status_reopened: false })
        },
        state.setIn(
          ["application", "modules"],
          fromJS([
            PrimeroModuleRecord({
              unique_id: "primeromodule-cp"
            })
          ])
        )
      );

      expect(component.find(Badge)).to.have.lengthOf(0);
      expect(component.find(StepLabel)).to.have.lengthOf(0);
    });

    afterEach(() => {
      stubWindow?.restore();
    });
  });

  describe("when case is closed", () => {
    it("renders closed step as active", () => {
      const { component } = setupMountedComponent(
        WorkflowIndicator,
        {
          ...defaultProps,
          record: Map({ status: "closed", workflow: "reopened" })
        },
        state
      );

      const steps = component.find(StepLabel);

      expect(steps.at(0).text()).to.include("New");
      expect(steps.at(0).props().active).to.be.false;
      expect(steps.at(1).text()).to.include("Services");
      expect(steps.at(1).props().active).to.be.false;
      expect(steps.at(2).text()).to.include("Closed");
      expect(steps.at(2).props().active).to.be.true;
    });
  });
});

import { namespaceActions } from "../../libs";

import NAMESPACE from "./namespace";

export default namespaceActions(NAMESPACE, [
  "SET_SELECTED_FORM",
  "SET_SELECTED_RECORD",
  "SET_FORMS",
  "RECORD_FORMS",
  "RECORD_FORMS_STARTED",
  "RECORD_FORMS_SUCCESS",
  "RECORD_FORMS_FINISHED",
  "RECORD_FORMS_FAILURE",
  "SET_OPTIONS"
]);

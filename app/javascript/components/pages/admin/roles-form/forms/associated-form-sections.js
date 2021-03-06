import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../../../../config";
import { FieldRecord, FormSectionRecord, CHECK_BOX_FIELD } from "../../../../form";
import { displayNameHelper } from "../../../../../libs";

export default (formSections, i18n) =>
  [RECORD_TYPES.cases, RECORD_TYPES.tracing_requests, RECORD_TYPES.incidents].map(recordType =>
    FormSectionRecord({
      unique_id: `associated_form_sections_${recordType}`,
      name: i18n.t(`permissions.resource.forms.${recordType}.label`),
      tooltip: i18n.t(`permissions.resource.forms.${recordType}.explanation`),
      expandable: true,
      expanded: true,
      fields: [
        FieldRecord({
          name: `form_section_unique_ids[${recordType}]`,
          type: CHECK_BOX_FIELD,
          multi_select: true,
          option_strings_text: formSections
            .get(recordType, fromJS({}))
            .valueSeq()
            .map(formSection => ({
              id: formSection.get("unique_id"),
              display_text: displayNameHelper(formSection.get("name"), i18n.locale),
              tooltip: formSection.getIn(["description", i18n.locale])
            }))
            .toJS()
        })
      ]
    })
  );

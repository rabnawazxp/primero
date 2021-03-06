/* eslint-disable react/no-multi-comp, react/display-name */
import React, { useEffect, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import { FormContext, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import { useDispatch, useSelector } from "react-redux";

import { localesToRender } from "../utils";
import FormSection from "../../../../../form/components/form-section";
import bindFormSubmit from "../../../../../../libs/submit-form";
import ActionDialog, { useDialog } from "../../../../../action-dialog";
import { useI18n } from "../../../../../i18n";
import { compare } from "../../../../../../libs";
import { submitHandler, whichFormMode } from "../../../../../form";
import { getSelectedSubform } from "../../selectors";
import styles from "../styles.css";

import { TranslatableOptions } from "./components";
import { translationsFieldForm, validationSchema } from "./forms";
import { NAME } from "./constants";

const Component = ({ currentValues, field, isNested, mode, onClose, open, onSuccess }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const formMode = whichFormMode(mode);
  const locales = localesToRender(i18n);
  const { dialogClose } = useDialog(NAME);

  const selectedSubform = useSelector(state => getSelectedSubform(state), compare);
  const {
    name: fieldName,
    display_name: displayName,
    help_text: helpText,
    guiding_questions: guidingQuestions,
    tick_box_label: tickBoxLabel,
    option_strings_text: optionStringsText
  } = field.toJS();

  const { name, description } = selectedSubform?.toJS() || {};

  const formMethods = useForm({
    defaultValues: {
      subform_section: { name, description },
      [fieldName]: {
        display_name: displayName,
        help_text: helpText,
        guiding_questions: guidingQuestions,
        tick_box_label: tickBoxLabel,
        option_strings_text: optionStringsText
      }
    },
    validationSchema: validationSchema(i18n)
  });
  const selectedLocaleId = formMethods.watch("locale_id");

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      dialogClose();
    }
  };

  const onSubmit = data => {
    if (onSuccess) {
      onSuccess(data, true);
    }
    handleClose();
  };

  const modalProps = {
    confirmButtonLabel: i18n.t("buttons.update"),
    confirmButtonProps: {
      icon: <CheckIcon />
    },
    dialogTitle: i18n.t("forms.translations.edit"),
    open,
    successHandler: () => bindFormSubmit(formRef),
    cancelHandler: () => handleClose(),
    omitCloseAfterSuccess: true
  };

  const renderForms = () =>
    translationsFieldForm({
      i18n,
      selectedLocaleId,
      cssHideField: css.hideField,
      cssTranslationField: css.translationField,
      locales,
      field,
      subform: selectedSubform,
      currentValues,
      isNested
    }).map(form => <FormSection formSection={form} key={form.unique_id} />);

  useImperativeHandle(
    formRef,
    submitHandler({
      dispatch,
      formMethods,
      formMode,
      i18n,
      initialValues: {},
      message: i18n.t("forms.translations.no_changes_message"),
      onSubmit
    })
  );

  useEffect(() => {
    if (open) {
      const {
        display_name: fieldDisplayName,
        help_text: fieldHelpText,
        guiding_questions: fieldGuidingQuestions,
        tick_box_label: fieldTickBoxLabel,
        option_strings_text: fieldOptionStringsText
      } = currentValues[fieldName] || {};

      const subformSection =
        currentValues.subform_section ||
        (currentValues[selectedSubform.get("unique_id")]
          ? { name: currentValues[selectedSubform.get("unique_id")].display_name }
          : {});

      formMethods.reset({
        locale_id: locales?.first()?.get("id"),
        subform_section: {
          name: { ...name, ...subformSection?.name },
          description: {
            ...description,
            ...subformSection?.description
          }
        },
        [fieldName]: {
          display_name: { ...displayName, ...fieldDisplayName },
          help_text: { ...helpText, ...fieldHelpText },
          guiding_questions: { ...guidingQuestions, ...fieldGuidingQuestions },
          tick_box_label: { ...tickBoxLabel, ...fieldTickBoxLabel },
          option_strings_text: { ...optionStringsText, ...fieldOptionStringsText }
        }
      });
    }
  }, [open]);

  return (
    <ActionDialog {...modalProps}>
      <FormContext {...formMethods} formMode={formMode}>
        <form className={css.formBuilderDialog}>
          {renderForms()}
          <TranslatableOptions field={field} selectedLocaleId={selectedLocaleId} />
        </form>
      </FormContext>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  isNested: false,
  open: false
};

Component.propTypes = {
  currentValues: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  isNested: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  open: PropTypes.bool,
  subform: PropTypes.object
};

export default Component;

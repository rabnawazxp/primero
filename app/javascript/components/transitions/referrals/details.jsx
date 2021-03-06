import React from "react";
import { useSelector } from "react-redux";
import { Box, Divider, Grid, FormControlLabel } from "@material-ui/core";
import PropTypes from "prop-types";

import { getOption } from "../../record-form";
import TransitionUser from "../TransitionUser";
import { useI18n } from "../../i18n";
import { REFERRAL_DETAILS_NAME, TRANSITION_STATUS } from "../constants";
import { LOOKUPS } from "../../../config";
import { OPTION_TYPES } from "../../form";
import { getOptions } from "../../form/selectors";

import renderIconValue from "./render-icon-value";
import { referralAgencyName } from "./utils";

const Details = ({ transition, classes }) => {
  const i18n = useI18n();

  const service = useSelector(state => {
    const value = getOption(state, LOOKUPS.service_type, i18n.locale).filter(
      option => option.id === transition.service
    );

    // eslint-disable-next-line camelcase
    return value[0]?.display_text;
  });

  const agencies = useSelector(state => getOptions(state, OPTION_TYPES.AGENCY, i18n, [], true));

  const agencyName = referralAgencyName(transition, agencies);

  const renderRejected =
    transition.status === TRANSITION_STATUS.rejected ? (
      <Grid item md={12} xs={12}>
        <Box>
          <div className={classes.transtionLabel}>{i18n.t("transition.rejected")}</div>
          <div className={classes.transtionValue}>{transition.rejected_reason}</div>
        </Box>
      </Grid>
    ) : null;

  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <TransitionUser
          label="transition.recipient"
          transitionUser={transition.transitioned_to || transition.transitioned_to_remote}
          classes={classes}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <TransitionUser label="transition.assigned_by" transitionUser={transition.transitioned_by} classes={classes} />
      </Grid>

      <Grid item md={6} xs={12}>
        <Box>
          <div className={classes.transtionLabel}>{i18n.t("transition.no_consent_share")}</div>
          <div className={classes.transtionIconValue}>
            <FormControlLabel
              control={renderIconValue(transition.consent_overridden, classes.successIcon)}
              label={
                <div className={classes.transtionValue}>
                  {i18n.t(`transition.consent_overridden_value.${transition.consent_overridden}_label`)}
                </div>
              }
            />
          </div>
        </Box>
      </Grid>
      <Grid item md={6} xs={12}>
        <Box>
          <div className={classes.transtionLabel}>{i18n.t("transition.service_label")}</div>
          <div className={classes.transtionIconValue}>{service}</div>
        </Box>
      </Grid>
      <Grid item md={6} xs={12}>
        <div>
          <div className={classes.transtionLabel}>{i18n.t("transition.agency_label")}</div>
          <div className={classes.transtionIconValue}>{agencyName}</div>
        </div>
      </Grid>
      {renderRejected}
      <Grid item md={12} xs={12}>
        <Box>
          <Divider className={classes.divider} />
          <div className={classes.transtionLabel}>{i18n.t("referral.notes_label")}</div>
          <div className={classes.transtionValue}>{transition.notes}</div>
        </Box>
      </Grid>
    </Grid>
  );
};

Details.displayName = REFERRAL_DETAILS_NAME;

Details.propTypes = {
  classes: PropTypes.object.isRequired,
  transition: PropTypes.object.isRequired
};

export default Details;

import React, { useState } from "react";
import { List, Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

import { getPermissions } from "../../user/selectors";
import { ADMIN_NAV } from "../../../config/constants";
import { checkPermissions, RESOURCES } from "../../../libs/permissions";

import styles from "./styles.css";
import AdminNavItem from "./admin-nav-item";
import { getAdminResources } from "./utils";

const AdminNav = () => {
  const css = makeStyles(styles)();
  const userPermissions = useSelector(state => getPermissions(state));
  const adminResources = getAdminResources(userPermissions);

  const [open, setOpen] = useState(false || adminResources[0] === RESOURCES.metadata);

  const handleClick = () => {
    setOpen(!open);
  };

  const hasNavPermission = (type, permission) => {
    if (type && permission) {
      return checkPermissions(userPermissions.get(type), permission);
    }

    return true;
  };

  const renderNavItems = ADMIN_NAV.map(nav => {
    const isParent = "items" in nav;
    const { recordType, permission } = nav;

    if (!hasNavPermission(recordType, permission)) {
      return null;
    }

    if (isParent) {
      const renderChildren = nav.items.map(navItem => {
        const { recordType: navItemRecordType, permission: navItemPermission } = navItem;

        if (!hasNavPermission(navItemRecordType, navItemPermission)) {
          return null;
        }

        return <AdminNavItem key={`${navItem.to}-child`} item={navItem} nestedClass={css.nestedItem} />;
      });

      return (
        <React.Fragment key={`${nav.to}-parent`}>
          <AdminNavItem item={nav} open={open} handleClick={handleClick} isParent />
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderChildren}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    return <AdminNavItem key={`${nav.to}-group`} item={nav} />;
  });

  return <List>{renderNavItems}</List>;
};

AdminNav.displayName = "AdminNav";

export default AdminNav;

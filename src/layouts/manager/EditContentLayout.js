import React, { useEffect } from 'react';
import { useQuery } from "react-query";
import { callApiAction } from "@/actions/apiActions";
import {classes, getAccountTemplate} from "@/helpers";

import styles from './EditContentLayout.module.css';

export default function EditContentLayout({ accountUniqCode, className, children }) {

    const accountQuery = useQuery({
        queryKey: ["account", accountUniqCode],
        queryFn: () => {
            return callApiAction({ action: 'accountView', urlParams: { accountUniqCode: accountUniqCode } }).then(response => {
                return response?.data;
            })
        },
        staleTime: 60 * 1000,
        retry: 0,
        enabled: !!accountUniqCode,
    });

    const account = accountQuery?.data;

    const template = getAccountTemplate({ accountTemplate: account?.active_template?.template });

    const renderStyles = () => {
        return null;
    }

    return (
        <div className={classes(styles.wrapper, className)} style={ template?.editContentLayout?.wrapper }>
            { renderStyles() }
            { children }
        </div>
    )
}

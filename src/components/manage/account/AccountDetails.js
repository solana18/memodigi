import React from 'react';
import dynamic from "next/dynamic";

import { useQuery } from "react-query";
import { callApiAction } from "@/actions/apiActions";

import styles from './AccountDetails.module.css';

export default function AccountDetails({ accountUniqCode }) {

    const contentsQuery = useQuery({
        queryKey: ["account", accountUniqCode],
        queryFn: () => {
            return callApiAction({ action: 'accountView', urlParams: { accountUniqCode: accountUniqCode } }).then(response => {
                return response.data;
            })
        },
        staleTime: 60 * 1000,
        retry: 0,
        enabled: !!accountUniqCode,
    });

    return(
        <div className={styles.info}>
            <div className={styles.infoTitle}>
                Edit Account content
            </div>
            <div className={styles.placeholder}>Coming Soon</div>
        </div>
    )
}
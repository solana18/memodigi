import React from 'react';
import { classes, formatBytes } from "@/helpers";
import { useQuery } from "react-query";
import { callApiAction } from "@/actions/apiActions";

import styles from './LimitsBlock.module.css';

export default function LimitsBlock({ accountUniqCode, buttonsConfig, className }) {

    const { data: account } = useQuery({
        queryKey: ["account", accountUniqCode],
        queryFn: () => {
            return callApiAction({ action: 'accountView', urlParams: { accountUniqCode: accountUniqCode } }).then(response => {
                return response.data;
            })
        },
        staleTime: 1000,
        retry: 0,
        enabled: !!accountUniqCode,
    });

    const limitProgressPercent = (
        (account?.storage_usage?.occupied_space || 0) / (account?.active_subscription?.storage_size || 1)
    ) * 100;

    const limitStylesVariables = {
        '--limit-progress-percent': `${limitProgressPercent}%`,
    }

    const getLimitText = () => {
        return `${formatBytes(account?.storage_usage?.occupied_space, 0)} / ${formatBytes(account?.active_subscription?.storage_size, 0)}` //`${account?.storage_usage?.photos} / ${account?.active_subscription?.max_photos_count}`
    }

    return (
        <div className={classes(styles.wrapper, className)}>
            <div className={styles.limitsLineBlock}>
                <div className={styles.limitLine} style={limitStylesVariables} />
            </div>
            <div className={styles.buttons}>
                <div className={styles.prevButton}>
                    { buttonsConfig?.prevButton ?
                        <div className={styles.button} onClick={()=> { buttonsConfig?.prevButton?.onClick?.() }}>
                            { buttonsConfig?.prevButton?.title }
                        </div>
                        : null
                    }
                </div>
                <div className={styles.limitText}>
                    { getLimitText() }
                </div>
                <div className={styles.nextButton}>
                    { buttonsConfig?.nextButton ?
                        <div className={styles.button} onClick={()=> { buttonsConfig?.nextButton?.onClick?.() }}>
                            { buttonsConfig?.nextButton?.title }
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>
    )
}
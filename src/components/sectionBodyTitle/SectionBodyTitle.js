import React from 'react';
import { classes } from "@/helpers";

import styles from './SectionBodyTitle.module.css';

export default function SectionBodyTitle({ title, subTitle, className }) {
    return (
        <div className={classes(styles.wrapper, className)}>
            <div className={styles.title}>
                { title }
            </div>
            <div className={styles.subTitle}>
                { subTitle }
            </div>
        </div>
    )
}
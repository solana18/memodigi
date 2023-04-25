import React from 'react';
import Router from "next/router";

import SectionTitle from "@/components/sectionTitle/SectionTitle";
import EditContentLayout from "@/layouts/manager/EditContentLayout";

import { ACCOUNT_CONNECT_EXT_ACCOUNT_PATH } from "@/constants";

import dynamic from "next/dynamic";
const Account = dynamic(() => import("@/components/manage/account/Account"))

import styles from './ManageAccount.module.css';

export default function ManageAccount({ accountUniqCode }) {

    const handleBackClick = () => {
        Router.push({ pathname: ACCOUNT_CONNECT_EXT_ACCOUNT_PATH, query: { accountUniqCode } })
    }

    return (
        <EditContentLayout accountUniqCode={ accountUniqCode } className={styles.wrapper}>
            <SectionTitle prevAction={ handleBackClick } />
            <Account accountUniqCode={ accountUniqCode } />
        </EditContentLayout>
    )
}
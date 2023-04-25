import React from 'react';
import Router from "next/router";
import { CustomTextField } from "@/helpers";

import SectionBodyTitle from "@/components/sectionBodyTitle/SectionBodyTitle";
import CustomButton, { BUTTON_TYPE } from "@/components/customButton/CustomButton";
import Icon, { ICON_TYPES } from "@/components/icon/Icon";

import { ACCOUNT_CONNECT_EXT_ACCOUNT_PATH } from "@/constants";

import styles from './SecretCodeSection.module.css';

export default function SecretCodeSection({ accountUniqCode }) {

    const handleSubmitClick = () => {
        Router.push({ pathname: ACCOUNT_CONNECT_EXT_ACCOUNT_PATH, query: { accountUniqCode } })
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.bottomImage}>
                <Icon type={ ICON_TYPES.hand } />
            </div>
            <SectionBodyTitle title={'Nice to meet you!'}
                              subTitle={'We are ready to start! please enter your code (pleased on the card)'} />
            <div className={styles.form}>
                <div className={styles.formFields}>
                    <CustomTextField label={'Secret code'} onChange={()=> {}} />
                </div>
                <div className={styles.formFields}>
                    <CustomButton title={ 'Submit my code' }
                                  type={ BUTTON_TYPE.regularPink }
                                  onClick={ handleSubmitClick }
                                  className={ styles.submitButton } />
                </div>
            </div>
        </div>
    )
}
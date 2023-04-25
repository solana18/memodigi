import React, { useState } from 'react';
import Router from "next/router";

import SectionBodyTitle from "@/components/sectionBodyTitle/SectionBodyTitle";
import CustomButton, { BUTTON_TYPE } from "@/components/customButton/CustomButton";
import ContentEdit from "@/components/manage/contentEdit/ContentEdit";
import Icon, { ICON_TYPES } from "@/components/icon/Icon";
import OptionsList from "@/components/optionsList/OptionsList";

import { UPLOAD_CONTENT_PATH } from "@/constants";

import styles from './TripStep1.module.css';

export default function TripStep1({ accountUniqCode, nextCallback, backCallback }) {

    const [ subStep, setSubStep ] = useState(0);
    const [ formData, setFormData ] = useState({});

    const updateFormData = ({ fieldName, fieldValue }) => {
        if (fieldValue) {
            const { ...otherFields } = formData;
            setFormData(otherFields);
        } else {
            setFormData((prev) => ({ ...prev, [fieldName]: fieldValue }));
        }
    }

    const handleBackClick = () => {
        backCallback?.();
    }

    const handleSubmitForm = () => {
         Router.push({ pathname: UPLOAD_CONTENT_PATH, query: { accountUniqCode } });
        // TODO: submit form
        // nextCallback?.();
    }

    const uploadOptions = [
        {
            icon: null,
            name: 'Upload photos/video',
            rightIcon: false,
            onClick: () => { Router.push({ pathname: UPLOAD_CONTENT_PATH, query: { accountUniqCode } }) }
        },
        {
            icon: <Icon type={ ICON_TYPES.instagram } />,
            name: 'Instagram',
            rightIcon: true,
            onClick: () => {}
        },
    ];

    return (
        <div className={styles.wrapper}>
            <>
                <div className={styles.formSection}>
                    <SectionBodyTitle title={'Add your memories'}
                                      subTitle={'Please select the photos or videos you would like to add to your album'} />

                    <OptionsList config={ uploadOptions } />
                </div>

                <div className={styles.buttonsWrapper}>
                    <CustomButton title={ 'Back' }
                                  type={ BUTTON_TYPE.transparent }
                                  onClick={ handleBackClick }
                                  className={ null } />
                    <CustomButton title={ 'Next' }
                                  type={ BUTTON_TYPE.regularPink }
                                  onClick={ handleSubmitForm }
                                  className={ null } />
                </div>
            </>
            {/*<ContentEdit accountUniqCode={ accountUniqCode } />*/}
        </div>
    )
}


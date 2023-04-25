import React, {useEffect, useState} from 'react';
import { CustomTextArea, CustomTextField } from "@/helpers";
import { useQuery } from "react-query";
import { callApiAction } from "@/actions/apiActions";

import SectionBodyTitle from "@/components/sectionBodyTitle/SectionBodyTitle";
import CustomButton, { BUTTON_TYPE } from "@/components/customButton/CustomButton";

import styles from './TripStep0.module.css';

export default function TripStep0({ accountUniqCode, nextCallback, backCallback }) {

    const [ subStep, setSubStep ] = useState(0);
    const [ formData, setFormData ] = useState({});

    const updateFormData = ({ fieldName, fieldValue }) => {
        if (typeof fieldValue === "undefined" || fieldValue === undefined || fieldValue === null) {
            setFormData((prev) => {
                const { ...otherFields } = prev;
                return otherFields;
            });
        } else {
            setFormData((prev) => ({ ...prev, [fieldName]: fieldValue }));
        }
    }

    const accountQuery = useQuery({
        queryKey: ["account", accountUniqCode],
        queryFn: () => {
            return callApiAction({ action: 'accountView', urlParams: { accountUniqCode: accountUniqCode } }).then(response => {
                return response?.data;
            })
        },
        staleTime: 1000,
        retry: 0,
        enabled: !!accountUniqCode,
    });
    const account = accountQuery?.data;

    useEffect(() => {
        updateFormData({ fieldName: 'tripName', fieldValue: account?.accounts_detail?.name });
        updateFormData({ fieldName: 'shortDescription', fieldValue: account?.accounts_detail?.small_description_one });
        updateFormData({ fieldName: 'description', fieldValue: account?.accounts_detail?.description });
    }, [account])

    const handleSubmitNamesForm = () => {
        const data = {
            account_name: formData?.tripName || '',
            small_description_one: formData?.shortDescription || '',
        }
        callApiAction({ action: 'saveAccountDetailsNames', urlParams: { accountUniqCode: accountUniqCode }, data })
            .then(response => {
                setSubStep((prev) => prev + 1);
            })
    }

    const handleSubmitForm = () => {
        const data = {
            date_start: '2022-05-10',
            date_end: '2022-05-18',
            description: formData?.description || '',
        }
        callApiAction({ action: 'saveAccountDetailsOther', urlParams: { accountUniqCode: accountUniqCode }, data })
            .then(response => {
                nextCallback?.();
            })
    }

    const handleSkipClick = () => {
        nextCallback?.();
    }

    return (
        <div className={styles.wrapper}>
            { subStep === 0 ?
                <>
                    <div className={styles.formSection}>
                        <SectionBodyTitle title={'Your trip'}
                                          subTitle={'This information will be shown on our album cover'} />

                        <div className={styles.form}>
                            <CustomTextField label={'Trip name'}
                                             onChange={(e)=> { updateFormData({ fieldName: 'tripName', fieldValue: e?.target?.value }) }}
                                             placeholder={'Trip name'}
                                             controlParams={{ value: formData?.tripName }} />
                            <CustomTextField label={'Short description'}
                                             onChange={(e)=> { updateFormData({ fieldName: 'shortDescription', fieldValue: e?.target?.value }) }}
                                             placeholder={'Short trip description'}
                                             controlParams={{ value: formData?.shortDescription }} />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <div>
                            <div className={styles.buttonsWrapper}>
                                <CustomButton title={ 'Next' }
                                              type={ BUTTON_TYPE.regularPink }
                                              onClick={ () => { handleSubmitNamesForm() } }
                                              className={ null } />
                            </div>
                        </div>
                    </div>
                </> : null
            }
            { subStep === 1 ?
                <>
                    <div className={styles.formSection}>
                        <SectionBodyTitle title={'Additionally'}
                                          subTitle={'You can skip this step and add details  later )'} />

                        <div className={styles.form}>
                            <CustomTextField
                                label={'Trip dates'}
                                onChange={()=> {}}
                                placeholder={'Trip dates'} />
                            <CustomTextArea
                                label={'Description'}
                                onChange={(e)=> { updateFormData({ fieldName: 'description', fieldValue: e?.target?.value }) }}
                                placeholder={'Description'}
                                controlParams={{ value: formData?.description }} />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <div>
                            <div className={styles.buttonsWrapper}>
                                <CustomButton title={ 'Back' }
                                              type={ BUTTON_TYPE.transparent }
                                              onClick={ () => { setSubStep((prev) => prev - 1) } }
                                              className={ null } />
                                <CustomButton title={ 'Next' }
                                              type={ BUTTON_TYPE.regularPink }
                                              onClick={ handleSubmitForm }
                                              className={ null } />
                            </div>
                            <div className={styles.buttonSkipWrapper}>
                                <CustomButton title={ 'Skip' }
                                              type={ BUTTON_TYPE.simpleLink }
                                              onClick={ handleSkipClick }
                                              className={ null } />
                            </div>
                        </div>
                    </div>
                </> : null
            }
        </div>
    )
}


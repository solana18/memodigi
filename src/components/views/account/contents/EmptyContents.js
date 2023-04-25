import React, { useState } from 'react';
import Router from "next/router";
import { classes, getAccountTemplate } from "@/helpers";
import { useQuery } from "react-query";
import { callApiAction } from "@/actions/apiActions";

import CustomButton, { BUTTON_TYPE } from "@/components/customButton/CustomButton";
import Link from "next/link";

import {ACCOUNT_SECRET_CODE_PATH, MANAGE_CONTENT_PATH} from "@/constants";

import styles from "./EmptyContents.module.css";

//import bgMusic from "https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_2MG.mp3";

export default function EmptyContents({ accountUniqCode }) {

    // const {} = useBodyStyle({ bodyStyle: 'empty-content-page' });

    const [ playMusic, setPlayMusic ] = useState(true);
    const [ audioFile, setAudioFile ] = useState(null);

    const contentsQuery = useQuery({
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

    const account = contentsQuery?.data;

    const template = getAccountTemplate({ accountTemplate: account?.active_template?.template });

    // useEffect(() => {
    //     setAudioFile(new Audio("http://localhost:3030/music-bg/ms1.wav"));
    // })

    // useEffect(() => {
    //     if (audioFile) {
    //         audioFile.loop = true;
    //         audioFile.play();
    //     }
    // }, [audioFile])

    // useEffect(() => {
    //     if (playMusic) {
    //         audioFile?.play();
    //     } else {
    //         audioFile?.pause();
    //     }
    // }, [ playMusic ])

    const toggleMusic = () => {
        setPlayMusic((prev) => !prev);
    }

    const backgroundImage = account?.city?.image || '_/cities/prs/prs.png';

    const handleCreateClick = () => {
        Router.push({ pathname: ACCOUNT_SECRET_CODE_PATH, query: { accountUniqCode } })
    }

    return (
        <div className={styles.wrapper} style={{ backgroundImage: `url(${backgroundImage})` }} >
            <div className={styles.wrapperOpacity} />
            <div className={styles.topText}>
                <div className={styles.logo}>
                    <img src={"/logo/logo.png"} alt={""} />
                </div>
                <div className={styles.slogan} style={ template?.emptyContent?.slogan }>
                    Share your greatest memories!
                </div>
            </div>
            <div className={styles.middleText}>

            </div>
            <div className={styles.bottomBlock}>
                <div className={styles.welcomeTextBlock}>
                    <span className={styles.welcome}>welcome to</span>
                    <span className={styles.cityName}>{ account?.city?.name }</span>
                </div>
                <CustomButton title={ 'Create your album' }
                              type={ BUTTON_TYPE.pinkNext }
                              onClick={ handleCreateClick } />
            </div>
        </div>
    )
}
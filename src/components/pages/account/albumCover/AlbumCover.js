import React, { useState } from 'react';
import Router from "next/router";
import { useQuery } from "react-query";
import { callApiAction } from "@/actions/apiActions";

import CustomButton, { BUTTON_TYPE } from "@/components/customButton/CustomButton";
import OffcanvasView, {OFFCANVAS_ITEM_TYPES} from "@/components/offcanvases/offcanvasView/OffcanvasView";
import Icon, { ICON_TYPES } from "@/components/icon/Icon";

import {ACCOUNT_SECRET_CODE_PATH, ALBUM_VIEW_PATH, MANAGE_CONTENT_PATH} from "@/constants";

import styles from "./AlbumCover.module.css";

export default function AlbumCover({ accountUniqCode }) {

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

    const backgroundImage = account?.city?.image || '_/cities/prs/prs.png';

    const handlePlayClick = () => {
        Router.push({ pathname: ALBUM_VIEW_PATH, query: { accountUniqCode } })
    }

    return (
        <>
            <div className={styles.wrapper} style={{ backgroundImage: `url(${backgroundImage})` }} >
                <div className={styles.wrapperOpacity} />
                <div className={styles.topText}>
                    <div className={styles.logo}>
                        <img src={"/logo/logo.png"} alt={""} />
                    </div>
                    <div className={styles.albumCoverName}>
                        { account?.accounts_detail?.name }
                    </div>
                </div>
                <div className={styles.middleText}>

                </div>
                <div className={styles.bottomBlock}>
                    <div className={styles.welcomeTextBlock}>
                        <span className={styles.albumCoverSmallDesc}>
                            { account?.accounts_detail?.small_description_one }
                        </span>
                        <span className={styles.albumCoverMidDesc}>
                            { account?.accounts_detail?.small_description_two }
                        </span>
                    </div>
                    <CustomButton type={ BUTTON_TYPE.pinkJustPlay }
                                  onClick={ handlePlayClick } />
                </div>
            </div>
        </>
    )
}
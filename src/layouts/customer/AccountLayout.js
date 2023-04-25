import React, { useState } from 'react';
import Router from "next/router";
import { useQuery } from "react-query";
import { callApiAction } from "@/actions/apiActions";
import { classes, getAccountTemplate } from "@/helpers";

import Icon, { ICON_TYPES } from "@/components/icon/Icon";
import OffcanvasView, { OFFCANVAS_ITEM_TYPES } from "@/components/offcanvases/offcanvasView/OffcanvasView";
import ViewAccessPopup from "@/components/viewAccessPopup/ViewAccessPopup";

import { ACCOUNT_SECRET_CODE_PATH } from "@/constants";

import styles from './AccountLayout.module.css';

export default function AccountLayout({ accountUniqCode, children, className }) {

    const [ showOffcanvas, setShowOffcanvas ] = useState(false);
    const [ showRequireViewCodePopup, setShowRequireViewCodePopup ] = useState(false);

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

    const offcanvasConfig = [
        { type: OFFCANVAS_ITEM_TYPES.link,  icon: <Icon type={ ICON_TYPES.info } />,     title: `About ${account?.city?.name}`,       onCLick: () => {} },
        { type: OFFCANVAS_ITEM_TYPES.delimiter },
        { type: OFFCANVAS_ITEM_TYPES.link,  icon: <Icon type={ ICON_TYPES.edit } />,     title: 'Manage content',
            onCLick: () => { Router.push({ pathname: ACCOUNT_SECRET_CODE_PATH, query: { accountUniqCode } }) } },
        { type: OFFCANVAS_ITEM_TYPES.link,  icon: <Icon type={ ICON_TYPES.share } />,    title: 'Share album',       onCLick: () => {} },
        { type: OFFCANVAS_ITEM_TYPES.link,  icon: <Icon type={ ICON_TYPES.location } />, title: 'View on map',       onCLick: () => {} },
        { type: OFFCANVAS_ITEM_TYPES.groupTitle, title: 'Slideshow settings' },
        { type: OFFCANVAS_ITEM_TYPES.link,  icon: <Icon type={ ICON_TYPES.volume } />,   onCLick: () => {} },
    ]

    const template = getAccountTemplate({ accountTemplate: account?.active_template?.template });

    const renderStyles = () => {
        return null;
        // return (
        //     <style jsx global>
        //         {`
        //             :root {
        //                 --main-background: 'linear-gradient(135deg, rgba(7,64,71,1) 0%, rgba(81,53,57,1) 100%)'
        //             }
        //             // html {
        //             //   background: ${template?.html?.background};
        //             //   min-height: 100vh;
        //             // }
        //         `}
        //     </style>
        // )
    }

    return (
        <div className={classes(styles.wrapper, className)} style={ template?.accountLayout?.wrapper } >
            { renderStyles() }
            <ViewAccessPopup isShow={showRequireViewCodePopup} setIsShow={setShowRequireViewCodePopup} />
            <OffcanvasView isShow={showOffcanvas} setIsShow={setShowOffcanvas} config={offcanvasConfig} />
            <div className={styles.actions}>
                <div onClick={ () => {} }>
                    <img src={"/icons/icon-volume.svg"} alt={""} />
                </div>
                <div onClick={ () => { setShowOffcanvas((prev) => !prev) } }>
                    <img src={"/icons/icon-menu.svg"} alt={""} />
                </div>
            </div>
            { children }
        </div>
    )
}

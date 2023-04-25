import React, { useState } from 'react';
import Router from "next/router";
import { useQuery } from "react-query";
import { callApiAction } from "@/actions/apiActions";
import { ERROR_404 } from "@/constants";

import dynamic from "next/dynamic";
const Contents = dynamic(() => import("@/components/views/account/contents/Contents"));
const EmptyContents = dynamic(() => import("@/components/views/account/contents/EmptyContents"));

import styles from './Account.module.css';
import AlbumCover from "@/components/pages/account/albumCover/AlbumCover";

export default function Account({ accountUniqCode }) {

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

    if (contentsQuery.isError) {
        if (contentsQuery?.error?.response?.status === 404) {
            Router.push(ERROR_404);
        }
        return 'An error occurred'
    }

    const contentsCount = contentsQuery?.data?.contents?.length;

    return (
        <div>
            { contentsCount ?
                // <Contents data={contentsQuery?.data}/>
                <AlbumCover accountUniqCode={accountUniqCode} />
                :
                <EmptyContents accountUniqCode={accountUniqCode} />
            }
        </div>
    )
}
import React, { useState } from 'react';
import Router from "next/router";
import { useQuery } from "react-query";
import { callApiAction } from "@/actions/apiActions";
import { getContentPath } from "@/helpers";
// import { FullScreen, useFullScreenHandle } from "react-full-screen";

import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SlidesCarousel from "@/components/slidesCarousel/SlidesCarousel";

import { USER_CONTENT_TYPES, VIEW_CONTENT_PATH } from "@/constants";

import styles from "./AlbumView.module.css";

export default function AlbumView({ accountUniqCode }) {

    //const handle = useFullScreenHandle();

    const prevPageClick = () => {
        Router.push({ pathname: VIEW_CONTENT_PATH, query: { accountUniqCode } })
    }

    const contentsQuery = useQuery({
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

    const account = contentsQuery?.data;

    const items = contentsQuery?.data?.contents?.map((item, index) => {
        if (!item) {
            return null;
        }
        switch(item.content_type) {

            case USER_CONTENT_TYPES.photo:
                return {
                    id: `item-${index}`,
                    src: getContentPath({ contentHash: item.uniq_hash, type: 'thumbnail/1024' }), // type: 'original'
                    thumbnail: getContentPath({ contentHash: item.uniq_hash, type: 'thumbnail/300' }),
                    image: getContentPath({ contentHash: item.uniq_hash, type: 'thumbnail/1024' }),
                    title: "Slide title",
                    description: "Slide description",
                    width: item.width,
                    height: item.height,
                    original: item,
                }
            case USER_CONTENT_TYPES.video:
                return {
                    id: `item-${index}`,
                    type: "video",
                    width: item.width,
                    height: item.height,
                    thumbnail: getContentPath({ contentHash: item.uniq_hash, type: 'thumbnail/300' }),
                    image: getContentPath({ contentHash: item.uniq_hash, type: 'thumbnail/1024' }),
                    poster: getContentPath({ contentHash: item.uniq_hash, type: 'thumbnail/1024' }),
                    sources: [
                        {
                            src: getContentPath({ contentHash: item.uniq_hash, type: 'original' }),
                            type: item.file_type
                        }
                    ],
                    title: "Slide title",
                    loop: true,
                    description: "Slide description",
                    original: item,
                }
            case USER_CONTENT_TYPES.audio:
                return {
                    id: `item-${index}`,
                    type: "video",
                    poster: '/placeholders/audio-2.png',
                    thumbnail: '/placeholders/audio.jpg',
                    image: '/placeholders/audio.jpg',
                    title: "Slide title",
                    description: "Slide description",
                    width: 782,
                    height: 440,
                    original: item,
                    sources: [
                        {
                            src: getContentPath({ contentHash: item.uniq_hash, type: 'original' }),
                            type: item.file_type
                        }
                    ],
                }


            // case USER_CONTENT_TYPES.photo:
            //     return {
            //             id: `item-${index}`,
            //             original: getContentPath({ contentHash: item.uniq_hash, type: 'original' }),
            //             thumbnail: getContentPath({ contentHash: item.uniq_hash, type: 'thumbnail/300' }),
            //             image: getContentPath({ contentHash: item.uniq_hash, type: 'thumbnail/1024' }),
            //         width: item?.width,
            //         height: item?.height,
            //         itemData: item,
            //     }
            // case USER_CONTENT_TYPES.video:
            //     return {
            //         id: `item-${index}`,
            //         original: getContentPath({ contentHash: item.uniq_hash, type: 'original' }),
            //         thumbnail: getContentPath({ contentHash: item.uniq_hash, type: 'thumbnail/300' }),
            //         image: getContentPath({ contentHash: item.uniq_hash, type: 'thumbnail/1024' }),
            //         width: item?.width,
            //         height: item?.height,
            //         itemData: item,
            //     }
            // case USER_CONTENT_TYPES.audio:
            //     return {
            //         id: `item-${index}`,
            //         original: '/placeholders/audio-2.png',
            //         thumbnail: '/placeholders/audio.jpg',
            //         image: '/placeholders/audio-2.png',
            //         width: 2500,
            //         height: 1101,
            //         itemData: item,
            //     }
        }
    });

    const getAlbumTitle = () => {
        return (
            <span className={styles.albumTitleWrapper}>
                <span className={styles.albumTitle}>
                    {  account?.accounts_detail?.small_description_one }
                </span>
                <span className={styles.albumDates}>
                    May 27 - May 30, 2022
                </span>
            </span>
        )
    }

    return (
        <div className={styles.wrapper}>
            {/*<div className={styles.paddingWrapper} onClick={() => { handle.enter }}>*/}
            <div className={styles.paddingWrapper}>
                <SectionTitle prevAction={ prevPageClick } title={ getAlbumTitle() } />
            </div>
            <div>
                {/*<FullScreen handle={handle}>*/}
                    <SlidesCarousel items={items} />
                {/*</FullScreen>*/}
            </div>
        </div>
    )
}
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from "react-query";
import { callApiAction } from "@/actions/apiActions";
import { getContentPath } from "@/helpers";
import { handleLoadingComplete } from "@/helpers/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Icons from "@fortawesome/free-solid-svg-icons";

import dynamic from "next/dynamic";
const ContentItem = dynamic(() => import("@/components/manage/contentEdit/ContentItem"));

import { USER_CONTENT_TYPES } from "@/constants";

import styles from './DirectUpload.module.css';

export default function DirectUpload({ accountUniqCode, callback }) {

    const [ selectedItem, setSelectedItem ] = useState(null);

    const [ isUploading, setIsUploading ] = useState(false);
    const inputFileRef = useRef( null );

    const contentsQuery = useQuery({
        queryKey: ["account", accountUniqCode],
        queryFn: () => {
            return callApiAction({ action: 'accountView', urlParams: { accountUniqCode: accountUniqCode } }).then(response => {
                return response.data;
            })
        },
        staleTime: 60 * 1000,
        retry: 0,
        enabled: !!accountUniqCode,
    });

    const {
        max_photos_count: photosLimit,
        max_video_count: videLimit,
        max_audio_count: audioLimit,
    } = contentsQuery?.data?.active_subscription || {};

    const limitContentCount = (photosLimit || 0) + (videLimit || 0) + (audioLimit || 0);

    const selectContentFile = (file) => {
        uploadFile(file);
    }

    const uploadFile = (file) => {
        if (!file) {
            alert('Please select the file');
            return false;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append( 'file', file, file.name );
        callApiAction({ action: 'saveContent', urlParams: { accountUniqCode: accountUniqCode }, data: formData }).then(response => {
            contentsQuery.refetch();
        }).catch(error => {
            console.log('error', error);
            alert(error?.response?.data?.message || error?.message || "Something went wrong. Please try again");
        }).finally(() => {
            setIsUploading(false);
            formData.delete('file');
            inputFileRef.current.value = '';
        })
    }

    const items = contentsQuery?.data?.contents?.map(item => {
        if (!item) {
            return null;
        }
        switch(item.content_type) {
            case USER_CONTENT_TYPES.photo:
                return {
                    original: getContentPath({ contentHash: item.uniq_hash, type: 'original' }),
                    thumbnail: getContentPath({ contentHash: item.uniq_hash, type: 'thumbnail/300' }),
                    itemData: item,
                }
            case USER_CONTENT_TYPES.video:
                return {
                    original: getContentPath({ contentHash: item.uniq_hash, type: 'original' }),
                    thumbnail: getContentPath({ contentHash: item.uniq_hash, type: 'thumbnail/300' }),
                    itemData: item,
                }
            case USER_CONTENT_TYPES.audio:
                return {
                    original: '/placeholders/audio-2.png',
                    thumbnail: '/placeholders/audio.jpg',
                    itemData: item,
                }
        }
    });

    const handleAddContentButton = () => {
        inputFileRef.current.click();
    }

    useEffect(() => {
        if (!contentsQuery?.data?.contents?.length) {
            handleLoadingComplete();
        }
    }, [ ])

    return (
        <>
            <div className={styles.items}>
                { items?.length < limitContentCount ?
                    <div className={styles.contentWrapper} onClick={ () => { !isUploading && handleAddContentButton() } }>
                        <div className={styles.content}>
                            <input name="file-upload-field"
                                   type="file"
                                   className={styles.fileUploadWrapper}
                                   ref={inputFileRef}
                                   onChange={(e) => selectContentFile(e.target.files[0])} />
                            { isUploading ?
                                <span className={styles.loader} /> :
                                <FontAwesomeIcon icon={Icons.faPlusCircle} className={styles.addIcon}/>
                            }
                        </div>
                    </div> : null
                }

                {
                    items?.map((item, index) => {
                        return (
                            <ContentItem accountUniqCode={ accountUniqCode }
                                         contentItem={item}
                                         key={index}
                                         callBack={ () => { contentsQuery.refetch() } }
                                         selectedItem={ selectedItem }
                                         setSelectedItem={ setSelectedItem } />
                        )
                    })
                }
            </div>
        </>
    )
}
import React, { useEffect, useRef, useState } from 'react';
import dynamic from "next/dynamic";
import { handleLoadingComplete } from "@/helpers/loader";
import { useQuery } from "react-query";
import { callApiAction } from "@/actions/apiActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Carousel from "react-spring-3d-carousel";
import { config } from "react-spring";
import { v4 as uuidv4 } from "uuid";

import * as Icons from '@fortawesome/free-solid-svg-icons';

const Card = dynamic(() => import("@/components/carousel/Card"));
const CityInfo = dynamic(() => import("@/components/views/account/cityInfo/CityInfo"));
const ContentItem = dynamic(() => import("@/components/manage/contentEdit/ContentItem"));
const ContentItemEdit = dynamic(() => import("@/components/manage/contentEdit/contentItemEdit/ContentItemEdit"));

import styles from './ContentEdit.module.css';
import {getContentPath} from "@/helpers";
import CarouselView from "@/components/carousel/CarouselView";

let cards = [
    {
        key: uuidv4(),
        content: (
            <Card imagen="https://updates.theme-fusion.com/wp-content/uploads/2017/12/convertplus_thumbnail.jpg" />
        )
    },
    {
        key: uuidv4(),
        content: (
            <Card imagen="https://updates.theme-fusion.com/wp-content/uploads/2017/12/acf_pro.png" />
        )
    },
    {
        key: uuidv4(),
        content: (
            <Card imagen="https://updates.theme-fusion.com/wp-content/uploads/2017/12/layer_slider_plugin_thumb.png" />
        )
    },
    {
        key: uuidv4(),
        content: (
            <Card imagen="https://updates.theme-fusion.com/wp-content/uploads/2016/08/slider_revolution-1.png" />
        )
    },
    {
        key: uuidv4(),
        content: (
            <Card imagen="https://updates.theme-fusion.com/wp-content/uploads/2019/01/pwa_880_660.jpg" />
        )
    }
];

export default function ContentEdit({ accountUniqCode }) {

    const [ name, setName ] = useState("");
    const [ selectedItem, setSelectedItem ] = useState(null);

    const [ isUploading, setIsUploading ] = useState(false);
    const inputFileRef = useRef( null );

    const limitContentCount = 5;

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
        //formData.append( 'test_name_param', 'name for test');
        callApiAction({ action: 'saveContent', urlParams: { accountUniqCode: accountUniqCode }, data: formData }).then(response => {
            contentsQuery.refetch();
        }).catch(error => {
            console.log('error', error);
            alert(error?.response?.data?.message || error?.message || "Something went wrong. Please try again");
        }).finally(() => {
            setIsUploading(false);
            formData.delete('file');
        })
    }

    const items = contentsQuery?.data?.contents?.map(item => {
        return {
            original: getContentPath({contentHash: item.uniq_hash, type: 'original'}),
            thumbnail: getContentPath({contentHash: item.uniq_hash, type: 'thumbnail/300'}),
            itemData: item,
        }
    });

    console.log('contentsQuery?.data', contentsQuery?.data);

    const imagesCards = contentsQuery?.data?.contents?.map(item => {
        return {
            key: uuidv4(),
            content: (
                <Card imagen={getContentPath({contentHash: item.uniq_hash, type: 'thumbnail/300'})} />
            )
        }
    });

    console.log('cards', cards);
    console.log('imagesCards', imagesCards);

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
            {/*{ imagesCards?.length ?
                <CarouselView
                    cards={ imagesCards || cards }
                    height="500px"
                    width="30%"
                    margin="0 auto"
                    offset={2}
                    showArrows={false}
                />
                : null
            }*/}
        </>
    )



    // return (
    //     <>
    //         <div className={styles.title}>
    //             Upload your memories
    //         </div>
    //         <div className={styles.items}>
    //             {
    //                 items?.map((item, index) => {
    //                     return (
    //                         <ContentItem accountUniqCode={ accountUniqCode }
    //                                      contentItem={item}
    //                                      key={index}
    //                                      callBack={ () => { contentsQuery.refetch() } }
    //                                      selectedItem={ selectedItem }
    //                                      setSelectedItem={ setSelectedItem } />
    //                     )
    //                 })
    //             }
    //
    //             { items?.length < limitContentCount ?
    //                 <div className={styles.contentWrapper} onClick={ () => { !isUploading && handleAddContentButton() } }>
    //                     <div className={styles.content}>
    //                         <input name="file-upload-field"
    //                                type="file"
    //                                className={styles.fileUploadWrapper}
    //                                ref={inputFileRef}
    //                                onChange={(e) => selectContentFile(e.target.files[0])} />
    //                         { isUploading ?
    //                             <span className={styles.loader} /> :
    //                             <FontAwesomeIcon icon={Icons.faPlusCircle} className={styles.addIcon}/>
    //                         }
    //                     </div>
    //                 </div> : null
    //             }
    //
    //         </div>
    //
    //         <div>
    //             <ContentItemEdit contentItem={ selectedItem?.itemData }
    //                              callBack={ () => { contentsQuery.refetch() } } />
    //         </div>
    //
    //     </>
    // )
}
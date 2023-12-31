import Router from "next/router";
import { useState } from "react";

import SectionTitle from "@/components/sectionTitle/SectionTitle";
import EditContentLayout from "@/layouts/manager/EditContentLayout";

import InstagramUpload from "./InstagramUpload";

import {
  ACCOUNT_CONNECT_EXT_ACCOUNT_PATH,
  VIEW_CONTENT_PATH,
} from "@/constants";

import dynamic from "next/dynamic";
const Account = dynamic(() => import("@/components/manage/account/Account"));

import LimitsBlock from "@/components/limitsBlock/LimitsBlock";
import TabsList from "@/components/tabsList/TabsList";
import DirectUpload from "@/components/uploadContentSection/directUpload/DirectUpload";
import styles from "./UploadContent.module.css";

export default function UploadContent({ accountUniqCode }) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const tabs = [
    {
      title: "Uploads",
      content: (
        <DirectUpload accountUniqCode={accountUniqCode} callback={() => {}} />
      ),
    },
    { title: "Instagram", content: <InstagramUpload /> },
  ];

  const handleBackClick = () => {
    Router.push({
      pathname: ACCOUNT_CONNECT_EXT_ACCOUNT_PATH,
      query: { accountUniqCode },
    });
  };

  const limitButtons = {
    prevButton: { title: "Cancel", onClick: () => {} },
    nextButton: {
      title: "Done",
      onClick: () => {
        Router.push({
          pathname: VIEW_CONTENT_PATH,
          query: { accountUniqCode },
        });
      },
    },
  };

  return (
    <EditContentLayout
      accountUniqCode={accountUniqCode}
      className={styles.wrapper}
    >
      <div className={styles.paddingWrapper}>
        <SectionTitle
          prevAction={handleBackClick}
          title={"Add photo / video"}
        />
      </div>
      <TabsList
        tabs={tabs}
        activeIndex={currentTabIndex}
        setActiveIndex={setCurrentTabIndex}
      />
      <div className={styles.limits}>
        <LimitsBlock
          buttonsConfig={limitButtons}
          accountUniqCode={accountUniqCode}
        />
      </div>
    </EditContentLayout>
  );
}

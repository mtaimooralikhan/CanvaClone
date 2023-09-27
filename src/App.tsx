import React, { useEffect, useMemo, useState } from "react";
import { Transformer } from "react-konva";
import Header from "./header";
import Layout from "./layout";
import SettingBar from "./settingBar";
import TabGroup from "./tab";
import View from "./view";
import { StageData } from "./redux/currentStageData";
import useItem from "./hook/useItem";
import { StageDataListItem } from "./redux/StageDataList";
import useStageDataList from "./hook/useStageDataList";
import ImageItem, { ImageItemProps } from "./view/object/image";
import useSelection from "./hook/useSelection";
import useTab from "./hook/useTab";
import useTransformer from "./hook/useTransformer";
import useStage from "./hook/useStage";
import ShapeItem, { ShapeItemProps } from "./view/object/shape";
import useWorkHistory from "./hook/useWorkHistory";
import { initialStageDataList } from "./redux/initilaStageDataList";

export type FileKind = {
  "file-id": string;
  title: string;
  data: Record<string, any>[];
};

export type FileData = Record<string, FileKind>;

function App() {
  const [past, setPast] = useState<StageData[][]>([]);
  const [future, setFuture] = useState<StageData[][]>([]);
  const { goToFuture, goToPast, recordPast, clearHistory } = useWorkHistory(
    past,
    future,
    setPast,
    setFuture,
  );
  const transformer = useTransformer();
  const { selectedItems, onSelectItem, setSelectedItems, clearSelection }
    = useSelection(transformer);
  const { tabList, onClickTab, onCreateTab, onDeleteTab } = useTab(transformer, clearHistory);
  const { stageData } = useItem();
  const { initializeFileDataList, updateFileData } = useStageDataList();
  const stage = useStage();
 
  const currentTabId = useMemo(() => tabList.find((tab) => tab.active)?.id ?? null, [tabList]);

  const sortedStageData = useMemo(
    () =>
      stageData.sort((a, b) => {
        if (a.attrs.zIndex === b.attrs.zIndex) {
          if (a.attrs.zIndex < 0) {
            return b.attrs.updatedAt - a.attrs.updatedAt;
          }
          return a.attrs.updatedAt - b.attrs.updatedAt;
        }
        return a.attrs.zIndex - b.attrs.zIndex;
      }),
    [stageData],
  );

  const header = (
    <Header>
      <TabGroup
        onClickTab={onClickTab}
        tabList={tabList}
        onCreateTab={onCreateTab}
        onDeleteTab={onDeleteTab}
      />
    </Header>
  );


  const settingBar = (
    <SettingBar
      selectedItems={selectedItems}
      clearSelection={clearSelection}
      stageRef={stage.stageRef}
    />
  );

  const renderObject = (item: StageData) => {
    switch (item.attrs["data-item-type"]) {
      case "image":
        return (
          <ImageItem
            key={`image-${item.id}`}
            data={item as ImageItemProps["data"]}
            onSelect={onSelectItem}
          />
        );
      case "shape":
        return (
          <ShapeItem
            key={`shape-${item.id}`}
            data={item as ShapeItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
          />
        );
      default:
        return null;
    }
  };


  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      e.returnValue = "";
    });
    onCreateTab(undefined, initialStageDataList[0] as StageDataListItem);
    initializeFileDataList(initialStageDataList);
    stage.stageRef.current.setPosition({
      x: Math.max(Math.ceil(stage.stageRef.current.width() - 1280) / 2, 0),
      y: Math.max(Math.ceil(stage.stageRef.current.height() - 760) / 2, 0),
    });
    stage.stageRef.current.batchDraw();
  }, []);

  useEffect(() => {
    if (currentTabId) {
      updateFileData({
        id: currentTabId,
        data: stageData,
      });
    }
    recordPast(stageData);
  }, [stageData]);

  return (
    <Layout header={header} settingBar={settingBar}>
      <View onSelect={onSelectItem} stage={stage}>
        {stageData.length ? sortedStageData.map((item) => renderObject(item)) : null}
        <Transformer
          ref={transformer.transformerRef}
          keepRatio
          shouldOverdrawWholeArea
          boundBoxFunc={(_, newBox) => newBox}
          onTransformEnd={transformer.onTransformEnd}
        />
      </View>
    </Layout>
  );
}

export default App;

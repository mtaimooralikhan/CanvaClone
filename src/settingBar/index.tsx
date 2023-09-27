import React from "react";
import { Accordion } from "react-bootstrap";
import { Node, NodeConfig } from "konva/lib/Node";
import Widget, { WidgetKind } from "./Widget";
import widgetList from "../config/widget.json";
import ImageWidget from "./widgetList/ImageWidget";
import ColorPaletteWidget from "./widgetList/ColorPaletteWidget";
import useSelection from "../hook/useSelection";
import useStage from "../hook/useStage";
import ShapeWidget from "./widgetList/ShapeWidget";

export type SettingBarProps = {
  selectedItems: Node<NodeConfig>[];
  clearSelection: ReturnType<typeof useSelection>["clearSelection"];
  stageRef: ReturnType<typeof useStage>["stageRef"];
};

const Widgets = {
  colorPalette: (data: WidgetKind & SettingBarProps) => <ColorPaletteWidget data={data} />,
  image: (data: WidgetKind & SettingBarProps) => <ImageWidget />,
  shape: (data: WidgetKind & SettingBarProps) => <ShapeWidget />,
};

export type WidgetIDList = keyof typeof Widgets;

const SettingBar: React.FC<SettingBarProps> = (settingProps) => (
  <aside>
    <Accordion>
      {(widgetList as WidgetKind[]).map((data) => {
        console.log("data :: ", data);
        
        return(
          <Widget key={`widget-${data.id}`} data={{ ...data, ...settingProps }}>
            {Widgets[data.id] && Widgets[data.id]({ ...data, ...settingProps })}
          </Widget>
        );
      })}
    </Accordion>
  </aside>
);

export default SettingBar;

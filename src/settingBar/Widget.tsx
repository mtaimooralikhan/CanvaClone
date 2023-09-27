import React from "react";
import { Accordion } from "react-bootstrap";
import { WidgetIDList } from ".";
import colorStyles from "../style/color.module.css";
import overflowStyles from "../style/overflow.module.css";

export type WidgetKind = {
  id: WidgetIDList;
  name: string;
  [key: string]: any;
};

type WidgetProps = {
  data: WidgetKind;
  children: React.ReactElement;
};

const Widget: React.FC<WidgetProps> = ({ data, children }) => {
 
  return (
    <Accordion.Item eventKey={data.id}>
      <Accordion.Header>{data.id}</Accordion.Header>
      <Accordion.Body className={[colorStyles.whiteTheme, overflowStyles["auto-y"]].join(" ")}>
        {children}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default Widget;

declare module "react-resizable-panels" {
  import * as React from "react";

  export interface PanelGroupProps
    extends React.HTMLAttributes<HTMLDivElement> {
    direction?: "horizontal" | "vertical";
  }
  export const PanelGroup: React.FC<PanelGroupProps>;

  export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
    collapsible?: boolean;
    order?: number;
  }
  export const Panel: React.FC<PanelProps>;

  export interface PanelResizeHandleProps
    extends React.HTMLAttributes<HTMLDivElement> {
    hitAreaMargins?: number;
  }
  export const PanelResizeHandle: React.FC<PanelResizeHandleProps>;
}

declare module "react-graph-vis" {
    import { Network, NetworkEvents, Options, Node, Edge, DataSet, Data } from "vis";
    import { Component } from "react";
  
    export { Network, NetworkEvents, Options, Node, Edge, DataSet } from "vis";
  
    export interface graphEvents {
      [event: NetworkEvents]: (params?: any) => void;
    }
  
    export interface NetworkGraphProps {
      graph: any;
      options?: Options;
      events?: graphEvents;
      getNetwork?: (network: Network) => void;
      identifier?: string;
      style?: React.CSSProperties;
      getNodes?: (nodes: DataSet) => void;
      getEdges?: (edges: DataSet) => void;
    }
  
    export interface NetworkGraphState {
      identifier: string;
    }
  
    export default class NetworkGraph extends Component<
      NetworkGraphProps,
      NetworkGraphState
    > {
      render();
    }
  }
  
import Graph from 'vis-react';
import vis, { Data, Node, Edge, Options, NetworkEvents, IdType } from 'vis';

// Refer to https://codesandbox.io/embed/3vvy7xqo9m for more info.

interface ILensGraphProps {
  nodes: Node[];
  edges: Edge[];
}

const options: Options = {
  layout: {
    hierarchical: true
  },
  edges: {
    color: '#000000'
  },
  interaction: { hoverEdges: true }
};

const styleNodes = (nodes: Node[]) => new vis.DataSet(nodes.map(node => {
  node.font = { size: 24, color: 'black', face: 'courier', strokeWidth: 3, strokeColor: 'white', face: 'arial' }
  return node;
}));


const colorEdges = (edges: Edge[]) => new vis.DataSet(edges.map(edge => {
  edge.color = 'blue';
  edge.value = 5;
  return edge;
}));


export default function LensGraph({
  nodes, edges
}: ILensGraphProps) {
  const graph: Data = {
    nodes: styleNodes(nodes),
    edges: colorEdges(edges)
  }

  return <Graph
    graph={graph}
    options={options}
    events={{}}
    vis={vis}
  />;
}
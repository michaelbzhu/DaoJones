// import React from 'react';
// import Graph from "react-graph-vis";
// import vis, { Data, Node, Edge, Options } from 'vis';

// interface ILensGraphProps {
//   nodes: Node[];
//   edges: Edge[];
// }

// const options: Options = {
//   nodes: {
//     shape: 'dot',
//     size: 25
//   },
//   edges: {
//     smooth: {
//       enabled: true,
//       type: "vertical",
//       roundness: 0.5,
//     }
//   },
//   physics: {
//     barnesHut: {
//       gravitationalConstant: -5300,
//       springLength: 300,
//       avoidOverlap: 1
//     },
//     minVelocity: 0.75
//   }
// }

// const styleNodes = (nodes: Node[]) => new vis.DataSet(nodes.map(node => {
//   node.font = { size: 24, color: 'black', face: 'courier', strokeWidth: 3, strokeColor: 'white' }
//   return node;
// }));

// const colorEdges = (edges: Edge[]) => new vis.DataSet(edges.map(edge => {
//   edge.color = 'blue';
//   edge.value = 5;
//   return edge;
// }));

// export default function LensGraph({
//   nodes, edges
// }: ILensGraphProps) {
//   const graph: Data = {
//     nodes: styleNodes(nodes),
//     edges: colorEdges(edges)
//   }

//   return <Graph
//     graph={graph}
//     options={options}
//     events={{}}
//   />;
// }

export default 1

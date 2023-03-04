import React, { useState, useEffect } from 'react';
import Graph from "react-graph-vis";
import { DataSet } from "vis-data";
import { Node, Edge, Options } from 'vis';
import ky from 'ky';

const options: Options = {
  nodes: {
    shape: 'dot',
    size: 25
  },
  edges: {
    smooth: {
      enabled: true,
      type: "vertical",
      roundness: 0.5,
    }
  },
  physics: {
    barnesHut: {
      gravitationalConstant: -5300,
      springLength: 300,
      avoidOverlap: 1
    },
    minVelocity: 0.75
  }
}

const styleNodes = (nodes: Node[]) => new DataSet(nodes.map(node => {
  node.font = { size: 24, color: 'black', face: 'courier', strokeWidth: 3, strokeColor: 'white' }
  return node;
}));


const colorEdges = (edges: Edge[]) => new DataSet(edges.map(edge => {
  edge.color = 'blue';
  edge.value = 5;
  return edge;
}));


export default function LensGraph() {
  // Debounce this input
  const [lensAddress, setLensAddress] = useState('');
  // use ky to get graph data
  const [graphData, setGraphData] = useState<any>();

  useEffect(() => {
    if (lensAddress) {
      ky(`http://192.168.30.115:5000/${lensAddress}`)
        .then(res => res.json() as any)
        .then(({ nodes, edges }) => {
          const graph = {
            nodes: styleNodes(nodes),
            edges: colorEdges(edges)
          }
          setGraphData(graph);
        })
    }
  }, [lensAddress]);

  return <>
    <input type="text" value={lensAddress} onChange={(e) => setLensAddress(e.target.value)} />
    {graphData && <Graph
      graph={graphData}
      options={options}
      events={{}}
    />}
  </>;
}
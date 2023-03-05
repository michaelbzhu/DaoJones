import React, { useState, useEffect, useMemo } from 'react';
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

type LensNode = Node & {
  address: string,
  profiles: string[],
}

const styleNodes = (nodes: LensNode[]) => (nodes.map(node => {
  node.font = { size: 24, color: 'black', face: 'courier', strokeWidth: 3, strokeColor: 'white' }
  node.id = node.address;
  node.label = node.address;
  return node;
}));


const colorEdges = (edges: ([string, string])[]) => (edges.map(arr => {
  const edge: Edge = {
    from: arr[0],
    to: arr[1],
    color: 'blue',
    value: 5
  };
  return edge;
}));


export default function LensGraph() {
  // Debounce this input
  const [lensAddress, setLensAddress] = useState('0x0146a8');
  const [selectedNode, setSelectedNode] = useState<LensNode>();
  const [graphData, setGraphData] = useState<any>();

  useEffect(() => {
    if (lensAddress) {
      ky(`http://127.0.0.1:5000/${lensAddress}`)
        .then(res => res.json() as any)
        .then(({ nodes, edges }) => {
          const graph = {
            nodes: styleNodes(nodes),
            edges: colorEdges(edges)
          }
          setGraphData(graph);
          console.log(graph)
        })
      setSelectedNode(undefined);
    }
  }, [lensAddress]);

  const nodesByAddress = useMemo(() => {
    const ret: Record<string, LensNode> = {}
    graphData?.nodes?.forEach?.(node => {
      ret[node.address] = node;
    });
    return ret;
  }, [graphData]);

  return <>
    <input type="text" value={lensAddress} onChange={(e) => setLensAddress(e.target.value)} />
    {graphData &&
      <div className="flex w-full">
        <div
          tabIndex={0}
          className="h-[80vh] w-[60%] m-0"
        >
          <Graph
            key={lensAddress}
            graph={graphData}
            options={options}
            events={{
              select: (e) => {
                const node = nodesByAddress?.[e?.nodes?.[0]];
                console.log(node);
                setSelectedNode(node);
              }
            }}
          />
        </div>
        <div className="bg-white rounded-xl h-[80vh] w-[40%] m-0 p-8">
          {selectedNode
            ? <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <div className="text-xl">Address: </div>
                  {/* Subset of address displayed */}
                  <div className="text-xl">{selectedNode.address.slice(0, 9)}...</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-xl">Score: </div>
                  <div className="text-xl">{selectedNode.value}</div>
                </div>
                <div>
                  <div className="text-xl">Profiles: </div>
                  <ul>
                    {selectedNode.profiles?.map?.(profile => (
                      <li key={profile}>{profile}</li>
                    ))}
                  </ul>
                </div>
            </div>
            : 'Select a node to get started!'
          }
        </div>
      </div>}
  </>;
}
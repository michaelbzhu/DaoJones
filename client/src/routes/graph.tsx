import React, { useState, useEffect, useMemo } from 'react';
import Graph from "react-graph-vis";
import { Node, Edge, Options } from 'vis';
import ky from 'ky';
import Colors from 'colorjs.io';
import Loading from '../components/Loading';
import { getProfile, LensProfile } from '../utils/lens/getProfile'

const API_BASE = 'http://127.0.0.1:5000';

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
      "gravitationalConstant": -3900,
      "centralGravity": 0,
      springConstant: 0
    },
    minVelocity: 0.75
  }
}

type LensNode = Node & {
  address: string,
  profiles: string[],
  score: number,
}


const styleNodes = (nodes: LensNode[]) => (nodes.map(node => {
  node.font = { size: 24, color: 'black', face: 'courier', strokeWidth: 3, strokeColor: 'white' }
  const color = new Colors("p3", [1, 0, 0]);
  // Interpolate the color based on the value
  const range = color.range("green", {
    space: "lch", // interpolation space
    outputSpace: "srgb"
  })
  const value = Math.min(Math.max((node.value - 550) / (650 - 550), 0), 1);
  // Convert the value to a color
  node.color = node.value === 0 ? 'black' : "" + range(value)
  node.score = node.value;
  delete node.value;
  node.size = 30
  node.id = node.address;
  node.label = node.address.slice(0, 9) + "..." + node.address.slice(-4);
  return node;
}));


const colorEdges = (edges: ([string, string])[]) => (edges.map(arr => {
  const edge: Edge = {
    from: arr[0],
    to: arr[1],
    color: 'blue',
    value: 1
  };
  return edge;
}));


export default function LensGraph() {
  // Debounce this input
  const [isLoading, setIsLoading] = useState(false);
  const [lensAddress, setLensAddress] = useState('0xf30c');
  const [selectedNode, setSelectedNode] = useState<LensNode>();
  const [profilesData, setProfilesData] = useState<LensProfile[]>();
  const [graphData, setGraphData] = useState<any>();

  const nodesByAddress = useMemo(() => {
    const ret: Record<string, LensNode> = {}
    graphData?.nodes?.forEach?.(node => {
      ret[node.address] = node;
    });
    return ret;
  }, [graphData]);

  useEffect(() => {
    if (graphData?.nodes?.some?.((node: LensNode) => node.profiles.some(profile => profile === lensAddress))) {
      const node = graphData?.nodes?.find((node: LensNode) => node.profiles.some(profile => profile === lensAddress))
      const promises = node?.profiles?.map?.(async profile => {
        const profileData = await getProfile({ id: profile });
        return profileData;
      })
      Promise.all(promises).then(setProfilesData);
      setSelectedNode(node);
    }
  }, [graphData, lensAddress])

  useEffect(() => {
    if (lensAddress) {
      setIsLoading(true);
      ky(`${API_BASE}/${lensAddress}`, {
        timeout: false,
      })
        .then(res => res.json() as any)
        .then(({ nodes, edges }) => {
          const graph = {
            nodes: styleNodes(nodes),
            edges: colorEdges(edges)
          }
          setGraphData(graph);
          setIsLoading(false);
          console.log(graph)
        })
      setSelectedNode(undefined);
    }
  }, [lensAddress]);



  // Debounce this input
  const changeHandler = (e) => setLensAddress(e.target.value);

  return <>
    <input type="text" className="ml-12 mr-2 input bg-white" value={lensAddress} onChange={changeHandler} />
    <button className="btn bg-white" onClick={() => setLensAddress('0xf30c')}>Reset</button>
      <div className="flex w-full">
        <div
          tabIndex={0}
          className="h-[80vh] w-[60%] m-0"
        >
          {graphData ? <Graph
            graph={graphData}
            options={options}
            events={{
              select: (e) => {
                const node = nodesByAddress?.[e?.nodes?.[0]];
                setSelectedNode(node);
                if (!node) setProfilesData(undefined);
                else {
                  const promises = node?.profiles?.map?.(async profile => {
                    const profileData = await getProfile({ id: profile });
                    return profileData;
                  })
                  Promise.all(promises).then(setProfilesData);
                }
              }
            }}
          /> : <Loading className='mt-[30vh]' />}
        </div>
        <div className="bg-white rounded-xl h-[80vh] w-[40%] m-0 p-8">
          {!graphData ? <Loading className='mt-[20vh]' /> : selectedNode
            ? <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <div className="text-xl">Address: </div>
                {/* Subset of address displayed */}
                <div className="text-xl">{selectedNode.address.slice(0, 9)}...</div>
              </div>
              <div className="flex justify-between">
                <div className="text-xl">Score: </div>
                <div className="text-xl">{selectedNode.score}</div>
              </div>
              <div>
                {profilesData && <>
                  <div className="text-xl">Profiles: </div>
                  <ul>
                    {profilesData.map(profile => <li key={profile.id}>
                      <div className='flex flex-row bg-gray-400 text-white p-2 rounded-xl space-between-2'>
                        <div className='avatar mr-2'>
                          <div className="w-24 rounded-xl">
                            <img
                              className=''
                              src={((arg) => {
                                if (!arg) return '';
                                const [protocol, CID] = arg.split('://');
                                return protocol === 'ipfs' ? `https://ipfs.io/ipfs/${CID}` : arg;
                              })(profile?.picture?.original?.url)} alt={profile.name} />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-xl">{profile.name}</div>
                          <div className="text-xl">{profile.handle}</div>
                          <button className="button" onClick={() => setLensAddress(profile.id)}>Explore {'>'}</button>
                        </div>

                      </div>
                    </li>)}
                  </ul>
                </>}
              </div>
            </div>
            : isLoading ? <Loading className='mt-[20vh]' /> : 'Select a node to get started!'
          }
        </div>
      </div>
  </>;
}
import { type PropsWithChildren } from 'react';
import { Handle, Position } from 'reactflow';
import NodeTitle from './node-title';
import type { StoryNode } from '../../entities/story-node';
import NodeEffect from './node-effect';
import NodeText from './node-text';

interface Props {
  className?: string,
  selected: boolean;
  data: Partial<StoryNode>;
  label: string;
}

export default function NodeShell({ className, selected, children, data, label }: PropsWithChildren<Props>) {
  return (
    <div className={`p-2 shadow-md rounded-md border w-[250px] ${selected ? "border-stone-600" : "border-stone-400"} ${className}`}>
      <NodeTitle id={data.id} label={data.label ?? label} isStart={data.isStart} />
      <NodeEffect effect={data.effect} />
      <NodeText text={data.text} />

      {children}

      <Handle type="target" position={Position.Left} className="bg-slate-600 top-5" />
    </div>
  );
}

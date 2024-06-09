import type { StoryData } from "./story-data";
import type { StoryNode } from "./story-node";

export type StoryShortcut = {
  id: string;
  title?: string;
};

export type Story = StoryShortcut & {
  title: string;
  description?: string;
  startId: number;
  prefix?: string;
  data?: StoryData;
  position?: number[];
  nodes: StoryNode[];
};

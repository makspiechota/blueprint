export interface StrategicGoal {
  title: string;
  description: string;
}

export interface NorthStar {
  type: string;
  version: string;
  last_updated: string;
  title: string;
  vision: string;
  problem: string;
  solution: string;
  strategic_goals: StrategicGoal[];
}

export interface Task {
  id?: number;
  title: string;
  description: string;
  status: string;
  projectId: number;
  userId: number;
}

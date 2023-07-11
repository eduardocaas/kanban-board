export interface Task {
  id?: any;
  title: string;
  description: string;
  status: string;
  fk_project_id: number;
  fk_user_id: number;
}

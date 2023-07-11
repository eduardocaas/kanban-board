import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/model/task.model';
import { TaskService } from 'src/app/service/task.service';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent {

  id: any = this.route.snapshot.paramMap.get('id');

  task: Task = {
    title: '',
    description: '',
    status: 'BACKLOG',
    fk_project_id: this.id,
    fk_user_id: 1
  }

  constructor(private service: TaskService, private route: ActivatedRoute, private router: Router) {}

  tasksBacklog: Task[] = [];
  tasksDoing: Task[] = [];
  tasksDone: Task[] = [];

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.tasksBacklog = [];
    this.tasksDoing = [];
    this.tasksDone = [];
    this.findByProjectId(this.id);
  }

  findByProjectId(id: number) {
    this.service.findByProjectId(id).subscribe(response => {
      response.forEach(obj => {
        if (obj.status == 'BACKLOG') {
          this.tasksBacklog.push(obj);
        }
        else if (obj.status == 'DOING') {
          this.tasksDoing.push(obj);
        }
        else if (obj.status == 'DONE') {
          this.tasksDone.push(obj);
        }
      });
    });
  }

  save(): void {
    this.service.save(this.task).subscribe(response => {
      this.reloadData();
    });
  }

  update(id: any, status: number): void {


      this.service.findById(id).subscribe(response => {
        this.task.id = response.id;
        this.task.title = response.title;
        this.task.description = response.description;

        if (status == 1) {
          this.task.status = 'BACKLOG';
        }
        if (status == 2) {
          this.task.status = 'DOING';
        }
        else if (status == 3) {
          this.task.status = 'DONE';
        }

        this.task.fk_project_id = response.fk_project_id;
        this.task.fk_user_id = response.fk_user_id;

        this.service.update(this.task).subscribe(response => {
          this.reloadData();
        });
      });
  }

  delete(id: any): void {
    this.service.delete(id).subscribe(response => {
      this.reloadData();
    });
  }

}

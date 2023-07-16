import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/model/task.model';
import { TaskService } from 'src/app/service/task.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private service: TaskService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {}

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
    this.task.status = 'BACKLOG';
    console.log(this.task);
    this.service.save(this.task).subscribe(
      {
        next: () => {
          this.toastr.success('Task ' + this.task.title.toUpperCase() + ' created with success', 'Registry', { timeOut: 3000 });
          this.reloadData();
          this.clear();
        },
        error: (err) => {
          if (err.error.errors) {
            err.error.errors.forEach((e: { message: string }) => {
              this.toastr.error(e.message, 'Error', { timeOut: 6000 });
            });
          }
          else {
            this.toastr.error(err.error.message, 'Error', { timeOut: 6000 });
          }
        }
      }
    );
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
          this.clear();
          this.reloadData();
        });
      });
  }

  delete(id: any, title: string): void {
    this.service.delete(id).subscribe(response => {
      this.toastr.success(`Task ${title.toUpperCase()} removed with success`, 'Removal', { timeOut: 3000 });
      this.reloadData();
    });
  }

  clear(): void {
    this.task.id = null;
    this.task.title = '';
    this.task.description = '';
    this.task.status = 'BACKLOG';
    this.task.fk_project_id = this.id;
    this.task.fk_user_id = 1;
  }

}

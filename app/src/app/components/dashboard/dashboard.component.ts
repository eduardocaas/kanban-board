import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/model/project.model';
import { ProjectService } from 'src/app/service/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  project: Project = {
    title: ''
  }

  constructor(private service: ProjectService, private toastr: ToastrService) { }

  projects: Project[] = [];

  ngOnInit() {
    //this.reloadData();
    this.findAll();
  }

  reloadData() {
    this.projects = [];

  }

  findAll() {
    this.service.findAll().subscribe(response => {
      this.projects = response;
    });
  }

  save(): void {
    this.service.save(this.project)
      .subscribe(
        {
          next: () => {
            this.toastr.success('Project ' + this.project.title.toUpperCase() + ' created with success', 'Registry', { timeOut: 3000 });
            this.findAll();
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
          },
        }
      )
  }

  delete(id: any, title: string): void {
    this.service.delete(id)
      .subscribe(
        {
          next: () => {
            this.toastr.success('Project ' + title.toUpperCase() + ' removed with success', 'Removal', { timeOut: 3000 });
            this.reloadData();
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
      )
  }

  clear(): void {
    this.project.id = null;
    this.project.title = '';
  }
}

import { Component } from '@angular/core';
import { Project } from 'src/app/model/project.model';
import { ProjectService } from 'src/app/service/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private service: ProjectService) {}

  projects: Project[] = [];

  ngOnInit() {
    this.findAll();
  }

  findAll() {
    this.service.findAll().subscribe(response => {
      this.projects = response;
    });
  }
}

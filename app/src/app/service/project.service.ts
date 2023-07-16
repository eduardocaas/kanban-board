import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../model/project.model';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  save(project: Project): Observable<any> {
    return this.http.post<Project>(`${API_CONFIG.baseUrl}/project`, project);
  }

  findAll(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_CONFIG.baseUrl}/project`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.baseUrl}/project/${id}`);
  }
}

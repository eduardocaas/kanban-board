import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../model/task.model';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  save(task: Task): Observable<any> {
    return this.http.post<Task>(`${API_CONFIG.baseUrl}/task`, task);
  }

  findByProjectId(id: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${API_CONFIG.baseUrl}/task/${id}`);
  }

  findById(id: number): Observable<Task> {
    return this.http.get<Task>(`${API_CONFIG.baseUrl}/task/get/${id}`);
  }

  update(task: Task): Observable<Task> {
    return this.http.put<Task>(`${API_CONFIG.baseUrl}/task`, task);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.baseUrl}/task/${id}`);
  }

}

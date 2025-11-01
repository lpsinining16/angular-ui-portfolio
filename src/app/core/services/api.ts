import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';

import { Profile, Skill, Project, WorkExperience, ApiResponse, NavLinkMenu } from '../models/models';
import { environment } from '../../../environments/environment';
import * as mockData from '../data/mock-data';
export * from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  readonly profile = signal<Profile>({
    name: '', headline: '', brandName: '', summary: '', about: '', about2: '', about3: '',
    email: '', phone: '', location: '', linkedin: '', github: '', cvUrl: '', profilePhoto: '',
  });
  readonly workExperience = signal<WorkExperience[]>([]);
  readonly skills = signal<Skill[]>([]);
  readonly projects = signal<Project[]>([]);
  readonly navLinkMenu = signal<NavLinkMenu[]>([
    { label: 'Home', fragment: 'home' },
    { label: 'About', fragment: 'about' },
    { label: 'Skills', fragment: 'skills' },
    { label: 'Projects', fragment: 'projects' },
    { label: 'Contact Me', fragment: 'contact', isContact: true },
  ]);

  constructor() {
    console.log('🌐 Using API base URL:', this.baseUrl);
  }

  // --- PUBLIC METHOD FOR RESOLVER ---
  fetchAllInitialData(): Observable<any> {
    return forkJoin({
      profile: this.loadProfile(),
      workExperience: this.loadWorkExperience(),
      skills: this.loadSkills(),
      projects: this.loadProjects(),
    }).pipe(
      catchError(error => {
        console.warn('API fetch failed, falling back to local mock data.', error);

        this.profile.set(mockData.profile as unknown as Profile);
        this.workExperience.set(mockData.workExperience as unknown as WorkExperience[]);
        this.skills.set(mockData.skills as unknown as Skill[]);
        this.projects.set(mockData.projects as unknown as Project[]);


        return of(null); 
      })
    );
  }

  // --- PRIVATE DATA-LOADING METHODS ---

  private loadProfile(): Observable<Profile> {
    return this.http
      .get<ApiResponse<Profile>>(`${this.baseUrl}/profile`)
      .pipe(
        map((response) => response.data),
        tap((data) => this.profile.set(data))
      );
  }

  private loadWorkExperience(): Observable<WorkExperience[]> {
    return this.http
      .get<ApiResponse<WorkExperience[]>>(`${this.baseUrl}/work-experience`)
      .pipe(
        map((response) => response.data),
        tap((data) => this.workExperience.set(data))
      );
  }

  private loadSkills(): Observable<Skill[]> {
    return this.http
      .get<ApiResponse<Skill[]>>(`${this.baseUrl}/skills`)
      .pipe(
        map((response) => response.data),
        tap((data) => this.skills.set(data))
      );
  }

  private loadProjects(): Observable<Project[]> {
    return this.http
      .get<ApiResponse<Project[]>>(`${this.baseUrl}/projects`)
      .pipe(
        map((response) => response.data),
        tap((data) => this.projects.set(data))
      );
  }
}
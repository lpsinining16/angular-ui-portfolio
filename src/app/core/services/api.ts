import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { NavLink, Profile, Skill, Project, WorkExperience, ApiResponse } from '../models/models';
import { environment } from '../../../envronments/envronments';
export * from '../models/models';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Inject the HttpClient
  private http = inject(HttpClient);

  // Define the base URL for our backend
  // private baseUrl = 'http://localhost:3000/api/v1';
  private baseUrl = environment.apiUrl;

  // --- SIGNALS ---
  // Initialize signals as empty or with a default object.
  // This prevents 'null' errors in components.
  readonly navLinks = signal<NavLink[]>([]);
  readonly profile = signal<Profile>({
    name: '',
    headline: '',
    brandName: '',
    summary: '',
    about: '',
    about2: '',
    about3: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    cvUrl: '',
    profilePhoto: '',
  });
  readonly workExperience = signal<WorkExperience[]>([]);
  readonly skills = signal<Skill[]>([]);
  readonly projects = signal<Project[]>([]);

  constructor() {
    // Load all data when the service is first created
    this.loadNavLinks();
    this.loadProfile();
    this.loadWorkExperience();
    this.loadSkills();
    this.loadProjects();
  }

  // --- PRIVATE DATA-LOADING METHODS ---

  private loadNavLinks() {
    this.http
      .get<ApiResponse<NavLink[]>>(`${this.baseUrl}/nav-links`)
      .pipe(
        map((response) => response.data), // Extract the 'data' array from the response
        tap((data) => {
          console.log('Extracted NavLink data:', data);
          this.navLinks.set(data);
        }) // Set the navLinks signal
      )
      .subscribe(); // Execute the request
  }

  private loadProfile() {
    this.http
      .get<ApiResponse<Profile>>(`${this.baseUrl}/profile`)
      .pipe(
        map((response) => response.data), // Extract the 'data' object
        tap((data) => {
          console.log('Extracted Profile data:', data);
          this.profile.set(data);
        }) // Set the profile signal
      )
      .subscribe();
  }

  private loadWorkExperience() {
    this.http
      .get<ApiResponse<WorkExperience[]>>(`${this.baseUrl}/work-experience`)
      .pipe(
        map((response) => response.data),
        tap((data) => {
          console.log('Extracted WorkExperience data:', data);
          this.workExperience.set(data);
        })
      )
      .subscribe();
  }

  private loadSkills() {
    this.http
      .get<ApiResponse<Skill[]>>(`${this.baseUrl}/skills`)
      .pipe(
        map((response) => response.data),
        tap((data) => {
          console.log('Extracted skills data:', data);
          this.skills.set(data);
        })
      )
      .subscribe();
  }

  private loadProjects() {
    this.http
      .get<ApiResponse<Project[]>>(`${this.baseUrl}/projects`)
      .pipe(
        map((response) => response.data),
        tap((data) => {
          console.log('Extracted projects data:', data);
          this.projects.set(data);
        })
      )
      .subscribe();
  }

  // --- PUBLIC METHODS (Example for future use) ---

  /**
   * Example of a method to get a single project by ID.
   * This isn't used by the constructor but can be called by a component.
   */
  getProjectById(id: string): Observable<Project> {
    return this.http
      .get<ApiResponse<Project>>(`${this.baseUrl}/projects/${id}`)
      .pipe(map((response) => response.data));
  }
}

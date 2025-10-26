import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ApiService, Project } from '../../core/services/api';
import { SoundService } from '../../core/services/sound';
import { Bubble, Bubbles } from '../../shared/components/bubbles/bubbles';

@Component({
  selector: 'app-projects',
  standalone: true, // standalone is a good practice!
  imports: [CommonModule, Bubbles],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Add host listener for Escape key
  host: {
    '(document:keydown.escape)': 'onEscapeKeyPressed()',
  },
})
export class Projects {
  private apiService = inject(ApiService);
  private soundService = inject(SoundService);
  // Inject DOCUMENT for safe body class manipulation
  private document = inject(DOCUMENT);
  private projects = this.apiService.projects;

  selectedProject = signal<Project | null>(null);

  groupedProjects = computed(() => {
    const projects = this.projects();
    if (!projects) return [];

    const groups = projects.reduce((acc, project) => {
      const group = acc.find((g) => g.type === project.type);
      if (group) {
        group.projects.push(project);
      } else {
        acc.push({ type: project.type, projects: [project] });
      }
      return acc;
    }, [] as { type: string; projects: Project[] }[]);

    return groups.sort((a, b) => (a.type === 'professional' ? -1 : 1));
  });

  openProjectModal(project: Project): void {
    this.soundService.playSound('click');
    this.selectedProject.set(project);
    // Safe way to prevent body scroll
    this.document.body.classList.add('modal-open');
  }

  closeProjectModal(): void {
    if (this.selectedProject()) { // Only run if modal is open
      this.soundService.playSound('clickClose');
      this.selectedProject.set(null);
      // Safe way to restore body scroll
      this.document.body.classList.remove('modal-open');
    }
  }

  // Handle Escape key press
  onEscapeKeyPressed(): void {
    this.closeProjectModal();
  }

  // --- Bubbles Configuration ---
  bubblesConfig: Bubble[] = [
    { customStyles: { '--size': '40px', '--left': '10%', '--duration': '15s', '--delay': '0s', 'animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '80px', '--left': '20%', '--duration': '18s', '--delay': '2s', 'animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '15px', '--left': '35%', '--duration': '25s', '--delay': '5s', 'animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '100px', '--left': '50%', '--duration': '12s', '--delay': '1s', 'animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '30px', '--left': '60%', '--duration': '22s', '--delay': '7s', 'animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '25px', '--left': '75%', '--duration': '16s', '--delay': '3s', 'animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '35px', '--left': '85%', '--duration': '20s', '--delay': '6s', 'animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '50px', '--left': '90%', '--duration': '30s', '--delay': '8s', 'animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '45px', '--left': '5%', '--duration': '14s', '--delay': '4s', 'animation-name': 'rise', 'bottom': '-100px' } },
    { customStyles: { '--size': '80px', '--left': '95%', '--duration': '19s', '--delay': '1s', 'animation-name': 'rise', 'bottom': '-100px' } },
  ];
}
import { Injectable, signal } from '@angular/core';

export interface NavLink {
  label: string;
  fragment: string;
  isContact?: boolean;
}

export interface Profile {
  name: string;
  headline: string;
  brandName: string;
  summary: string;
  about: string;
  about2: string;
  about3: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  cvUrl: string;
  profilePhoto: string;
}

export interface Skill {
  category: string;
  technologies: string[];
}

export interface IconSkill {
  name: string;
  iconClass: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  animationDelay: string;
}

export interface CoreFunction {
  function: string;
  description: string;
}

export interface System {
  title: string;
  summary?: string; // ADDED: A concise summary for the system
  tags: string[];
  link: string;
  coreFunctions?: CoreFunction[];
}

export interface Project {
  title: string;
  type: 'professional' | 'personal';
  company: string;
  link?: string;
  description: string;
  technologies: string[];
  systems: System[];
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  points: string[];
  isDevRole: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // --- NAVIGATION ---
  readonly navLinks = signal<NavLink[]>([
    { label: 'Home', fragment: 'home' },
    { label: 'About', fragment: 'about' },
    { label: 'Skills', fragment: 'skills' },
    { label: 'Projects', fragment: 'projects' },
    { label: 'Contact Me', fragment: 'contact', isContact: true },
  ]);

  profile = signal<Profile>({
    name: 'Larry Sinining',
    headline: 'Software Engineer | Front-End Engineer',
    brandName: 'larscript',
    summary: `Detail-oriented Software Engineer with over 9 years of experience in web and desktop application development. Skilled in Angular, REST APIs, JavaScript and TypeScript. I enjoy building clean, user-friendly Interfaces and working collaboratively in Agile teams. Always eager to learn new technologies and contribute to efficient, high-quality software.`,
    about: `I am a passionate and dedicated software engineer with a strong background in front-end
      development, particularly with Angular. With over 9 years in the industry, I've had the opportunity to
      work on a diverse range of projects, from modernizing legacy desktop applications to building
      enterprise-grade web systems for global clients.`,
    about2: `My journey in tech began with a curiosity for how things work, which led me to a degree in
      Computer Engineering. I thrive in collaborative environments, leveraging Agile methodologies to
      deliver efficient, scalable, and user-friendly solutions. I'm always eager to learn and adapt to new
      technologies to continuously improve my craft and contribute effectively to my team.`,
    about3: `When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and
      spending time with my family.`,
    email: 'larry.sinining@gmail.com',
    phone: '+639271282408',
    location: 'General Trias, Cavite, PH',
    linkedin: 'https://linkedin.com/in/lpsinining',
    github: 'https://github.com/lpsinining16',
    cvUrl: 'documents/larry-sinining-cv.pdf',
    profilePhoto: 'images/lps_profile.png',
  });

  workExperience = signal<WorkExperience[]>([
    {
      title: 'Custom Software Engineering Specialist',
      company: 'Accenture Inc.',
      duration: '2022-12-01 - Present',
      points: [
        'Developed and maintained web applications for casino systems using Angular and PrimeNG.',
        'Collaborated with cross-functional teams to deliver new features.',
        'Handled front-end tasks, version upgrades, and UX enhancements.',
        'Supported debugging and issue resolution for production environments.',
      ],
      isDevRole: true,
    },
    {
      title: 'Advanced App Engineering Senior Analyst',
      company: 'Accenture Inc.',
      duration: '2021-04-21 - 2022-11-30',
      points: [
        'Built and maintained front-end modules using Angular and PrimeNG.',
        'Participated in the migration of Angular, PrimeNG, and Bootstrap versions.',
        'Conducted peer code reviews and contributed to knowledge-sharing sessions.',
        'Worked on UI automation testing using Selenium integrated with Spring Boot.',
      ],
      isDevRole: true,
    },
    {
      title: 'Team Lead, Software Engineering',
      company: 'Intellicare - Asalus Corporation',
      duration: '2016-11-01 - 2021-04-20',
      points: [
        'Led a team in building internal applications using Angular and ASP.NET MVC (C#).',
        'Oversaw design of Angular Material-based front-end modules.',
        'Guided and mentored junior developers.',
        'Collaborated with business stakeholders to gather requirements.',
      ],
      isDevRole: true,
    },
    {
      title: 'Software Developer',
      company: 'Intellicare - Asalus Corporation',
      duration: '2016-03-01 - 2016-10-31',
      points: [
        'Developed and enhanced internal applications using Visual FoxPro.',
        'Assisted in requirements gathering, coding, debugging, and deploying solutions.',
        'Collaborated with business stakeholders to gather requirements.',
      ],
      isDevRole: true,
    },
    {
      title: 'Technical and Customer Support',
      company: 'Sky Cable Corporation',
      duration: '2014-08-01 - 2015-12-31',
      points: [
        'Provided technical support for Sky Broadband customers.',
        'Assisted in customer troubleshooting, achieving a high first-call resolution rate.',
        'Coordinated with technical teams for issue resolution.',
      ],
      isDevRole: false,
    },
  ]);

  skills = signal<Skill[]>([
    {
      category: 'Front-End Development',
      technologies: [
        'Angular',
        'TypeScript',
        'JavaScript',
        'PrimeNG',
        'Angular Material',
        'Bootstrap',
        'HTML',
        'CSS',
      ],
    },
    {
      category: 'Back-End & APIs',
      technologies: ['RESTful APIs', 'ASP.NET C#', 'Visual FoxPro', 'Node.js', 'Express.js'],
    },
    { category: 'Databases', technologies: ['MS SQL Server', 'MongoDB (Robo3T)'] },
    {
      category: 'Version Control & Tools',
      technologies: [
        'Git',
        'GitLab',
        'SVN',
        'IntelliJ IDEA',
        'ServiceNow',
        'Kubernetes',
        'Visual Studio Code',
        'Jaspersoft Studio',
      ],
    },
    { category: 'Testing', technologies: ['Selenium'] },
    { category: 'Methodologies', technologies: ['Agile/Scrum'] },
  ]);

  skillIcons: IconSkill[] = [
    // Front-End Skills (Lower-Right)
    {
      name: 'Angular',
      iconClass: 'bx bxl-angular',
      bottom: '15%',
      right: '10%',
      animationDelay: '2.2s',
    },
    {
      name: 'TypeScript',
      iconClass: 'bx bxl-typescript',
      bottom: '30%',
      right: '-5%',
      animationDelay: '2.8s',
    },
    {
      name: 'JavaScript',
      iconClass: 'bx bxl-javascript',
      bottom: '5%',
      right: '35%',
      animationDelay: '3.1s',
    },
    {
      name: 'PrimeNG',
      iconClass: 'bx bx-layer',
      bottom: '45%',
      right: '5%',
      animationDelay: '2.5s',
    },
    {
      name: 'Angular Material',
      iconClass: 'bx bxl-angular',
      bottom: '10%',
      right: '60%',
      animationDelay: '3.4s',
    },
    {
      name: 'Bootstrap',
      iconClass: 'bx bxl-bootstrap',
      bottom: '30%',
      right: '75%',
      animationDelay: '3.8s',
    },
    {
      name: 'HTML',
      iconClass: 'bx bxl-html5',
      bottom: '50%',
      right: '65%',
      animationDelay: '2.1s',
    },
    { name: 'CSS', iconClass: 'bx bxl-css3', bottom: '60%', right: '30%', animationDelay: '4.0s' },
    // Back-End Skills (Upper-Right)
    {
      name: 'RESTful APIs',
      iconClass: 'bx bx-network-chart',
      top: '15%',
      right: '10%',
      animationDelay: '2.3s',
    },
    {
      name: 'ASP.NET C#',
      iconClass: 'bx bx-code-curly',
      top: '30%',
      right: '-5%',
      animationDelay: '2.9s',
    },
    {
      name: 'Visual FoxPro',
      iconClass: 'bx bx-data',
      top: '5%',
      right: '35%',
      animationDelay: '3.2s',
    },
    {
      name: 'Node.js',
      iconClass: 'bx bxl-nodejs',
      top: '45%',
      right: '5%',
      animationDelay: '2.6s',
    },
    {
      name: 'Express.js',
      iconClass: 'bx bx-fast-forward',
      top: '10%',
      right: '60%',
      animationDelay: '3.5s',
    },
  ];

  projects = signal<Project[]>([
    // ========================================================================
    // PROFESSIONAL PROJECTS
    // ========================================================================
    {
      title: 'Casino Patron and Gaming Systems',
      type: 'professional',
      company: 'Accenture Inc.',
      link: '',
      description:
        'A suite of enterprise-grade applications for a global casino systems client, focusing on patron management, loyalty, and financial transactions.',
      technologies: ['Angular', 'PrimeNG', 'Bootstrap', 'TypeScript', 'Spring Boot', 'Selenium'],
      systems: [
        {
          title: 'Casino Management System (CMS)',
          summary:
            'The core application for managing the entire patron lifecycle, from registration and loyalty tracking to credit and promotions.',
          tags: ['Patron Management', 'Gaming Operations', 'Loyalty'],
          link: '',
          coreFunctions: [
            {
              function: 'Patron Management',
              description:
                'Manages customer profiles, registration, and personalized interactions for gaming venue operations',
            },
            {
              function: 'Loyalty Tracking',
              description:
                'Tracks points, tiers, and rewards to encourage repeat visits and spending',
            },
            {
              function: 'Promotion Issuance',
              description:
                'Orchestrates campaigns, coupons, and targeted offers based on patron behavior and game ratings',
            },
            {
              function: 'VIK Self-Service',
              description:
                'Provides kiosks for account balance checks, point views, PIN resets, and reward browsing',
            },
            {
              function: 'Credit Control',
              description:
                'Oversees patron credit limits, markers, and financial transactions for risk management',
            },
            {
              function: 'Table Game Management',
              description:
                'Handles real-time table openings, sessions, and inventory updates via event-driven microservices',
            },
            {
              function: 'Reporting and Reconciliation',
              description:
                'Generates analytics, audit logs, and scheduled jobs for compliance and operational insights',
            },
          ],
        },
        {
          title: 'PIT Management System',
          summary:
            'A real-time dashboard for pit bosses to manage table statuses, track dealer performance, and rate player activity on the casino floor.',
          tags: ['Table Management', 'Player Ratings', 'Staff Tracking'],
          link: '',
          coreFunctions: [
            {
              function: 'Table Status Management',
              description: 'Opens/closes tables, sets limits, and tracks occupancy',
            },
            {
              function: 'Employee Tracking',
              description: 'Assigns dealers, logs shift changes, and monitors performance',
            },
            {
              function: 'Player Ratings',
              description: 'Records average bets, time played, and other loyalty metrics',
            },
            {
              function: 'Transaction Initiation',
              description: 'Sends fill/credit requests to Cage based on table needs',
            },
            {
              function: 'Turnover Reporting',
              description: 'Analyzes table profitability and player value',
            },
            {
              function: 'Operational Oversight',
              description: 'Enables pit bosses to monitor game flow and enforce SOPs',
            },
            {
              function: 'Compliance Enforcement',
              description: 'Ensures adherence to gaming rules and internal controls',
            },
          ],
        },
        {
          title: 'CAGE System',
          summary:
            'The central "bank" of the casino, handling all financial transactions including chip exchanges, credit markers, and currency conversion.',
          tags: ['Financial Transactions', 'Chip Management', 'Security'],
          link: '',
          coreFunctions: [
            {
              function: 'Chip Exchanges',
              description: 'Players buy chips with cash or redeem chips for cash',
            },
            {
              function: 'Fills and Credits',
              description: 'Supplies chips to tables (fills) and retrieves excess chips (credits)',
            },
            {
              function: 'Currency Exchange',
              description:
                'Converts foreign currencies to local currency and vice versa, often with real-time rate tracking and receipt generation',
            },
            {
              function: 'Marker Issuance',
              description:
                'Extends credit to players, typically tracked against player ratings or history',
            },
            {
              function: 'Employee Accountability',
              description: 'Tracks cashier shifts, drawer balances, and variances',
            },
            {
              function: 'Reconciliation and Reporting',
              description: 'Summarizes daily cash flow, variances, and audit logs for compliance',
            },
          ],
        },
        {
          title: 'Gaming Table Transaction Tracker',
          summary:
            'A specialized tool for logging and auditing all financial activities at the table level for compliance and accountability.',
          tags: ['Transaction Logging', 'Audit Trail', 'Compliance'],
          link: '',
          coreFunctions: [
            {
              function: 'Table Fill/Credit Logging',
              description: 'Tracks chip movements between Cage and tables for accountability',
            },
            {
              function: 'Player Buy-in/Cash-out',
              description: 'Records individual player transactions at the table level',
            },
            {
              function: 'Transaction Audit Trail',
              description: 'Maintains detailed logs for compliance and variance tracking',
            },
            {
              function: 'Shift Reporting',
              description: 'Summarizes table-level activity per shift for operational review',
            },
            {
              function: 'Rating Integration',
              description: 'Syncs with player rating systems to support comps and loyalty programs',
            },
            {
              function: 'Cage System Sync',
              description: 'Interfaces with Cage for financial reconciliation and chip flow',
            },
            {
              function: 'Real-Time Table Monitoring',
              description: 'Logs live transactions and chip flow for operational visibility',
            },
            {
              function: 'Compliance Support',
              description: 'Ensures traceability and audit readiness for gaming regulators',
            },
          ],
        },
      ],
    },
    {
      title: 'Internal Corporate Web Portals',
      type: 'professional',
      company: 'Intellicare - Asalus Corporation',
      link: '',
      description:
        'Developed a series of internal web applications to streamline business operations, from clinic management to user access control.',
      technologies: ['Angular', 'Angular Material', 'ASP.NET C#', 'RESTful APIs', 'MS SQL Server'],
      systems: [
        {
          title: 'Clinic Management Portal',
          summary:
            'An administrative application for managing the directory, accreditation, and services of partner clinics.',
          tags: ['Angular', 'Angular Material'],
          link: '',
          coreFunctions: [
            {
              function: 'Clinic Directory',
              description:
                'Maintained a searchable database of accredited clinics, including contact details and services offered.',
            },
            {
              function: 'Accreditation Management',
              description: 'Streamlined the application and renewal process for partner clinics.',
            },
            {
              function: 'Service Configuration',
              description:
                'Allowed administrators to manage the list of medical services available at each clinic.',
            },
          ],
        },
        {
          title: 'Business Scorecard Portal',
          summary:
            'A data visualization tool for tracking Key Performance Indicators (KPIs) and generating performance reports.',
          tags: ['Angular', 'Data Visualization'],
          link: '',
          coreFunctions: [
            {
              function: 'KPI Tracking',
              description:
                'Displayed key performance indicators for various business units in real-time.',
            },
            {
              function: 'Data Visualization',
              description:
                'Generated charts and graphs to visualize performance trends and targets.',
            },
            {
              function: 'Report Generation',
              description:
                'Allowed users to export performance data and reports for meetings and analysis.',
            },
          ],
        },
        {
          title: 'System Access Portal',
          summary:
            'A security-focused application for managing user accounts, roles, and permissions across internal systems.',
          tags: ['Angular', 'Security', 'User Management'],
          link: '',
          coreFunctions: [
            {
              function: 'User Provisioning',
              description: 'Managed the creation, modification, and deletion of user accounts.',
            },
            {
              function: 'Role-Based Access Control',
              description:
                'Assigned permissions to users based on their roles and responsibilities.',
            },
            {
              function: 'Audit Logging',
              description:
                'Tracked user activity and system access for security and compliance purposes.',
            },
          ],
        },
        {
          title: 'Intellimed Portal',
          summary:
            'A healthcare application providing secure access to patient records, appointment scheduling, and e-prescribing.',
          tags: ['Angular', 'Healthcare IT'],
          link: '',
          coreFunctions: [
            {
              function: 'Patient Records',
              description: 'Provided secure access to patient medical records and history.',
            },
            {
              function: 'Appointment Scheduling',
              description: 'Allowed patients and staff to schedule and manage appointments.',
            },
            {
              function: 'E-Prescribing',
              description: 'Enabled doctors to electronically send prescriptions to pharmacies.',
            },
          ],
        },
      ],
    },

    // ========================================================================
    // PERSONAL PROJECTS (Showcase Case Studies & Portfolio)
    // ========================================================================
    {
      title: 'This Portfolio Website',
      type: 'personal',
      company: '',
      link: '/', // Links to home
      description:
        'The very website you are on right now. A modern, performant portfolio built from the ground up with Angular, TypeScript, and Tailwind CSS to showcase my skills and projects.',
      technologies: ['Angular', 'Tailwind CSS', 'TypeScript', 'SCSS', 'Signals'],
      systems: [
        {
          title: 'Core Architecture',
          summary:
            'The foundational structure of this portfolio, built with modern, performant technologies and best practices.',
          tags: ['Angular', 'Standalone Components', 'Signals'],
          link: '',
          coreFunctions: [
            {
              function: 'Component-Based Design',
              description:
                'Built with standalone components for maximum modularity and reusability.',
            },
            {
              function: 'Reactive State Management',
              description: 'Uses Angular Signals for efficient and fine-grained state management.',
            },
            {
              function: 'Responsive UI/UX',
              description:
                'Fully responsive design that adapts beautifully from mobile to desktop screens.',
            },
            {
              function: 'Theming Engine',
              description:
                'Uses global CSS variables for a consistent and easily configurable light/dark mode theme.',
            },
          ],
        },
      ],
    },
    // -- COPY OF PROFESSIONAL PROJECT 1 FOR CASE STUDY --
    {
      title: 'Portfolio Case Study: Casino Gaming Systems',
      type: 'personal',
      company: '', // Empty for personal case study
      link: '', // Future link to detailed case study page
      description:
        'A detailed case study of the enterprise-grade application suite built for a global casino client while at Accenture Inc. This showcase demonstrates my ability to work on complex, large-scale systems.',
      technologies: ['Angular', 'PrimeNG', 'Bootstrap', 'TypeScript', 'Spring Boot', 'Selenium'],
      systems: [
        {
          title: 'Casino Management System (CMS)',
          summary:
            'The core application for managing the entire patron lifecycle, from registration and loyalty tracking to credit and promotions.',
          tags: ['Patron Management', 'Gaming Operations', 'Loyalty'],
          link: '',
          coreFunctions: [
            {
              function: 'Patron Management',
              description:
                'Manages customer profiles, registration, and personalized interactions for gaming venue operations',
            },
            {
              function: 'Loyalty Tracking',
              description:
                'Tracks points, tiers, and rewards to encourage repeat visits and spending',
            },
            {
              function: 'Promotion Issuance',
              description:
                'Orchestrates campaigns, coupons, and targeted offers based on patron behavior and game ratings',
            },
            {
              function: 'VIK Self-Service',
              description:
                'Provides kiosks for account balance checks, point views, PIN resets, and reward browsing',
            },
            {
              function: 'Credit Control',
              description:
                'Oversees patron credit limits, markers, and financial transactions for risk management',
            },
            {
              function: 'Table Game Management',
              description:
                'Handles real-time table openings, sessions, and inventory updates via event-driven microservices',
            },
            {
              function: 'Reporting and Reconciliation',
              description:
                'Generates analytics, audit logs, and scheduled jobs for compliance and operational insights',
            },
          ],
        },
        {
          title: 'PIT Management System',
          summary:
            'A real-time dashboard for pit bosses to manage table statuses, track dealer performance, and rate player activity on the casino floor.',
          tags: ['Table Management', 'Player Ratings', 'Staff Tracking'],
          link: '',
          coreFunctions: [
            {
              function: 'Table Status Management',
              description: 'Opens/closes tables, sets limits, and tracks occupancy',
            },
            {
              function: 'Employee Tracking',
              description: 'Assigns dealers, logs shift changes, and monitors performance',
            },
            {
              function: 'Player Ratings',
              description: 'Records average bets, time played, and other loyalty metrics',
            },
            {
              function: 'Transaction Initiation',
              description: 'Sends fill/credit requests to Cage based on table needs',
            },
            {
              function: 'Turnover Reporting',
              description: 'Analyzes table profitability and player value',
            },
            {
              function: 'Operational Oversight',
              description: 'Enables pit bosses to monitor game flow and enforce SOPs',
            },
            {
              function: 'Compliance Enforcement',
              description: 'Ensures adherence to gaming rules and internal controls',
            },
          ],
        },
        {
          title: 'CAGE System',
          summary:
            'The central "bank" of the casino, handling all financial transactions including chip exchanges, credit markers, and currency conversion.',
          tags: ['Financial Transactions', 'Chip Management', 'Security'],
          link: '',
          coreFunctions: [
            {
              function: 'Chip Exchanges',
              description: 'Players buy chips with cash or redeem chips for cash',
            },
            {
              function: 'Fills and Credits',
              description: 'Supplies chips to tables (fills) and retrieves excess chips (credits)',
            },
            {
              function: 'Currency Exchange',
              description:
                'Converts foreign currencies to local currency and vice versa, often with real-time rate tracking and receipt generation',
            },
            {
              function: 'Marker Issuance',
              description:
                'Extends credit to players, typically tracked against player ratings or history',
            },
            {
              function: 'Employee Accountability',
              description: 'Tracks cashier shifts, drawer balances, and variances',
            },
            {
              function: 'Reconciliation and Reporting',
              description: 'Summarizes daily cash flow, variances, and audit logs for compliance',
            },
          ],
        },
        {
          title: 'Gaming Table Transaction Tracker',
          summary:
            'A specialized tool for logging and auditing all financial activities at the table level for compliance and accountability.',
          tags: ['Transaction Logging', 'Audit Trail', 'Compliance'],
          link: '',
          coreFunctions: [
            {
              function: 'Table Fill/Credit Logging',
              description: 'Tracks chip movements between Cage and tables for accountability',
            },
            {
              function: 'Player Buy-in/Cash-out',
              description: 'Records individual player transactions at the table level',
            },
            {
              function: 'Transaction Audit Trail',
              description: 'Maintains detailed logs for compliance and variance tracking',
            },
            {
              function: 'Shift Reporting',
              description: 'Summarizes table-level activity per shift for operational review',
            },
            {
              function: 'Rating Integration',
              description: 'Syncs with player rating systems to support comps and loyalty programs',
            },
            {
              function: 'Cage System Sync',
              description: 'Interfaces with Cage for financial reconciliation and chip flow',
            },
            {
              function: 'Real-Time Table Monitoring',
              description: 'Logs live transactions and chip flow for operational visibility',
            },
            {
              function: 'Compliance Support',
              description: 'Ensures traceability and audit readiness for gaming regulators',
            },
          ],
        },
      ],
    },
    // -- COPY OF PROFESSIONAL PROJECT 2 FOR CASE STUDY --
    {
      title: 'Portfolio Case Study: Internal Corporate Portals',
      type: 'personal',
      company: '', // Empty for personal case study
      link: '', // Future link
      description:
        'A showcase of internal web applications developed to streamline business operations at Intellicare - Asalus Corporation. This demonstrates experience in building practical, data-driven tools for corporate environments.',
      technologies: ['Angular', 'Angular Material', 'ASP.NET C#', 'RESTful APIs', 'MS SQL Server'],
      systems: [
        {
          title: 'Clinic Management Portal',
          summary:
            'An administrative application for managing the directory, accreditation, and services of partner clinics.',
          tags: ['Angular', 'Angular Material'],
          link: '',
          coreFunctions: [
            {
              function: 'Clinic Directory',
              description:
                'Maintained a searchable database of accredited clinics, including contact details and services offered.',
            },
            {
              function: 'Accreditation Management',
              description: 'Streamlined the application and renewal process for partner clinics.',
            },
            {
              function: 'Service Configuration',
              description:
                'Allowed administrators to manage the list of medical services available at each clinic.',
            },
          ],
        },
        {
          title: 'Business Scorecard Portal',
          summary:
            'A data visualization tool for tracking Key Performance Indicators (KPIs) and generating performance reports.',
          tags: ['Angular', 'Data Visualization'],
          link: '',
          coreFunctions: [
            {
              function: 'KPI Tracking',
              description:
                'Displayed key performance indicators for various business units in real-time.',
            },
            {
              function: 'Data Visualization',
              description:
                'Generated charts and graphs to visualize performance trends and targets.',
            },
            {
              function: 'Report Generation',
              description:
                'Allowed users to export performance data and reports for meetings and analysis.',
            },
          ],
        },
        {
          title: 'System Access Portal',
          summary:
            'A security-focused application for managing user accounts, roles, and permissions across internal systems.',
          tags: ['Angular', 'Security', 'User Management'],
          link: '',
          coreFunctions: [
            {
              function: 'User Provisioning',
              description: 'Managed the creation, modification, and deletion of user accounts.',
            },
            {
              function: 'Role-Based Access Control',
              description:
                'Assigned permissions to users based on their roles and responsibilities.',
            },
            {
              function: 'Audit Logging',
              description:
                'Tracked user activity and system access for security and compliance purposes.',
            },
          ],
        },
        {
          title: 'Intellimed Portal',
          summary:
            'A healthcare application providing secure access to patient records, appointment scheduling, and e-prescribing.',
          tags: ['Angular', 'Healthcare IT'],
          link: '',
          coreFunctions: [
            {
              function: 'Patient Records',
              description: 'Provided secure access to patient medical records and history.',
            },
            {
              function: 'Appointment Scheduling',
              description: 'Allowed patients and staff to schedule and manage appointments.',
            },
            {
              function: 'E-Prescribing',
              description: 'Enabled doctors to electronically send prescriptions to pharmacies.',
            },
          ],
        },
      ],
    },
  ]);
}

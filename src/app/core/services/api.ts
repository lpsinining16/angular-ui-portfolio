import { Injectable, signal } from '@angular/core';

export interface Profile {
  name: string;
  headline: string;
  summary: string;
  about: string;
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

export interface CoreFunction {
  function: string;
  description: string;
}

export interface System {
  title: string;
  description?: string;
  tags: string[];
  link: string;
  coreFunctions?: CoreFunction[];
}

export interface Project {
  title: string;
  type: 'professional' | 'personal';
  company: string;
  description: string;
  technologies: string[];
  systems: System[];
}

@Injectable({
  providedIn: 'root',
})
export class apiService {
  profile = signal<Profile>({
    name: 'Larry Sinining',
    headline: 'Software Engineer | Front-End Engineer',
    summary: `Detail-oriented Software Engineer with over 9 years of experience in web and desktop application development. Skilled in Angular, REST APIs, JavaScript and TypeScript. I enjoy building clean, user-friendly Interfaces and working collaboratively in Agile teams. Always eager to learn new technologies and contribute to efficient, high-quality software.`,
    about: `I am a passionate and dedicated software engineer with a strong background in front-end
      development, particularly with Angular. With over 9 years in the industry, I've had the opportunity to
      work on a diverse range of projects, from modernizing legacy desktop applications to building
      enterprise-grade web systems for global clients.
      
      My journey in tech began with a curiosity for how things work, which led me to a degree in
      Computer Engineering. I thrive in collaborative environments, leveraging Agile methodologies to
      deliver efficient, scalable, and user-friendly solutions. I'm always eager to learn and adapt to new
      technologies to continuously improve my craft and contribute effectively to my team.
      
      When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and
      spending time with my family.`,
    email: 'larry.sinining@gmail.com',
    phone: '+639936081692',
    location: 'General Trias, Cavite, PH',
    linkedin: 'https://linkedin.com/in/lpsinining',
    github: 'https://github.com/lpsinining16',
    cvUrl: 'documents/larry-sinining-cv.pdf',
    profilePhoto: 'images/lps_profile.png',
  });

  workExperience = signal([
    {
      title: 'Custom Software Engineering Specialist',
      company: 'Accenture Inc.',
      duration: 'Dec 2022 - Present',
      points: [
        'Developed and maintained web applications for casino systems using Angular and PrimeNG.',
        'Collaborated with cross-functional teams to deliver new features.',
        'Handled front-end tasks, version upgrades, and UX enhancements.',
        'Supported debugging and issue resolution for production environments.',
      ],
    },
    {
      title: 'Advanced App Engineering Senior Analyst',
      company: 'Accenture Inc.',
      duration: 'Apr 2021 - Nov 2022',
      points: [
        'Built and maintained front-end modules using Angular and PrimeNG.',
        'Participated in the migration of Angular, PrimeNG, and Bootstrap versions.',
        'Conducted peer code reviews and contributed to knowledge-sharing sessions.',
        'Worked on UI automation testing using Selenium integrated with Spring Boot.',
      ],
    },
    {
      title: 'Team Lead, Software Engineering',
      company: 'Intellicare - Asalus Corporation',
      duration: 'Nov 2016 - Apr 2021',
      points: [
        'Led a team in building internal applications using Angular and ASP.NET MVC (C#).',
        'Oversaw design of Angular Material-based front-end modules.',
        'Guided and mentored junior developers.',
        'Collaborated with business stakeholders to gather requirements.',
      ],
    },
    {
      title: 'Technical and Customer Support',
      company: 'Sky Cable Corporation',
      duration: 'Aug 2014 - Dec 2015',
      points: [
        'Provided technical support for Sky Broadband customers.',
        'Assisted in customer troubleshooting, achieving a high first-call resolution rate.',
        'Coordinated with technical teams for issue resolution.',
      ],
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

  projects = signal<Project[]>([
    {
      title: 'Casino Patron and Gaming Systems',
      type: 'professional',
      company: 'Accenture Inc.',
      description:
        'A suite of enterprise-grade applications for a global casino systems client, focusing on patron management, loyalty, and financial transactions.',
      technologies: ['Angular', 'PrimeNG', 'Bootstrap', 'TypeScript', 'Spring Boot', 'Selenium'],
      systems: [
        {
          title: 'Casino Management System (CMS)',
          tags: ['Patron Management', 'Gaming Operations', 'Loyalty', 'Promotions', 'Compliance'],
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
          tags: ['Table Management', 'Player Ratings', 'Staff Tracking'],
          link: '#',
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
          title: 'G2TT - Gaming Table Transaction Tracker',
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
      description:
        'Developed a series of internal web applications to streamline business operations, from clinic management to user access control.',
      technologies: ['Angular', 'Angular Material', 'ASP.NET C#', 'RESTful APIs', 'MS SQL Server'],
      systems: [
        {
          title: 'Clinic Management Portal',
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
    }, // 👇 Personal Projects

    {
      title: 'Personal Portfolio Website',
      type: 'personal',
      company: '',
      description:
        'My modern portfolio built with Angular, Tailwind CSS, and smooth animations. Designed to showcase skills, projects, and career journey.',
      technologies: ['Angular', 'Tailwind CSS', 'TypeScript', 'SCSS'],
      systems: [
        {
          title: 'Portfolio v1',
          description: 'First iteration, simple static site with pure HTML/CSS.',
          tags: ['HTML', 'CSS'],
          link: '',
        },
        {
          title: 'Portfolio v2',
          description:
            'Upgraded with Angular and Tailwind CSS, including animations and a projects showcase.',
          tags: ['Angular', 'Tailwind'],
          link: '',
        },
      ],
    },
    {
      title: 'Open Source Contributions',
      type: 'personal',
      company: '',
      description:
        'Small contributions to open-source projects, improving documentation, fixing bugs, and enhancing UI.',
      technologies: ['JavaScript', 'TypeScript', 'GitHub'],
      systems: [
        {
          title: 'Angular Libraries',
          description: 'Contributed bug fixes and documentation improvements.',
          tags: ['Angular', 'Open Source'],
          link: '',
        },
        {
          title: 'Tailwind Plugins',
          description: 'Tested and reported bugs for Tailwind plugins.',
          tags: ['Tailwind', 'Plugins'],
          link: '',
        },
      ],
    },
    {
      title: 'Fun Side Projects',
      type: 'personal',
      company: '',
      description: 'Creative experimental apps built during weekends and hackathons.',
      technologies: ['Node.js', 'Express', 'MongoDB', 'Angular'],
      systems: [
        {
          title: 'Recipe Finder',
          description: 'A web app to search for recipes by ingredients.',
          tags: ['Angular', 'API'],
          link: '',
        },
        {
          title: 'TaskMate',
          description: 'A productivity app with gamification features.',
          tags: ['Node.js', 'Express', 'MongoDB'],
          link: '',
        },
      ],
    },
  ]);
}

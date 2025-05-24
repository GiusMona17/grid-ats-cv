import type { CVData, CVSectionItem, SectionType } from '../types';

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Default profile image
const DEFAULT_PROFILE_IMAGE = 'https://placehold.co/200x200';

// Create default content for a section type
export const createDefaultContent = (type: SectionType): SectionData => {
  switch (type) {
    case 'profile':
      return {
        name: 'Your Name',
        tagline: 'Your Title, Location',
        email: 'email@example.com',
        website: 'https://yourwebsite.com',
        websiteLabel: 'yourwebsite.com',
        profileImage: DEFAULT_PROFILE_IMAGE,
        apps: [
          { name: 'App 1', color: '#3b82f6' },
          { name: 'App 2', color: '#8b5cf6' },
          { name: 'App 3', color: '#6366f1' }
        ],
        interests: ['Coding', 'Design', 'Music', 'Travel']
      };

    case 'experience':
      return {
        years: '0+ years',
        jobs: [
          {
            company: 'Company A',
            title: 'Your Title',
            period: '2023 - now',
            current: true,
            logoBackground: '#ef4444',
            responsibilities: [
              'Responsibility 1: Description goes here',
              'Responsibility 2: Description goes here',
              'Responsibility 3: Description goes here'
            ]
          },
          {
            company: 'Company B',
            title: 'Your Previous Title',
            period: '2020 - 2023',
            logoBackground: '#f97316',
            responsibilities: [
              'Responsibility 1: Description goes here',
              'Responsibility 2: Description goes here',
              'Responsibility 3: Description goes here'
            ]
          }
        ]
      };

    case 'skills':
      return {
        categories: [
          {
            name: 'Category 1',
            skills: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4']
          },
          {
            name: 'Category 2',
            skills: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4']
          }
        ]
      };

    case 'education':
      return {
        schools: [
          {
            degree: 'Degree Title',
            type: 'University degree',
            institution: 'University Name',
            period: '2018 - 2022'
          },
          {
            degree: 'Previous Degree',
            type: 'High-School Diploma',
            institution: 'School Name',
            period: '2014 - 2018'
          }
        ]
      };

    case 'interests':
      return {
        interests: ['Interest 1', 'Interest 2', 'Interest 3', 'Interest 4']
      };

    case 'apps':
      return {
        apps: [
          { name: 'App 1', color: '#3b82f6', icon: '📱' },
          { name: 'App 2', color: '#8b5cf6', icon: '🖥️' },
          { name: 'App 3', color: '#6366f1', icon: '🎮' }
        ]
      };

    case 'custom':
      return {
        content: 'Edit this custom section with your own content.'
      };

    default:
      return {};
  }
};

// Create a new section
export const createSection = (type: SectionType, title: string, order: number): CVSectionItem => {
  return {
    id: generateId(),
    type,
    title,
    content: createDefaultContent(type),
    order,
  };
};

// Default CV data
export const getDefaultCVData = (): CVData => {
  return {
    title: 'Standard version',
    subtitle: 'cv-standard',
    sections: [
      {
        id: generateId(),
        type: 'profile',
        title: 'Profile',
        content: {
          name: 'Mathis Garcia',
          tagline: '29 years old, French',
          email: 'hello@mathisgarcia.com',
          website: 'https://mathisgarcia.com',
          websiteLabel: 'mathisgarcia.com',
          profileImage: DEFAULT_PROFILE_IMAGE,
          apps: [
            { name: 'App 1', color: '#3b82f6' },
            { name: 'App 2', color: '#8b5cf6' },
            { name: 'App 3', color: '#6366f1' }
          ],
          interests: ['Coding', 'Running', 'Film-making', 'Art']
        },
        order: 0
      },
      {
        id: generateId(),
        type: 'experience',
        title: 'Experience',
        content: {
          years: '10+ years',
          jobs: [
            {
              company: 'Adobe',
              title: 'UX/UI Designer',
              period: '2022 - now',
              current: true,
              logoBackground: '#ef4444',
              responsibilities: [
                'Growth: Acquisition funnel optimization',
                'Design System: created component library',
                'Web design: Redesign and optimization of adobe.com pages',
                'Tools: Figma, Jira, Teams, UserTesting, ContentSquare'
              ]
            },
            {
              company: 'Actio',
              title: 'Full-stack Designer',
              period: '2020 - 2022',
              logoBackground: '#f97316',
              responsibilities: [
                'Re-branding: New logo of the company, Graphic Design',
                'Product design: UI prototyping, Motion design, Design system',
                'New website of the company: actio.com',
                'Tools: Figma, Adobe CC Suite, Slack, Asana'
              ]
            }
          ]
        },
        order: 1
      },
      {
        id: generateId(),
        type: 'experience',
        title: 'Previous Experience',
        content: {
          years: '',
          jobs: [
            {
              company: 'Tisma',
              title: 'Freelance Designer',
              period: '2018 - 2020',
              logoBackground: '#ef4444',
              responsibilities: [
                'Multi-tasking: UX Design, Product Design, Graphic Design',
                'B2B Products: Websites, Mobile apps',
                'Tools: Figma, Adobe Illustrator, Wordpress',
                'Motion design: Logo animations and Advertising'
              ]
            },
            {
              company: 'Qucit',
              title: 'Graphic Designer',
              period: '2017 - 2018',
              logoBackground: '#6366f1',
              responsibilities: [
                'New website of the company: qucit.com',
                'New Logo design and Re-branding',
                'UX/UI for a B2B Dashboard with data analysis',
                'Creation of visuals for Social Media communication'
              ]
            }
          ]
        },
        order: 2
      },
      {
        id: generateId(),
        type: 'skills',
        title: 'Skills',
        content: {
          categories: [
            {
              name: 'Design tools',
              skills: ['Figma', 'Illustrator', 'Photoshop', 'Sketch']
            },
            {
              name: 'Video editing',
              skills: ['Premiere Pro', 'After Effects']
            },
            {
              name: 'Languages',
              skills: ['French', 'English', 'Spanish', 'German']
            },
            {
              name: 'Coding',
              skills: ['HTML', 'CSS', 'JavaScript', 'React', 'WordPress']
            }
          ]
        },
        order: 3
      },
      {
        id: generateId(),
        type: 'education',
        title: 'Education',
        content: {
          schools: [
            {
              degree: 'Web & Design',
              type: 'University degree',
              institution: 'amU',
              period: '2015 - 2017'
            },
            {
              degree: 'Computer Science',
              type: 'High-School Diploma (Bac S)',
              institution: '',
              period: '2013 - 2015'
            }
          ]
        },
        order: 4
      }
    ],
    theme: 'light'
  };
};

// Save CV data to local storage
export const saveCV = (data: CVData): void => {
  localStorage.setItem('cv-data', JSON.stringify(data));
};

// Load CV data from local storage
export const loadCV = (): CVData | null => {
  const data = localStorage.getItem('cv-data');
  return data ? JSON.parse(data) : null;
};

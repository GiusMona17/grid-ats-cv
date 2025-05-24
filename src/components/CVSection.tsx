import { useState } from 'react';
import ResizableBox from './ResizableBox';
import { SectionData, SectionType, ProfileData, ExperienceData, SkillsData, EducationData } from '../types';

interface CVSectionProps {
  id: string;
  type: SectionType;
  title: string;
  content: SectionData;
  width?: number;
  height?: number;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, data: SectionData) => void;
  onResize?: (id: string, width: number, height: number) => void;
  className?: string;
  isEditMode?: boolean;
}

const CVSection: React.FC<CVSectionProps> = ({
  id,
  type,
  title,
  content,
  width,
  height,
  onDelete,
  onEdit,
  onResize,
  className = '',
  isEditMode = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEditToggle = () => {
    if (isEditing && onEdit) {
      onEdit(id, editedContent);
    }
    setIsEditing(!isEditing);
  };

  const renderContent = () => {
    if (isEditing) {
      return renderEditForm();
    }

    switch (type) {
      case 'profile': {
        const profileContent = content as ProfileData;
        return (
          <div className="profile-section">
            <h2 className="text-3xl font-bold mb-1">{profileContent.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
              <span className="text-zinc-600">{profileContent.tagline}</span>
              <span className="text-zinc-600">{profileContent.email}</span>
              <a href={profileContent.website} className="text-blue-500">{profileContent.websiteLabel}</a>
            </div>
            <div className="profile-grid">
              <div className="card">
                <img
                  src={profileContent.profileImage}
                  alt="Profile"
                  className="rounded-lg w-full h-auto max-w-[200px] mx-auto"
                />
              </div>
              <div className="card">
                <h3 className="font-medium mb-2">Apps I made</h3>
                <div className="flex flex-wrap gap-2">
                  {profileContent.apps?.map((app: { name: string, color: string }, index: number) => (
                    <div
                      key={`app-${app.name}-${index}`}
                      className="tag text-white text-xs"
                      style={{ backgroundColor: app.color }}
                    >
                      {app.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="font-medium mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profileContent.interests?.map((interest: string, index: number) => (
                    <div key={`interest-${interest}-${index}`} className="tag bg-neutral-200 text-xs">
                      {interest}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      case 'experience': {
        const experienceContent = content as ExperienceData;
        return (
          <div className="experience-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{title}</h2>
              <span className="text-zinc-500">{experienceContent.years}</span>
            </div>
            <div className="experience-grid">
              {experienceContent.jobs?.map((job: {
                company: string,
                title: string,
                period: string,
                current?: boolean,
                logo?: string,
                logoBackground: string,
                responsibilities: string[]
              }, index: number) => (
                <div key={`job-${job.company}-${index}`} className="card">
                  <div className="card-header">
                    <div className="card-content">
                      <div className="company-logo" style={{ backgroundColor: job.logoBackground }}>
                        {job.logo ? (
                          <img src={job.logo} alt={job.company} className="w-8 h-8" />
                        ) : (
                          <span className="text-white font-bold text-lg">{job.company.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{job.company}</h3>
                        <p className="text-zinc-600 font-medium">{job.title}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span
                        className={job.current ? 
                          "text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-xs font-medium" : 
                          "text-zinc-500 text-sm"
                        }
                      >
                        {job.period}
                      </span>
                    </div>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-zinc-600 space-y-2 mt-3">
                    {job.responsibilities?.map((responsibility: string, idx: number) => (
                      <li key={`resp-${idx}-${responsibility.slice(0, 10)}`} className="leading-relaxed">
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'skills': {
        const skillsContent = content as SkillsData;
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="skills-grid">
              {skillsContent.categories?.map((category: { name: string, skills: string[] }, index: number) => (
                <div key={`category-${category.name}-${index}`} className="card">
                  <h3 className="font-medium mb-3 text-lg">{category.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills?.map((skill: string, idx: number) => (
                      <div key={`skill-${skill}-${idx}`} className="tag bg-blue-100 text-blue-800 text-sm font-medium">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'education': {
        const educationContent = content as EducationData;
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="education-grid">
              {educationContent.schools?.map((school: {
                degree: string,
                type: string,
                institution?: string,
                period: string
              }, index: number) => (
                <div key={`school-${school.degree}-${index}`} className="card">
                  <div className="card-header">
                    <div>
                      <h3 className="font-bold text-lg">{school.degree}</h3>
                      <p className="text-zinc-600 font-medium">{school.type}</p>
                      {school.institution && (
                        <p className="text-zinc-500 text-sm">{school.institution}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500 text-sm font-medium">{school.period}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return <div>Unknown section type</div>;
    }
  };

  const renderEditForm = () => {
    // In a real application, you would create different forms based on the section type
    // For this example, we'll just show a simple textarea
    return (
      <div className="p-4">
        <textarea
          className="w-full h-[200px] p-2 border rounded"
          value={JSON.stringify(editedContent, null, 2)}
          onChange={(e) => {
            try {
              setEditedContent(JSON.parse(e.target.value));
            } catch (error) {
              // Handle invalid JSON
            }
          }}
        />
        <div className="mt-2">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
            onClick={handleEditToggle}
          >
            Save
          </button>
          <button
            className="border border-gray-300 px-3 py-1 rounded"
            onClick={() => {
              setEditedContent(content);
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <ResizableBox
      id={id}
      initialWidth={width}
      initialHeight={height}
      onDelete={onDelete}
      onResize={onResize}
      className={`mb-8 ${className}`}
      isEditMode={isEditMode}
    >
      <div className="relative">
        {renderContent()}
        {isEditMode && (
          <button
            className="absolute top-0 right-0 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm"
            onClick={handleEditToggle}
          >
            {isEditing ? '✓' : '✎'}
          </button>
        )}
      </div>
    </ResizableBox>
  );
};

export default CVSection;
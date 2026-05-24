import { MapPin, Clock, ArrowRight, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScoreCircle from './ScoreCircle';

// Helper: format how long ago the job was posted
const timeAgo = (dateString) => {
  const now = new Date();
  const posted = new Date(dateString);
  const diffMs = now - posted;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // convert ms to days

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
};

// Helper: first two letters of company name for the avatar
const companyInitials = (name = '') => {
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const JobCard = ({ job, showScore = true }) => {
  const navigate = useNavigate();

  const {
    _id,
    title,
    companyName,
    sector,
    jobType,
    location,
    createdAt,
    compatibilityScore,
    requiredSkills = [],
  } = job;

  const score = compatibilityScore ?? null;

  return (
    <div
      className='group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5
        hover:border-primary/40 hover:shadow-card transition-all duration-200 cursor-pointer'
      onClick={() => navigate(`/graduate/jobs/${_id}`)}
    >
      {/* Top row — company avatar + score */}
      <div className='flex items-start justify-between gap-3'>
        {/* Company avatar */}
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary'>
          {companyInitials(companyName)}
        </div>

        {/* Score circle — only shown for graduates */}
        {showScore && score !== null && <ScoreCircle score={score} size={52} />}
      </div>

      {/* Job info */}
      <div className='flex-1'>
        <h3 className='font-semibold text-text-heading group-hover:text-primary transition-colors line-clamp-1'>
          {title}
        </h3>
        <p className='text-sm text-text-muted mt-0.5'>{companyName}</p>
      </div>

      {/* Badges row */}
      <div className='flex flex-wrap gap-2'>
        <span className='rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-text'>
          {jobType}
        </span>
        <span className='rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-text'>
          {sector}
        </span>
      </div>

      {/* Footer — location + date */}
      <div className='flex items-center justify-between border-t border-border pt-3'>
        <div className='flex items-center gap-3 text-xs text-text-muted'>
          {location && (
            <span className='flex items-center gap-1'>
              <MapPin size={11} />
              {location}
            </span>
          )}
          <span className='flex items-center gap-1'>
            <Clock size={11} />
            {timeAgo(createdAt)}
          </span>
        </div>

        <span className='flex items-center gap-1 text-xs font-medium text-primary'>
          View
          <ArrowRight
            size={12}
            className='group-hover:translate-x-0.5 transition-transform'
          />
        </span>
      </div>
    </div>
  );
};

export default JobCard;

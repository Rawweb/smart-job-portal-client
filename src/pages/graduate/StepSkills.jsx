import { useState, useMemo } from 'react';
import { Search, X, ArrowRight, ArrowLeft, Plus } from 'lucide-react';
import { skillCategories } from '../../data/skills';

const StepSkills = ({ extractedSkills, onNext, onBack }) => {
  const [selectedSkills, setSelectedSkills] = useState(extractedSkills);
  const [search, setSearch] = useState('');

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Filter categories and skills based on search
  const filtered = useMemo(() => {
    if (!search.trim()) return skillCategories;

    const q = search.toLowerCase();
    return skillCategories
      .map((cat) => ({
        ...cat,
        skills: cat.skills.filter((s) => s.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.skills.length > 0);
  }, [search]);

  const handleContinue = () => {
    if (selectedSkills.length === 0) return;
    onNext(selectedSkills);
  };

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-xl font-bold text-text-heading'>
          Select your skills
        </h2>
        <p className='text-sm text-text-muted mt-1'>
          {extractedSkills.length > 0
            ? `We detected ${extractedSkills.length} skills from your resume. Review and add more.`
            : 'Choose all the skills you currently have.'}
        </p>
      </div>

      {/* Selected skills */}
      {selectedSkills.length > 0 && (
        <div className='rounded-2xl border border-border bg-surface p-4'>
          <p className='text-xs font-semibold text-text-muted uppercase tracking-wide mb-3'>
            Your skills ({selectedSkills.length})
          </p>
          <div className='flex flex-wrap gap-2'>
            {selectedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className='flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors'
              >
                {skill}
                <X size={11} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className='relative'>
        <Search
          size={16}
          className='absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted'
        />
        <input
          type='text'
          placeholder='Search skills...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text'
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Skill categories */}
      <div className='skill-scrollbar flex max-h-72 flex-col gap-5 overflow-y-auto rounded-xl pr-2'>
        {filtered.length === 0 ? (
          <p className='text-sm text-text-muted text-center py-6'>
            No skills found for "{search}"
          </p>
        ) : (
          filtered.map(({ category, skills }) => (
            <div key={category}>
              <p className='text-xs font-semibold text-text-muted uppercase tracking-wide mb-2'>
                {category}
              </p>
              <div className='flex flex-wrap gap-2'>
                {skills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150
                        ${
                          isSelected
                            ? 'border-primary bg-primary text-white'
                            : 'border-border bg-surface text-text hover:border-primary/50 hover:text-text-heading'
                        }`}
                    >
                      {!isSelected && <Plus size={11} />}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className='flex items-center justify-between pt-2 border-t border-border'>
        <button
          onClick={onBack}
          className='flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-heading transition-colors'
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <button
          onClick={handleContinue}
          disabled={selectedSkills.length === 0}
          className='flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors'
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>

      {selectedSkills.length === 0 && (
        <p className='text-xs text-danger text-center -mt-2'>
          Select at least one skill to continue
        </p>
      )}
    </div>
  );
};

export default StepSkills;

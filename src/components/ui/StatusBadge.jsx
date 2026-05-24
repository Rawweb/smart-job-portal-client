// A small reusable component that shows an application status
// with the right colour for each state

const config = {
  Pending: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    dot: 'bg-warning',
  },
  Reviewed: {
    bg: 'bg-secondary/10',
    text: 'text-secondary',
    dot: 'bg-secondary',
  },
  Shortlisted: {
    bg: 'bg-success/10',
    text: 'text-success',
    dot: 'bg-success',
  },
  Rejected: {
    bg: 'bg-danger/10',
    text: 'text-danger',
    dot: 'bg-danger',
  },
};

const StatusBadge = ({ status }) => {
  const style = config[status] || config.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium
        ${style.bg} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;

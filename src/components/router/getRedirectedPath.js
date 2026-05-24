const getRedirectPath = (user) => {
  // No role yet — must select one
  if (!user.role) return '/select-role';

  // Has role but has not finished onboarding
  if (!user.isOnboarded) {
    return user.role === 'graduate'
      ? '/graduate/onboarding'
      : user.role === 'employer'
        ? '/employer/onboarding'
        : '/admin/dashboard';
    // Admin users are created manually in MongoDB
    // They are always considered onboarded
  }

  // Fully set up — send to their dashboard
  if (user.role === 'graduate') return '/graduate/dashboard';
  if (user.role === 'employer') return '/employer/dashboard';
  if (user.role === 'admin') return '/admin/dashboard';

  // Fallback — should never reach here
  return '/login';
};

export default getRedirectPath;

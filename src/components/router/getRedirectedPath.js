const getRedirectPath = (user) => {
  if (!user.role) return '/select-role';

  if (!user.isOnboarded) {
    return user.role === 'graduate'
      ? '/graduate/onboarding'
      : '/employer/onboarding';
  }

  return user.role === 'graduate'
    ? '/graduate/dashboard'
    : '/employer/dashboard';
};

export default getRedirectPath;

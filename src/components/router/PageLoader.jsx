const PageLoader = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-4 bg-bg'>
      <div className='w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin' />
      <p className='text-sm text-text-muted'>Loading...</p>
    </div>
  );
};

export default PageLoader;

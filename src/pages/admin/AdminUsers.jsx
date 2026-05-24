import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Loader2, Users } from 'lucide-react';
import api from '../../api/axios';

const fetchUsers = (params) =>
  api.get('/admin/users', { params }).then((res) => res.data);

const roles = ['all', 'graduate', 'employer', 'admin'];

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, role, page],
    queryFn: () => fetchUsers({ search, role, page, limit: 20 }),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const users = data?.users || [];
  const pagination = data?.pagination || {};

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold text-text-heading'>Users</h1>
        <p className='text-sm text-text-muted mt-1'>
          All registered users on the platform
        </p>
      </div>

      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1'>
          <Search
            size={15}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-text-muted'
          />
          <input
            type='text'
            placeholder='Search by email...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset to first page on new search
            }}
            className='w-full rounded-xl border border-border bg-surface pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary transition-all'
          />
          {search && (
            <button
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text'
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Role tabs */}
        <div className='flex items-center gap-1 rounded-xl border border-border bg-surface p-1'>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all
                ${
                  role === r
                    ? 'bg-primary text-white'
                    : 'text-text-muted hover:text-text-heading'
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      {isLoading ? (
        <div className='flex items-center justify-center py-16'>
          <Loader2 size={28} className='animate-spin text-primary' />
        </div>
      ) : users.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-16 text-center'>
          <Users size={40} className='text-text-muted mb-4' />
          <p className='font-semibold text-text-heading'>No users found</p>
        </div>
      ) : (
        <>
          <div className='rounded-2xl border border-border bg-surface overflow-hidden'>
            {/* Table header */}
            <div className='grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-bg text-xs font-semibold uppercase tracking-wide text-text-muted'>
              <div className='col-span-5'>Email</div>
              <div className='col-span-2'>Role</div>
              <div className='col-span-2'>Status</div>
              <div className='col-span-3'>Joined</div>
            </div>

            {/* Table rows */}
            {users.map((user, index) => (
              <div
                key={user._id}
                className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center text-sm
                  ${index !== users.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className='col-span-5 flex items-center gap-3'>
                  <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary'>
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className='text-text-heading truncate'>
                    {user.email}
                  </span>
                </div>

                <div className='col-span-2'>
                  <span className='capitalize text-text'>
                    {user.role || '—'}
                  </span>
                </div>

                <div className='col-span-2'>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${
                        user.isOnboarded
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}
                  >
                    {user.isOnboarded ? 'Active' : 'Pending'}
                  </span>
                </div>

                <div className='col-span-3 text-text-muted text-xs'>
                  {new Date(user.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className='flex items-center justify-between'>
              <p className='text-sm text-text-muted'>
                Showing {users.length} of {pagination.total} users
              </p>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className='rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-heading hover:bg-border disabled:opacity-40 transition-colors'
                >
                  Previous
                </button>
                <span className='text-sm text-text-muted'>
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={page === pagination.pages}
                  className='rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-heading hover:bg-border disabled:opacity-40 transition-colors'
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUsers;

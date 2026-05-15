import { useEffect, useState } from 'react';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import {
  assignBooking,
  getAllBookingsForStaff,
  getBookingStaffOptions,
  updateBookingStatus,
} from '../services/bookingService.js';

const bookingStatuses = ['new', 'contacted', 'booked', 'closed'];
const PAGE_SIZE = 12;

function formatDate(value) {
  if (!value) return 'Recent';
  return new Date(value).toLocaleDateString();
}

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadBookings = async (nextPage = 1, { append = false, includeStaff = true } = {}) => {
    append ? setIsLoadingMore(true) : setIsLoading(true);
    setError('');

    try {
      const [bookingResult, nextStaffOptions] = await Promise.all([
        getAllBookingsForStaff({ page: nextPage, pageSize: PAGE_SIZE }),
        includeStaff ? getBookingStaffOptions() : Promise.resolve(staffOptions),
      ]);
      setBookings((current) => (append ? [...current, ...bookingResult.items] : bookingResult.items));
      setStaffOptions(nextStaffOptions);
      setPage(bookingResult.page);
      setHasMore(bookingResult.hasMore);
    } catch (loadError) {
      setError(loadError.message || 'Could not load booking requests.');
    } finally {
      append ? setIsLoadingMore(false) : setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadInitialBookings() {
      try {
        const [bookingResult, nextStaffOptions] = await Promise.all([
          getAllBookingsForStaff({ page: 1, pageSize: PAGE_SIZE }),
          getBookingStaffOptions(),
        ]);

        if (!isMounted) return;

        setBookings(bookingResult.items);
        setStaffOptions(nextStaffOptions);
        setPage(bookingResult.page);
        setHasMore(bookingResult.hasMore);
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Could not load booking requests.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    setActiveBookingId(bookingId);
    setMessage('');
    setError('');

    try {
      await updateBookingStatus(bookingId, status);
      await loadBookings(1);
      setMessage('Booking status updated.');
    } catch (statusError) {
      setError(statusError.message || 'Could not update booking status.');
    } finally {
      setActiveBookingId('');
    }
  };

  const handleAssign = async (bookingId, userId) => {
    setActiveBookingId(bookingId);
    setMessage('');
    setError('');

    try {
      await assignBooking(bookingId, userId);
      await loadBookings(1);
      setMessage('Booking assignment updated.');
    } catch (assignError) {
      setError(assignError.message || 'Could not assign booking.');
    } finally {
      setActiveBookingId('');
    }
  };

  return (
    <AppLayout
      eyebrow="Booking Desk"
      title="Booking requests"
      description="Manage student consultation requests, status, and ownership."
    >
      <div className="submissions-page-shell">
        {isLoading ? <p className="auth-message">Loading booking requests...</p> : null}
        {error ? <p className="auth-message is-error">{error}</p> : null}
        {message ? <p className="auth-message is-success">{message}</p> : null}

        {!isLoading && !error && bookings.length === 0 ? (
          <AppCard eyebrow="Empty" title="No booking requests yet">
            <p>New public booking form submissions will appear here.</p>
          </AppCard>
        ) : null}

        <div className="submission-review-list">
          {bookings.map((booking) => (
            <article key={booking.id} className="app-card reveal booking-admin-card">
              <header className="app-card-header">
                <p className="app-card-eyebrow">{booking.courseSlug || 'General consultation'}</p>
                <h2>{booking.fullName}</h2>
              </header>

              <div className="submission-meta-row">
                <span>{booking.status}</span>
                <span>{booking.preferredMode || 'Any mode'}</span>
                <span>{formatDate(booking.createdAt)}</span>
                <span>{booking.assigneeName || 'Unassigned'}</span>
              </div>

              <div className="booking-admin-details">
                <p>
                  <strong>Email</strong>
                  <span>{booking.email}</span>
                </p>
                <p>
                  <strong>Phone</strong>
                  <span>{booking.phone || '-'}</span>
                </p>
                {booking.message ? (
                  <p>
                    <strong>Message</strong>
                    <span>{booking.message}</span>
                  </p>
                ) : null}
              </div>

              <form className="admin-task-form booking-admin-form">
                <label>
                  Status
                  <select
                    value={booking.status}
                    onChange={(event) => handleStatusChange(booking.id, event.target.value)}
                    disabled={activeBookingId === booking.id}
                  >
                    {bookingStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Assign to
                  <select
                    value={booking.assignedTo}
                    onChange={(event) => handleAssign(booking.id, event.target.value)}
                    disabled={activeBookingId === booking.id}
                  >
                    <option value="">Unassigned</option>
                    {staffOptions.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </label>
              </form>
            </article>
          ))}
        </div>
        {hasMore ? (
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => loadBookings(page + 1, { append: true, includeStaff: false })}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading...' : 'Load more bookings'}
          </button>
        ) : null}
      </div>
    </AppLayout>
  );
}

export default AdminBookings;

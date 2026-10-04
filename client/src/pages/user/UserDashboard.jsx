import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RatingStars from '../../components/RatingStars';
import { fetchStoresForUser, submitStoreRating } from '../../services/userService';
import toast from 'react-hot-toast';
import {
  FiShoppingBag,
  FiSearch,
  FiMapPin,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
} from 'react-icons/fi';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('name_asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Local draft rating inputs for each store { [storeId]: ratingNumber }
  const [draftRatings, setDraftRatings] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  const getSortParams = (option) => {
    switch (option) {
      case 'name_desc':
        return { sortBy: 'name', sortOrder: 'desc' };
      case 'rating_desc':
        return { sortBy: 'average_rating', sortOrder: 'desc' };
      case 'rating_asc':
        return { sortBy: 'average_rating', sortOrder: 'asc' };
      default:
        return { sortBy: 'name', sortOrder: 'asc' };
    }
  };

  const loadStores = useCallback(async () => {
    setLoading(true);
    const { sortBy, sortOrder } = getSortParams(sortOption);

    try {
      const res = await fetchStoresForUser({
        search: search.trim() || undefined,
        sortBy,
        sortOrder,
        page,
        limit: 9,
      });

      const { stores: fetchedStores, totalPages: pages, total } = res.data.data;
      setStores(fetchedStores || []);
      setTotalPages(pages || 1);
      setTotalCount(total || 0);

      // Pre-fill draft ratings with current user rating if present
      const initialDrafts = {};
      fetchedStores.forEach((st) => {
        if (st.user_rating) {
          initialDrafts[st.id] = st.user_rating;
        }
      });
      setDraftRatings((prev) => ({ ...initialDrafts, ...prev }));
    } catch (err) {
      toast.error('Failed to load stores: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [search, sortOption, page]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const handleRatingChange = (storeId, newRating) => {
    setDraftRatings((prev) => ({ ...prev, [storeId]: newRating }));
  };

  const handleRatingSubmit = async (storeId) => {
    const selectedRating = draftRatings[storeId];
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      toast.error('Please select a star rating between 1 and 5');
      return;
    }

    setSubmittingId(storeId);
    try {
      await submitStoreRating(storeId, selectedRating);
      toast.success('Your rating has been saved!');
      loadStores();
    } catch (err) {
      toast.error('Failed to submit rating: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="rs-page-wrapper">
      <Navbar />

      <main className="rs-dashboard-main">
        <div className="rs-page-header">
          <div className="rs-page-title-wrap">
            <span className="rs-section-badge">
              <FiShoppingBag /> Consumer Portal
            </span>
            <h1 className="rs-page-heading">Explore & Rate Stores</h1>
            <p className="rs-page-subheading">
              Discover verified retail businesses and share your genuine experiences
            </p>
          </div>
        </div>

        {/* Search & Sort Filter Toolbar */}
        <div className="rs-toolbar-card">
          <div className="rs-search-input-wrap">
            <FiSearch className="rs-search-icon" />
            <input
              type="text"
              className="rs-search-input"
              placeholder="Search by store name or address..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="rs-filter-wrap">
            <label className="rs-filter-label">Sort By:</label>
            <select
              className="rs-select"
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setPage(1);
              }}
            >
              <option value="name_asc">Name (A → Z)</option>
              <option value="name_desc">Name (Z → A)</option>
              <option value="rating_desc">Highest Rating</option>
              <option value="rating_asc">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Store Cards Grid */}
        {loading ? (
          <div className="rs-loading-state">
            <p>Loading stores near you...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="rs-empty-state">
            <h3>No stores found</h3>
            <p>Try refining your search keyword or check back later.</p>
          </div>
        ) : (
          <div className="rs-stores-grid">
            {stores.map((store) => {
              const currentRating = draftRatings[store.id] || store.user_rating || 0;
              const hasSubmitted = Boolean(store.user_rating);
              const isSubmitting = submittingId === store.id;

              return (
                <div key={store.id} className="rs-store-card">
                  <div className="rs-store-card-header">
                    <div className="rs-store-card-title-wrap">
                      <h3 className="rs-store-name">{store.name}</h3>
                      <p className="rs-store-address">
                        <FiMapPin className="rs-icon-sm" /> {store.address}
                      </p>
                    </div>
                  </div>

                  <div className="rs-store-stats-row">
                    <div className="rs-store-avg-stat">
                      <span className="rs-stat-label">Community Rating</span>
                      <div className="rs-rating-chip">
                        <FiStar className="rs-star-icon" />
                        <span className="rs-avg-num">
                          {parseFloat(store.average_rating || 0).toFixed(1)}
                        </span>
                        <span className="rs-stat-total">
                          ({store.total_ratings || 0} {store.total_ratings === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    </div>

                    <div className="rs-store-user-stat">
                      <span className="rs-stat-label">Your Submitted Rating</span>
                      {hasSubmitted ? (
                        <span className="rs-user-rated-badge">
                          <FiCheckCircle /> Rated ★ {store.user_rating}
                        </span>
                      ) : (
                        <span className="rs-user-unrated-badge">Not rated yet</span>
                      )}
                    </div>
                  </div>

                  {/* Interactive Rating Area */}
                  <div className="rs-rating-interactive-box">
                    <span className="rs-rating-box-title">
                      {hasSubmitted ? 'Modify Your Rating:' : 'Rate This Store:'}
                    </span>

                    <div className="rs-stars-action-row">
                      <RatingStars
                        value={currentRating}
                        size={22}
                        onChange={(r) => handleRatingChange(store.id, r)}
                      />

                      <button
                        type="button"
                        className={`rs-btn-sm ${hasSubmitted ? 'rs-btn-secondary' : 'rs-btn-primary'}`}
                        disabled={isSubmitting || currentRating === 0 || currentRating === store.user_rating}
                        onClick={() => handleRatingSubmit(store.id)}
                      >
                        {isSubmitting
                          ? 'Saving...'
                          : hasSubmitted
                          ? 'Update Rating'
                          : 'Submit Rating'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="rs-pagination-bar">
          <span className="rs-pagination-count">
            Showing {stores.length} of {totalCount} registered stores
          </span>
          <div className="rs-pagination-controls">
            <button
              type="button"
              className="rs-btn-icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              <FiChevronLeft />
            </button>
            <span className="rs-page-indicator">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="rs-btn-icon"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;

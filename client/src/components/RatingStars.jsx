import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const RatingStars = ({
  value = 0,
  max = 5,
  onChange = null,
  size = 18,
  readOnly = false,
  showValue = false,
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  const handleClick = (starIndex) => {
    if (!readOnly && onChange) {
      onChange(starIndex);
    }
  };

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="rs-rating-stars-wrapper" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div
        className={`rs-stars-container ${!readOnly ? 'interactive' : ''}`}
        onMouseLeave={() => !readOnly && setHoverValue(0)}
        style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
      >
        {Array.from({ length: max }, (_, i) => {
          const starNumber = i + 1;
          const isFilled = starNumber <= displayValue;

          return (
            <button
              type="button"
              key={starNumber}
              disabled={readOnly}
              className={`rs-star-btn ${isFilled ? 'filled' : 'empty'}`}
              onClick={() => handleClick(starNumber)}
              onMouseEnter={() => !readOnly && setHoverValue(starNumber)}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: readOnly ? 'default' : 'pointer',
                display: 'inline-flex',
                color: isFilled ? '#f59e0b' : '#cbd5e1',
                fontSize: `${size}px`,
                transition: 'transform 0.15s ease, color 0.15s ease',
              }}
              title={!readOnly ? `${starNumber} star${starNumber > 1 ? 's' : ''}` : undefined}
            >
              <FiStar style={{ fill: isFilled ? '#f59e0b' : 'none' }} />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="rs-rating-score-label" style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginLeft: '4px' }}>
          {Number(value).toFixed(1)}
        </span>
      )}

      {!readOnly && hoverValue > 0 && (
        <span className="rs-rating-hint-text" style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>
          ({labels[hoverValue]})
        </span>
      )}
    </div>
  );
};

export default RatingStars;

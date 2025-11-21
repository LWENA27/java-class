import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerFeedback.css';

function CustomerFeedback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderNumber = searchParams.get('order');
    const tableId = searchParams.get('table');
    
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comments, setComments] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const submitFeedback = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            setError('Tafadhali chagua kiwango cha huduma / Please select a rating');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            const deviceId = localStorage.getItem('deviceId');
            
            await axios.post('http://localhost:8080/api/public/feedback', {
                orderNumber,
                deviceId,
                rating,
                comments: comments.trim()
            });

            setSubmitted(true);
            
            // Redirect after 3 seconds
            setTimeout(() => {
                navigate(`/customer-menu?table=${tableId}`);
            }, 3000);

        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError('Hitilafu katika kutuma maoni. / Error submitting feedback.');
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="feedback-container">
                <div className="success-message">
                    <div className="success-icon">✅</div>
                    <h2>Asante sana! / Thank you!</h2>
                    <p>Maoni yako yametumwa kwa mafanikio.</p>
                    <p>Your feedback has been submitted successfully.</p>
                    <div className="spinner-small"></div>
                    <p className="redirect-text">Kurudi kwenye menyu... / Returning to menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-container">
            <div className="feedback-header">
                <button 
                    className="back-btn"
                    onClick={() => navigate(`/customer-menu?table=${tableId}`)}
                >
                    ← Rudi / Back
                </button>
                <h1>⭐ Toa Maoni / Give Feedback</h1>
            </div>

            <div className="feedback-card">
                <h2>Tuambie jinsi tulivyofanya / Tell us how we did</h2>
                <p className="feedback-subtitle">
                    Maoni yako yanatusaidia kuboresha huduma zetu
                    <br />
                    Your feedback helps us improve our service
                </p>

                <form onSubmit={submitFeedback}>
                    {error && (
                        <div className="error-alert">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <div className="rating-section">
                        <label>Kiwango cha Huduma / Service Rating *</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`star ${(hoverRating || rating) >= star ? 'active' : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                        <div className="rating-labels">
                            <span>Mbaya / Poor</span>
                            <span>Nzuri / Excellent</span>
                        </div>
                    </div>

                    <div className="comments-section">
                        <label htmlFor="comments">
                            Maoni Zaidi (si lazima) / Additional Comments (Optional)
                        </label>
                        <textarea
                            id="comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Tuambie zaidi kuhusu uzoefu wako... / Tell us more about your experience..."
                            rows="5"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-feedback-btn"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <span className="spinner-tiny"></span>
                                Inatuma... / Submitting...
                            </>
                        ) : (
                            <>
                                📤 Tuma Maoni / Submit Feedback
                            </>
                        )}
                    </button>
                </form>

                <div className="appreciation-note">
                    <p>🙏 Tunashukuru kwa wakati wako / We appreciate your time</p>
                </div>
            </div>
        </div>
    );
}

export default CustomerFeedback;

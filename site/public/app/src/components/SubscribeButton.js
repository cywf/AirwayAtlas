import React, { useState } from 'react';
import axios from 'axios';

const SubscribeButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/checkout');
      // Redirect to the Stripe Checkout page
      window.location = data.url;
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSubscribe} disabled={loading}>
      {loading ? 'Loading...' : 'Subscribe'}
    </button>
  );
};

export default SubscribeButton;

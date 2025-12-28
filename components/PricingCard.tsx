'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
  trialText: string;
  plan: 'starter' | 'professional' | 'enterprise';
}

export default function PricingCard({
  name,
  price,
  period,
  features,
  highlighted = false,
  trialText,
  plan,
}: PricingCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 p-8 ${
      highlighted ? 'border-primary-600 scale-105' : 'border-gray-200'
    }`}>
      {highlighted && (
        <div className="bg-primary-600 text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
          Most Popular
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-600">{period}</span>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
          highlighted
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          trialText
        )}
      </button>
    </div>
  );
}

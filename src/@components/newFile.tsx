// components/SearchForm.tsx
'use client';

import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';

interface Option { value: number; label: number; }
const options: Option[] = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1, label: i + 1,
}));

export default function SearchForm() {
  const [bathrooms, setBathrooms] = useState<SingleValue<Option>>(null);
  const [bedrooms,  setBedrooms]  = useState<SingleValue<Option>>(null);
  const [sqft,      setSqft]      = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [result,    setResult]    = useState<{ price: number } | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!bathrooms || !bedrooms || !sqft) {
      setError('Select bathrooms, bedrooms, and enter square feet.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bathrooms: bathrooms.value,
          bedrooms:  bedrooms.value,
          sqft:      Number(sqft),
        }),
      });

      if (!res.ok) throw new Error(`Next.js API: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const selectStyles = {
    control: (s: any) => ({ ...s, border: 0, padding: '8px 20px', boxShadow: 'none' }),
    menu:    (s: any) => ({ ...s, borderRadius: 8, marginTop: 4, zIndex: 9999 }),
    menuList:(s: any) => ({ ...s, maxHeight: 150, overflowY: 'auto' }),
    option:  (s: any) => ({ ...s, padding: '10px 15px', borderRadius: 8 }),
  };

  return (
    <form onSubmit={handlePredict} className="flex items-center space-x-2 bg-white rounded-full p-2">
      <div className="w-44 border-r border-gray-200 px-4">
        <Select
          options={options}
          placeholder="Bathrooms"
          value={bathrooms}
          onChange={setBathrooms}
          styles={selectStyles}
        />
      </div>
      <div className="w-44 border-r border-gray-200 px-4">
        <Select
          options={options}
          placeholder="Bedrooms"
          value={bedrooms}
          onChange={setBedrooms}
          styles={selectStyles}
        />
      </div>
      <input
        type="number"
        min={100}
        placeholder="Square feet"
        value={sqft}
        onChange={e => setSqft(e.target.value)}
        className="outline-none w-24"
      />
      <button
        type="submit"
        disabled={loading}
        className={`h-9 w-24 rounded-full text-white ${loading ? 'bg-gray-400' : 'bg-black'}`}
      >
        {loading ? '…Loading' : 'Predict'}
      </button>

      {error && <p className="text-red-500 ml-4">{error}</p>}
      {result && <p className="text-green-600 ml-4">Price: ${result.price.toLocaleString()}</p>}
    </form>
  );
}

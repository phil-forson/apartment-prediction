"use client";
import Image from "next/image";
import apartmentPic from "/apartment.jpg";
import Select, { SingleValue } from "react-select";
import SearchForm from "@/@components/SearchForm";
import MobileSearchForm from "@/@components/MobileSearchForm";
import { useState, useEffect } from "react";

const stateToRegion: { [key: string]: string } = {
  Alabama: "South",
  Alaska: "West",
  Arizona: "West",
  Arkansas: "South",
  California: "West",
  Colorado: "West",
  Connecticut: "Northeast",
  Delaware: "South",
  "District of Columbia": "South",
  Florida: "South",
  Georgia: "South",
  Hawaii: "West",
  Idaho: "West",
  Illinois: "North Central",
  Indiana: "North Central",
  Iowa: "North Central",
  Kansas: "North Central",
  Kentucky: "South",
  Louisiana: "South",
  Maine: "Northeast",
  Massachusetts: "Northeast",
  Michigan: "North Central",
  Minnesota: "North Central",
  Mississippi: "South",
  Missouri: "North Central",
  Montana: "West",
  Nebraska: "North Central",
  Nevada: "West",
  "New Hampshire": "Northeast",
  "New Jersey": "Northeast",
  "New Mexico": "West",
  "New York": "Northeast",
  "North Carolina": "South",
  "North Dakota": "North Central",
  Ohio: "North Central",
  Oklahoma: "South",
  Oregon: "West",
  Pennsylvania: "Northeast",
  "Rhode Island": "Northeast",
  "South Carolina": "South",
  "South Dakota": "North Central",
  Tennessee: "South",
  Texas: "South",
  Utah: "West",
  Vermont: "Northeast",
  Virginia: "South",
  Washington: "West",
  "West Virginia": "South",
  Wisconsin: "North Central",
  Wyoming: "West",
};

interface Option {
  value: number;
  label: number;
}
const options: Option[] = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: i + 1,
}));

export default function Home() {
  const options: Option[] = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  // 2) lift state up
  const [bathrooms, setBathrooms] = useState<SingleValue<Option>>(null);
  const [bedrooms, setBedrooms] = useState<SingleValue<Option>>(null);
  const [sqft, setSqft] = useState("");
  const [region, setRegion] = useState("South");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ prediction: number[] } | null>(null);
  const usStates = Object.keys(stateToRegion).map((state) => ({
    value: state,
    label: state,
  }));

  const [selectedState, setSelectedState] =
    useState<SingleValue<{ label: string; value: string }>>(null);

  useEffect(() => {
    if (!bathrooms || !bedrooms || !sqft || !selectedState) {
      return;
    }
    const hitEndpoint = async () => await handlePredict();
    hitEndpoint();
  }, [selectedState, bedrooms, bathrooms, sqft, region]);

  // 3) handle submit (fetch through App Router API)
  const handlePredict = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setResult(null);

    if (!bathrooms || !bedrooms || !sqft || !selectedState) {
      setError("Please select all fields.");
      alert("Please select all fields.");
      return;
    }

    const mappedRegion = stateToRegion[selectedState?.value ?? "Texas"];

    if (!mappedRegion) {
      setError("Region not found for selected state.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bathrooms: bathrooms.value,
          bedrooms: bedrooms.value,
          sqft: Number(sqft),
          region: mappedRegion,
        }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const commonProps = {
    options,
    bathrooms,
    bedrooms,
    region,
    sqft,
    loading,
    error,
    result,
    onBathroomsChange: setBathrooms,
    onBedroomsChange: setBedrooms,
    onSqftChange: setSqft,
    onRegionChange: setRegion,
    onSubmit: handlePredict,
    usStates,
    selectedState,
    setSelectedState,
  };

  return (
    <>
      <section className="relative hero w-full">
        <div className="overlay">
          <div className="text-white px-4 md:px-24">
            <h1 className="title mt-48 md:mt-24 font-semibold">
              Predict rent prices for apartments
            </h1>
            <p className="subtitle">
              Get a data-driven rent prediction in seconds—just tell us your
              number of rooms and square footage.
            </p>
            <div
              className="absolute left-1/2 transform -translate-x-1/2 top-[calc(var(--hero-height)-var(--search-height))]
 flex justify-center items-center w-full"
            >
              {/* Desktop Form - Hidden on Mobile */}
              <div className="hidden md:block">
                <SearchForm {...commonProps} />
              </div>

              {/* Mobile Form - Hidden on Desktop */}
              <div className="block md:hidden">
                <MobileSearchForm {...commonProps} />
              </div>
            </div>
          </div>
          <div className=""></div>
        </div>
      </section>
      {result?.prediction[0] && (
        <section className="mt-32 md:mt-10 px-4 md:px-24 font-semibold py-8 md:py-10 text-lg text-gray-800 text-center">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <p className="mb-6">
              Based on your input, the estimated monthly rent for an apartment
              with{" "}
              <strong>
                {bedrooms?.label}{" "}
                {bedrooms?.label === 1 ? "bedroom" : "bedrooms"}
              </strong>
              ,{" "}
              <strong>
                {bathrooms?.label}{" "}
                {bathrooms?.label === 1 ? "bathroom" : "bathrooms"}
              </strong>
              , and <strong>{sqft} square feet</strong> located in{" "}
              <strong>{selectedState?.label}</strong> is:
            </p>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <span className="text-2xl md:text-3xl font-bold text-green-600 border-l-4 pl-4 border-green-600">
                ${result.prediction[0].toLocaleString()} / month
              </span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

"use client";
import Image from "next/image";
import apartmentPic from "/apartment.jpg";
import Select, { SingleValue } from "react-select";
import SearchForm from "@/@components/SearchForm";
import { useState, useEffect } from "react";

const stateToRegion: { [key: string]: string } = {
  // Northeast
  Connecticut: "Northeast",
  Maine: "Northeast",
  Massachusetts: "Northeast",
  "New Hampshire": "Northeast",
  "Rhode Island": "Northeast",
  Vermont: "Northeast",
  "New Jersey": "Northeast",
  "New York": "Northeast",
  Pennsylvania: "Northeast",

  // Midwest (aka North Central)
  Indiana: "North Central",
  Illinois: "North Central",
  Michigan: "North Central",
  Ohio: "North Central",
  Wisconsin: "North Central",
  Iowa: "North Central",
  Kansas: "North Central",
  Minnesota: "North Central",
  Missouri: "North Central",
  Nebraska: "North Central",
  "North Dakota": "North Central",
  "South Dakota": "North Central",

  // South
  Delaware: "South",
  Florida: "South",
  Georgia: "South",
  Maryland: "South",
  "North Carolina": "South",
  "South Carolina": "South",
  Virginia: "South",
  "District of Columbia": "South",
  "West Virginia": "South",
  Alabama: "South",
  Kentucky: "South",
  Mississippi: "South",
  Tennessee: "South",
  Arkansas: "South",
  Louisiana: "South",
  Oklahoma: "South",
  Texas: "South",

  // West
  Arizona: "West",
  Colorado: "West",
  Idaho: "West",
  Montana: "West",
  Nevada: "West",
  "New Mexico": "West",
  Utah: "West",
  Wyoming: "West",
  Alaska: "West",
  California: "West",
  Hawaii: "West",
  Oregon: "West",
  Washington: "West",
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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 3) handle submit (fetch through App Router API)
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
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

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center z-50">
        Mobile devices are not currently supported. Please use a laptop or
        desktop.
      </div>
    );
  }
  return (
    <>
      <section className="relative hero w-full">
        <div className="overlay">
          <div className="text-white px-24">
            <h1 className="title mt-24 font-semibold">
              Predict rent prices for apartments
            </h1>
            <p className="subtitle">
              Get a data-driven rent prediction in seconds—just tell us your
              number of rooms and square footage.
            </p>
            <div className="flex justify-center items-center w-full mt-[18rem]">
              <SearchForm
                options={options}
                bathrooms={bathrooms}
                bedrooms={bedrooms}
                region={region}
                sqft={sqft}
                loading={loading}
                error={error}
                result={result}
                onBathroomsChange={setBathrooms}
                onBedroomsChange={setBedrooms}
                onSqftChange={setSqft}
                onRegionChange={setRegion}
                onSubmit={handlePredict}
                usStates={usStates}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
              />
            </div>
          </div>
          <div className=""></div>
        </div>
      </section>
      {result?.prediction[0] && (
        <section className="mt-10 px-24 font-semibold py-10 text-lg text-gray-800 text-center">
          <p>
            Based on your input, the estimated monthly rent for an apartment
            with{" "}
            <strong>
              {bedrooms?.label} {bedrooms?.label === 1 ? "bedroom" : "bedrooms"}
            </strong>
            ,{" "}
            <strong>
              {bathrooms?.label}{" "}
              {bathrooms?.label === 1 ? "bathroom" : "bathrooms"}
            </strong>
            , and <strong>{sqft} square feet</strong> located in{" "}
            <strong>{selectedState?.label}</strong> is:
          </p>
          <span className="text-xl border-l-2 pl-2 w-auto border-green-600">
            ${result.prediction[0].toLocaleString()} / month
          </span>
        </section>
      )}
    </>
  );
}

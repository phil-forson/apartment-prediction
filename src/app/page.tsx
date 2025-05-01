"use client";
import Image from "next/image";
import apartmentPic from "/apartment.jpg";
import Select, { SingleValue } from "react-select";
import SearchForm from "@/@components/SearchForm";
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
            <div
              className="absolute left-1/2 transform -translate-x-1/2 top-[calc(70vh-2.25rem)]
 flex justify-center items-center w-full "
            >
              <SearchForm
                options={[...options, { label: 0, value: 0 }]}
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

import React, { useState } from "react";
import Select, { SingleValue } from "react-select";

interface Option {
  value: number;
  label: number;
}
const options: Option[] = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: i + 1,
}));



export interface SearchFormProps {
  options: Option[];
  bathrooms: SingleValue<Option>;
  bedrooms: SingleValue<Option>;
  region: string;
  sqft: string;
  loading: boolean;
  error: string | null;
  result: { prediction: number[] } | null;
  usStates: { value: string; label: string }[];
  selectedState: SingleValue<{ label: string; value: string }> | null;
  setSelectedState: (val: SingleValue<{ label: string; value: string }>) => void;

  onBathroomsChange: (val: SingleValue<Option>) => void;
  onBedroomsChange: (val: SingleValue<Option>) => void;
  onSqftChange: (val: string) => void;
  onRegionChange: (val: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SearchForm = ({
  options,
  bathrooms,
  bedrooms,
  usStates,
  selectedState,
  setSelectedState,
  sqft,
  loading,
  error,
  result,
  onBathroomsChange,
  onBedroomsChange,
  onSqftChange,
  onSubmit,
}: SearchFormProps) => {


  return (
    <form
      onSubmit={onSubmit}
      className="w-auto rounded-full bg-white flex h-16 items-center text-slate-900"
    >
      <div className="border-r border-[#E2E8F0] py-2 px-4 w-[18rem]">
        <Select
          options={options}
          placeholder="How many bathrooms?"
          value={bathrooms}
          onChange={onBathroomsChange}
          styles={{
            control: (styles: any) => ({
              ...styles,
              border: "0px solid #E2E8F0",
              paddingVertical: "8px",
              paddingHorizontal: "20px",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              boxShadow: "none",
              ":hover": {
                borderColor: "#E2E8F0",
              },
            }),
            menu: (styles: any) => ({
              ...styles,
              backgroundColor: "#fff",
              borderRadius: "8px",
              marginTop: "4px",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              zIndex: 9999,
            }),
            menuList: (styles: any) => ({
              ...styles,
              padding: "0px 4px",
              maxHeight: "150px",
              overflowY: "auto",
            }),
            option: (styles: any) => ({
              ...styles,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#334155",
              cursor: "pointer",
              padding: "10px 15px",
              margin: "4px 0",
              borderRadius: "8px",
              ":hover": {
                backgroundColor: "#F1F5F9",
              },
            }),
            input: (styles: any) => ({
              ...styles,
              border: "none !important",
              borderWidth: "0px !important",
            }),
            singleValue: (styles: any) => ({
              ...styles,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }),
          }}
        />
      </div>
      <div className="border-r border-[#E2E8F0] py-2 px-4 w-[18rem]">
        <Select
          options={options}
          placeholder="How many bedrooms?"
          value={bedrooms}
          onChange={onBedroomsChange}
          styles={{
            control: (styles: any) => ({
              ...styles,
              border: "0px solid #E2E8F0",
              paddingVertical: "8px",
              paddingHorizontal: "20px",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              boxShadow: "none",
              ":hover": {
                borderColor: "#E2E8F0",
              },
            }),
            menu: (styles: any) => ({
              ...styles,
              backgroundColor: "#fff",
              borderRadius: "8px",
              marginTop: "4px",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              zIndex: 9999,
            }),
            menuList: (styles: any) => ({
              ...styles,
              padding: "0px 4px",
              maxHeight: "150px",
              overflowY: "auto",
            }),
            option: (styles: any) => ({
              ...styles,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#334155",
              cursor: "pointer",
              padding: "10px 15px",
              margin: "4px 0",
              borderRadius: "8px",
              ":hover": {
                backgroundColor: "#F1F5F9",
              },
            }),
            input: (styles: any) => ({
              ...styles,
              border: "none !important",
              borderWidth: "0px !important",
            }),
            singleValue: (styles: any) => ({
              ...styles,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }),
          }}
        />
      </div>
      <div className="border-r border-[#E2E8F0] py-2 px-4 w-[18rem]">
        <Select
          options={usStates}
          value={selectedState}
          onChange={setSelectedState}
          styles={{
            control: (styles: any) => ({
              ...styles,
              border: "0px solid #E2E8F0",
              paddingVertical: "8px",
              paddingHorizontal: "20px",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              boxShadow: "none",
              ":hover": {
                borderColor: "#E2E8F0",
              },
            }),
            menu: (styles: any) => ({
              ...styles,
              backgroundColor: "#fff",
              borderRadius: "8px",
              marginTop: "4px",
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              zIndex: 9999,
            }),
            menuList: (styles: any) => ({
              ...styles,
              padding: "0px 4px",
              maxHeight: "150px",
              overflowY: "auto",
            }),
            option: (styles: any) => ({
              ...styles,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#334155",
              cursor: "pointer",
              padding: "10px 15px",
              margin: "4px 0",
              borderRadius: "8px",
              ":hover": {
                backgroundColor: "#F1F5F9",
              },
            }),
            input: (styles: any) => ({
              ...styles,
              border: "none !important",
              borderWidth: "0px !important",
            }),
            singleValue: (styles: any) => ({
              ...styles,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }),
          }}
        />
      </div>
      <div className="py-2 px-4">
        <input
          type="number"
          placeholder="Input square feet"
          className="border-none focus:border-none outline-0"
          value={sqft}
          onChange={(e) => onSqftChange(e.target.value)}
          min={100}
        />
      </div>
      {/* <div className="py-2 px-4">
        <input
          type="number"
          placeholder="Enter your annual income"
          className="border-none focus:border-none outline-0"
          value={sqft}
          onChange={e => onSqftChange(e.target.value)}
          min={100}
        />
      </div> */}
      <div className="py-1 pr-2">
        <button
          type="submit"
          disabled={loading}
          className={`h-9 cursor-pointer w-28 rounded-full text-white ${
            loading ? "bg-gray-400" : "bg-black"
          }`}
        >
          {" "}
          {loading ? "…Loading" : "Calculate Rent"}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;

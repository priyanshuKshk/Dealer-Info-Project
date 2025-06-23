// components/AddDealer.jsx
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import api from "../utils/api";

import {
  Building2, Hash, MapPin, User, Phone, Mail, Globe,
  NotebookPen, Link as LinkIcon, Activity
} from "lucide-react";
import indianLocations from "../json/indianStatesDistricts.json";
import IconField from "../components/IconField";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  dealershipName: yup.string().trim().required("Dealership name is required"),
  dealerCode: yup.string().trim().required("Dealer code is required"),
  address: yup.string().trim().required("Address is required"),
  contactPerson: yup.string().trim().required("Contact person is required"),
  contactNumber: yup
    .string()
    .matches(/^[0-9]{10,15}$/g, "Enter a valid contact number")
    .required(),
  pincode: yup.string().matches(/^\d{6}$/, "Enter a 6-digit pincode").required(),
  city: yup.string().trim().required("City is required"),
  district: yup.string().trim().required("District is required"),
  state: yup.string().trim().required("State is required"),
  country: yup.string().trim().required(),
  services: yup.string().trim(),
  email: yup.string().email("Invalid email").required(),
  website: yup.string().url("Invalid URL").optional().nullable(),
  status: yup.string().oneOf(["active", "inactive"]).required(),
});

export default function AddDealer() {
  const {
    register, handleSubmit, watch, reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      dealershipName: "",
      dealerCode: "",
      address: "",
      contactPerson: "",
      contactNumber: "",
      pincode: "",
      city: "",
      district: "",
      state: "",
      country: "India",
      services: "",
      email: "",
      website: "",
      status: "active",
    },
  });
const navigate = useNavigate();

  const selectedState = watch("state");
  const selectedDistrict = watch("district");

  const stateOptions = Object.keys(indianLocations);
  const districtOptions = useMemo(
    () => (selectedState ? Object.keys(indianLocations[selectedState] || {}) : []),
    [selectedState]
  );
  const cityOptions = useMemo(
    () => selectedState && selectedDistrict
      ? indianLocations[selectedState]?.[selectedDistrict] || []
      : [],
    [selectedState, selectedDistrict]
  );

  const onSubmit = async (values) => {
  const website = values.website && !/^https?:\/\//i.test(values.website)
    ? `https://${values.website}`
    : values.website;

  try {
    const { data } = await api.post("/dealers", { ...values, website });

    // ✅ Show toast with OK button
    toast((t) => (
      <span>
        Dealer added successfully
        <button
          onClick={() => {
            toast.dismiss(t.id);
            navigate("/home"); // ✅ Navigate to home on OK
          }}
          className="ml-4 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          OK
        </button>
      </span>
    ));

    reset(); // optional: clear form
  } catch (e) {
    if (e.response?.status === 409 || e.response?.data?.status === "exists") {
      toast.error("Dealer already exists");
    } else {
      toast.error(e.response?.data?.message ?? "Failed to add dealer");
    }
  }
};


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold text-center">Add Dealer</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IconField {...register("dealershipName")} placeholder="Dealership Name" icon={Building2} error={errors.dealershipName} />
        <IconField {...register("dealerCode")} placeholder="Dealer Code" icon={Hash} error={errors.dealerCode} />
      </div>

      <IconField {...register("address")} as="textarea" rows={3} placeholder="Address" icon={MapPin} error={errors.address} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <IconField {...register("contactPerson")} placeholder="Contact Person" icon={User} error={errors.contactPerson} />
        <IconField {...register("contactNumber")} placeholder="Contact Number" icon={Phone} error={errors.contactNumber} />
        <IconField {...register("pincode")} placeholder="Pincode" icon={MapPin} error={errors.pincode} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <select {...register("state")} className="border p-2 rounded w-full pl-10 bg-white">
            <option value="">State</option>
            {stateOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state.message}</p>}
        </div>

        <div className="relative">
          <select {...register("district")} disabled={!selectedState} className="border p-2 rounded w-full pl-10 bg-white">
            <option value="">District</option>
            {districtOptions.map((d) => <option key={d}>{d}</option>)}
          </select>
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district.message}</p>}
        </div>

        <div className="relative">
          <input {...register("city")} list="cityList" placeholder="City" disabled={!selectedDistrict} className="border p-2 rounded w-full pl-10" />
          <datalist id="cityList">
            {cityOptions.map((c) => <option key={c} value={c} />)}
          </datalist>
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IconField {...register("country")} placeholder="Country" icon={Globe} />
        <IconField {...register("services")} placeholder="Services (comma separated)" icon={NotebookPen} error={errors.services} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IconField {...register("email")} placeholder="Email" icon={Mail} error={errors.email} />
        <IconField {...register("website")} placeholder="Website" icon={LinkIcon} error={errors.website} />
      </div>

      <div className="relative">
        <select {...register("status")} className="border p-2 rounded w-full pl-10 bg-white">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 w-full disabled:opacity-50"
      >
        {isSubmitting ? "Saving…" : "Add Dealer"}
      </button>
    </form>
  );
}

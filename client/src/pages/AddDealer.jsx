import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Building2,
  Hash,
  MapPin,
  User,
  Phone,
  Mail,
  Globe,
  NotebookPen,
  Link as LinkIcon,
  Activity,
} from "lucide-react";

import indianLocations from "../json/indianStatesDistricts.json";

/* -------------------------------------------------- */
// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

/* -------------------------------------------------- */
// Validation schema
const schema = yup.object({
  dealershipName: yup.string().trim().required("Dealership name is required"),
  dealerCode: yup.string().trim().required("Dealer code is required"),
  address: yup.string().trim().required("Address is required"),
  contactPerson: yup.string().trim().required("Contact person is required"),
  contactNumber: yup
    .string()
    .matches(/^[0-9]{10,15}$/g, "Enter a valid contact number")
    .required(),
  pincode: yup.string().matches(/^\d{6}$/, "Enter a 6‑digit pincode").required(),
  city: yup.string().trim().required("City is required"),
  district: yup.string().trim().required("District is required"),
  state: yup.string().trim().required("State is required"),
  country: yup.string().trim().required(),
  services: yup.string().trim(),
  email: yup.string().email("Invalid email").required(),
  website: yup.string().url("Invalid URL").optional().nullable(),
  status: yup.string().oneOf(["active", "inactive"]).required(),
});

/* -------------------------------------------------- */
// Reusable input with icon
function Field({ icon: Icon, as: Component = "input", error, className = "", ...props }) {
  return (
    <div className="relative">
      <Component
        {...props}
        className={
          "pl-10 border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 " +
          (error ? "border-red-500" : "border-gray-300") +
          " " +
          className
        }
      />
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}

/* -------------------------------------------------- */
export default function AddDealer() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
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

  const selectedState = watch("state");
  const selectedDistrict = watch("district");

  const stateOptions = Object.keys(indianLocations);
  const districtOptions = useMemo(
    () => (selectedState ? Object.keys(indianLocations[selectedState] || {}) : []),
    [selectedState]
  );
  const cityOptions = useMemo(
    () =>
      selectedState && selectedDistrict
        ? indianLocations[selectedState]?.[selectedDistrict] || []
        : [],
    [selectedState, selectedDistrict]
  );

  /* --------------------------- submit -------------------------- */
  const onSubmit = async (values) => {
    const website = values.website && !/^https?:\/\//i.test(values.website) ? `https://${values.website}` : values.website;
    try {
      await api.post("/api/dealers", { ...values, website });
      toast.success("Dealer added successfully");
      reset();
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message ?? "Failed to add dealer");
    }
  };

  /* -------------------------- animation ------------------------ */
  const fadeStagger = {
    hidden: { opacity: 0, y: 8 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      <motion.h2 className="text-2xl font-bold text-center" variants={fadeStagger}>
        Add Dealer
      </motion.h2>

      {/* Dealer Name & Code */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={fadeStagger}>
        <Field
          {...register("dealershipName")}
          placeholder="Dealership Name"
          icon={Building2}
          error={errors.dealershipName}
        />
        <Field
          {...register("dealerCode")}
          placeholder="Dealer Code"
          icon={Hash}
          error={errors.dealerCode}
        />
      </motion.div>

      {/* Address */}
      <motion.div variants={fadeStagger}>
        <Field
          {...register("address")}
          as="textarea"
          rows={3}
          placeholder="Address"
          icon={MapPin}
          error={errors.address}
        />
      </motion.div>

      {/* Contact info */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={fadeStagger}>
        <Field
          {...register("contactPerson")}
          placeholder="Contact Person"
          icon={User}
          error={errors.contactPerson}
        />
        <Field
          {...register("contactNumber")}
          placeholder="Contact Number"
          icon={Phone}
          error={errors.contactNumber}
        />
        <Field
          {...register("pincode")}
          placeholder="Pincode"
          icon={MapPin}
          error={errors.pincode}
        />
      </motion.div>

      {/* Location */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={fadeStagger}>
        {/* State */}
        <div className="relative">
          <select
            {...register("state")}
            className="border p-2 rounded w-full pl-10 bg-white"
          >
            <option value="">State</option>
            {stateOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state.message}</p>}
        </div>

        {/* District */}
        <div className="relative">
          <select
            {...register("district")}
            disabled={!selectedState}
            className="border p-2 rounded w-full pl-10 bg-white"
          >
            <option value="">District</option>
            {districtOptions.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {errors.district && <p className="text-xs text-red-600 mt-1">{errors.district.message}</p>}
        </div>

        {/* City */}
        <div className="relative">
          <input
            {...register("city")}
            list="cityList"
            placeholder="City"
            disabled={!selectedDistrict}
            className="border p-2 rounded w-full pl-10"
          />
          <datalist id="cityList">
            {cityOptions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>}
        </div>
      </motion.div>

      {/* Country & Services */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={fadeStagger}>
        <Field
          {...register("country")}
          placeholder="Country"
          icon={Globe}
        />
        <Field
          {...register("services")}
          placeholder="Services (comma separated)"
          icon={NotebookPen}
          error={errors.services}
        />
      </motion.div>

      {/* Email & Website */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={fadeStagger}>
        <Field
          {...register("email")}
          placeholder="Email"
          icon={Mail}
          error={errors.email}
        />
        <Field
          {...register("website")}
          placeholder="Website"
          icon={LinkIcon}
          error={errors.website}
        />
      </motion.div>

      {/* Status */}
      <motion.div variants={fadeStagger} className="relative">
        <select {...register("status")} className="border p-2 rounded w-full pl-10 bg-white">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </motion.div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 w-full disabled:opacity-50"
        variants={fadeStagger}
      >
        {isSubmitting ? "Saving…" : "Add Dealer"}
      </motion.button>
    </motion.form>
  );
}

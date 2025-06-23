// components/EditDealerModal.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Building2, Globe, MapPin, Phone, ListFilter,
  User, Hash, NotebookPen, Mail, Link as LinkIcon
} from "lucide-react";
import api from "../utils/api";
import locationData from "../json/indianStatesDistricts.json";
import IconField from "./IconField"; // 👈 helper field component

export default function EditDealerModal({ open, onClose, dealer, onSaveAfterSuccess }) {
  const [form, setForm] = useState(dealer || {});
  const [districtOptions, setDistrictOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  // Sync form when dealer changes
  useEffect(() => {
    if (open && dealer) {
      setForm(dealer);
    }
  }, [open, dealer]);

  // Update options on state/district change
  useEffect(() => {
    if (!open) return;
    const districts = form.state ? Object.keys(locationData[form.state] || {}) : [];
    setDistrictOptions(districts);
    const cities = form.state && form.district
      ? locationData[form.state]?.[form.district] || []
      : [];
    setCityOptions(cities);
  }, [open, form.state, form.district]);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/dealers/${dealer._id}`, form);
      onSaveAfterSuccess(form);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update dealer.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
          />
         <motion.div
  key="modal"
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
  className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-lg p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]"
>

            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Edit Dealer</h4>
              <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <IconField icon={Building2} placeholder="Dealership Name" value={form.dealershipName || ""} onChange={handleChange("dealershipName")} />
              <IconField icon={Hash} placeholder="Dealer Code" value={form.dealerCode || ""} onChange={handleChange("dealerCode")} />
              <IconField as="textarea" icon={MapPin} placeholder="Address" rows={2} value={form.address || ""} onChange={handleChange("address")} />
              <IconField icon={User} placeholder="Contact Person" value={form.contactPerson || ""} onChange={handleChange("contactPerson")} />
              <IconField icon={Phone} placeholder="Contact Number" value={form.contactNumber || ""} onChange={handleChange("contactNumber")} />
              <IconField icon={MapPin} placeholder="Pincode" value={form.pincode || ""} onChange={handleChange("pincode")} />

              {/* State / District / City */}
              <div className="flex flex-col md:flex-row gap-3">
                <IconField as="select" icon={Globe} value={form.state || ""} onChange={(e) => {
                  handleChange("state")(e);
                  setForm((p) => ({ ...p, district: "", city: "" }));
                }}>
                  <option value="">State</option>
                  {Object.keys(locationData).map((s) => <option key={s}>{s}</option>)}
                </IconField>

                <IconField as="select" icon={MapPin} value={form.district || ""} disabled={!form.state} onChange={(e) => {
                  handleChange("district")(e);
                  setForm((p) => ({ ...p, city: "" }));
                }}>
                  <option value="">District</option>
                  {districtOptions.map((d) => <option key={d}>{d}</option>)}
                </IconField>
              </div>

              <IconField as="select" icon={MapPin} value={form.city || ""} disabled={!form.district} onChange={handleChange("city")}>
                <option value="">City</option>
                {cityOptions.map((c) => <option key={c}>{c}</option>)}
              </IconField>

              <IconField icon={Globe} placeholder="Country" value={form.country || ""} onChange={handleChange("country")} />
              <IconField icon={NotebookPen} placeholder="Services" value={form.services || ""} onChange={handleChange("services")} />
              <IconField icon={Mail} placeholder="Email" value={form.email || ""} onChange={handleChange("email")} />
              <IconField icon={LinkIcon} placeholder="Website" value={form.website || ""} onChange={handleChange("website")} />

              <IconField as="select" icon={ListFilter} value={form.status || "active"} onChange={handleChange("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </IconField>

              <div className="text-right">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

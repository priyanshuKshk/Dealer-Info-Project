/* DealerList.jsx ----------------------------------------------------------- */
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  ListFilter,
  Globe,
  Phone,
  Mail,
  Building2,
  Pencil,
  Trash,
  X,
} from "lucide-react";
import api from "../utils/api";
import locationData from "../json/indianStatesDistricts.json";

/* ------------ small helpers --------------------------------------------- */
const IconField = ({
  as: Comp = "input",
  icon: Icon,
  className = "",
  ...props
}) => (
  <div className="relative flex-1">
    <Comp
      {...props}
      className={`pl-10 border px-3 py-2 rounded shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    />
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  </div>
);

/* ------------ edit-dealer modal ----------------------------------------- */
const EditDealerModal = ({
  open,
  onClose,
  dealer,
  onSaveAfterSuccess,
}) => {
  const [form, setForm] = useState(() => dealer || {});
  const [districtOptions, setDistrictOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  /* pull options whenever state / district changes */
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
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/dealers/${dealer._id}`, form);
      onSaveAfterSuccess(form);   // push changes up
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
          {/* overlay */}
          <motion.div
            key="backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
          />
          {/* modal */}
          <motion.div
            key="modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-lg p-6 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Edit Dealer</h4>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* name */}
              <IconField
                icon={Building2}
                placeholder="Dealership Name"
                value={form.dealershipName || ""}
                onChange={handleChange("dealershipName")}
              />

              {/* cascading state / district / city */}
              <div className="flex flex-col md:flex-row gap-3">
                <IconField
                  as="select"
                  icon={Globe}
                  value={form.state || ""}
                  onChange={(e) => {
                    handleChange("state")(e);
                    setForm((p) => ({ ...p, district: "", city: "" }));
                  }}
                >
                  <option value="">State</option>
                  {Object.keys(locationData).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </IconField>

                <IconField
                  as="select"
                  icon={MapPin}
                  value={form.district || ""}
                  disabled={!form.state}
                  onChange={(e) => {
                    handleChange("district")(e);
                    setForm((p) => ({ ...p, city: "" }));
                  }}
                >
                  <option value="">District</option>
                  {districtOptions.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </IconField>
              </div>

              <IconField
                as="select"
                icon={MapPin}
                value={form.city || ""}
                disabled={!form.district}
                onChange={handleChange("city")}
              >
                <option value="">City</option>
                {cityOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </IconField>

              {/* contact + status */}
              <div className="flex flex-col md:flex-row gap-3">
                <IconField
                  icon={Phone}
                  placeholder="Contact Number"
                  value={form.contactNumber || ""}
                  onChange={handleChange("contactNumber")}
                />
                <IconField
                  as="select"
                  icon={ListFilter}
                  value={form.status || "active"}
                  onChange={handleChange("status")}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </IconField>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
/* ------------------------------------------------------------------------ */

export default function DealerList() {
  /* ---------------- state ------------------------------------------------ */
  const [dealers, setDealers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [nameInput, setNameInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [districtInput, setDistrictInput] = useState("");
  const [cityInput, setCityInput] = useState("");

  const [districtOptions, setDistrictOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  /* modal state */
  const [editOpen, setEditOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState(null);

  /* ---------------- fetch dealers --------------------------------------- */
  useEffect(() => {
    api
      .get("/dealers")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.dealers || [];
        setDealers(list);
        setFiltered(list);
      })
      .catch(console.error);
  }, []);

  /* --------------- cascading dropdowns ---------------------------------- */
  const handleStateChange = (e) => {
    const state = e.target.value;
    setStateInput(state);
    const districts = state ? Object.keys(locationData[state] || {}) : [];
    setDistrictOptions(districts);
    setDistrictInput("");
    setCityOptions([]);
    setCityInput("");
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setDistrictInput(district);
    const cities = locationData[stateInput]?.[district] || [];
    setCityOptions(cities);
    setCityInput("");
  };

  /* ------------------- search ------------------------------------------- */
  const runSearch = useCallback(() => {
    let rows = [...dealers];
    if (stateInput)
      rows = rows.filter(
        (d) => d.state?.toLowerCase() === stateInput.toLowerCase()
      );
    if (districtInput)
      rows = rows.filter(
        (d) => d.district?.toLowerCase() === districtInput.toLowerCase()
      );
    if (cityInput)
      rows = rows.filter(
        (d) => d.city?.toLowerCase() === cityInput.toLowerCase()
      );
    if (nameInput)
      rows = rows.filter((d) =>
        d.dealershipName.toLowerCase().includes(nameInput.toLowerCase())
      );
    setFiltered(rows);
  }, [dealers, nameInput, stateInput, districtInput, cityInput]);

  /* ---------------- handlers -------------------------------------------- */
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this dealer? This action cannot be undone."
      )
    )
      return;

    try {
      await api.delete(`/dealers/${id}`);
      setDealers((prev) => prev.filter((d) => d._id !== id));
      setFiltered((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete dealer.");
    }
  };

  const openEdit = (dealer) => {
    setEditingDealer(dealer);
    setEditOpen(true);
  };

  const handleSaveAfterSuccess = (updated) => {
    setDealers((prev) =>
      prev.map((d) => (d._id === updated._id ? updated : d))
    );
    setFiltered((prev) =>
      prev.map((d) => (d._id === updated._id ? updated : d))
    );
  };

  /* ---------------- variants -------------------------------------------- */
  const rowVar = {
    hidden: { opacity: 0, y: 6 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.03 } }),
  };
  const cardVar = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.04 } }),
  };

  /* ---------------- render ---------------------------------------------- */
  return (
    <>
      {/* ---------------- main list ------------------------------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 max-w-6xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Dealer Directory</h2>

        {/* ----------- filters --------------------------------------- */}
        <div className="grid gap-4 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          <IconField
            icon={Search}
            placeholder="Dealer name…"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />

          <div className="flex flex-col gap-3 md:flex-col lg:flex-row col-span-1 md:col-span-2 lg:col-span-4">
            <IconField
              as="select"
              icon={Globe}
              value={stateInput}
              onChange={handleStateChange}
            >
              <option value="">State</option>
              {Object.keys(locationData).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </IconField>

            <IconField
              as="select"
              icon={MapPin}
              value={districtInput}
              onChange={handleDistrictChange}
              disabled={!stateInput}
            >
              <option value="">District</option>
              {districtOptions.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </IconField>

            <IconField
              list="cityOptions"
              icon={MapPin}
              placeholder="City"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              disabled={!districtInput}
            />
            <datalist id="cityOptions">
              {cityOptions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>

            <button
              type="button"
              onClick={runSearch}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
            >
              <ListFilter className="h-4 w-4" /> Search
            </button>
          </div>
        </div>

        {/* ---------------- table view -------------------------------- */}
        <div className="overflow-x-auto border rounded mb-10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">State</th>
                <th className="p-2 border">District</th>
                <th className="p-2 border">City</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length > 0 ? (
                  filtered.map((d, i) => (
                    <motion.tr
                      key={d._id}
                      custom={i}
                      variants={rowVar}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="hover:bg-gray-50"
                    >
                      <td className="p-2 border">{d.dealershipName}</td>
                      <td className="p-2 border">{d.state}</td>
                      <td className="p-2 border">{d.district}</td>
                      <td className="p-2 border">{d.city}</td>
                      <td className="p-2 border">{d.contactNumber}</td>
                      <td className="p-2 border">
                        <span
                          className={`px-2 py-1 rounded text-white text-sm ${
                            d.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(d)}
                            className="p-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(d._id)}
                            className="p-1 bg-red-500 hover:bg-red-600 text-white rounded"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-4 text-gray-500">
                      Search dealer…
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* ---------------- card grid -------------------------------- */}
        <h3 className="text-xl font-semibold mb-3">All Dealers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {dealers.map((d, i) => (
              <motion.div
                key={d._id}
                custom={i}
                variants={cardVar}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="border rounded-lg shadow-sm p-4 hover:shadow-md transition"
              >
                <h4 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-indigo-600" />{" "}
                  {d.dealershipName}
                </h4>
                {d.contactPerson && (
                  <p className="text-sm mb-1">
                    <Mail className="inline-block h-4 w-4 mr-1 text-gray-500" />{" "}
                    {d.contactPerson}
                  </p>
                )}
                <p className="text-sm text-gray-700 mb-1">
                  <MapPin className="inline-block h-4 w-4 mr-1 text-gray-500" />{" "}
                  {d.city}, {d.district}, {d.state}
                </p>
                <p className="text-sm mb-1">
                  <Phone className="inline-block h-4 w-4 mr-1 text-gray-500" />{" "}
                  {d.contactNumber}
                </p>
                {d.website && (
                  <p className="text-sm mb-1 text-blue-600 underline">
                    <a
                      href={
                        d.website.startsWith("http")
                          ? d.website
                          : `https://${d.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {d.website}
                    </a>
                  </p>
                )}
                {d.email && (
                  <p className="text-sm mb-2 text-gray-700">✉️ {d.email}</p>
                )}
                <span
                  className={`inline-block px-2 py-1 rounded text-white text-xs ${
                    d.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {d.status}
                </span>

                {/* actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEdit(d)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d._id)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    <Trash className="w-3 h-3" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* -------------- edit modal --------------------------------------- */}
      <EditDealerModal
        open={editOpen}
        dealer={editingDealer}
        onClose={() => setEditOpen(false)}
        onSaveAfterSuccess={handleSaveAfterSuccess}
      />
    </>
  );
}

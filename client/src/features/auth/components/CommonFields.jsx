const CommonFields = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name / Organization Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {formData.role === "requester"
              ? "Organization/Full Name"
              : "Full Name"}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder={
              formData.role === "requester"
                ? "Your Organization Name"
                : "Enter your full name"
            }
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="0912345678"
          />
        </div>
      </div>

      {/* Requester-specific fields */}
      {formData.role === "requester" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person Name
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Person responsible for requests"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department/Unit
            </label>
            <input
              type="text"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., IT Department, Admin"
            />
          </div>
        </div>
      )}

      {/* Email - Always shown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="••••••••"
            required
            minLength="6"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
        </div>
      </div>

      {/* Demographic Information - Optional for all */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-md font-medium text-gray-700 mb-3">
          Additional Information (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="demographic.gender"
            value={formData.demographic.gender}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            type="number"
            name="demographic.age"
            value={formData.demographic.age}
            onChange={handleChange}
            placeholder="Age"
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            name="demographic.region"
            value={formData.demographic.region}
            onChange={handleChange}
            placeholder="Region"
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default CommonFields;

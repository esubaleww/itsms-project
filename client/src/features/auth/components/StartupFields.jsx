const StartupFields = ({
  formData,
  handleChange,
  founders,
  handleFounderChange,
  addFounder,
  removeFounder,
}) => {
  return (
    <div className="space-y-6 border-t pt-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Startup Information
      </h2>

      {/* Company Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Your Company PLC"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="REG2025001"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sector
          </label>
          <select
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Sector</option>
            <option value="software">Software</option>
            <option value="hardware">Hardware</option>
            <option value="agritech">AgriTech</option>
            <option value="fintech">FinTech</option>
            <option value="healthtech">HealthTech</option>
            <option value="edtech">EdTech</option>
            <option value="biotech">BioTech</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Incubation Center
          </label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Incubation Center Name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Stage
        </label>
        <select
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="idea">Idea Stage</option>
          <option value="mvp">MVP (Minimum Viable Product)</option>
          <option value="launched">Launched</option>
          <option value="growth">Growth Stage</option>
          <option value="scale">Scaling</option>
        </select>
      </div>

      {/* Founders Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-medium text-gray-700">
            Founders/Team Members
          </h3>
          <button
            type="button"
            onClick={addFounder}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Add Founder
          </button>
        </div>

        {founders.map((founder, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg space-y-3"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Founder {index + 1}</h4>
              {founders.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFounder(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={founder.name}
                onChange={(e) =>
                  handleFounderChange(index, "name", e.target.value)
                }
                placeholder="Full Name"
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required={index === 0}
              />
              <input
                type="text"
                value={founder.role}
                onChange={(e) =>
                  handleFounderChange(index, "role", e.target.value)
                }
                placeholder="Role (e.g., CEO, CTO)"
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required={index === 0}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="email"
                value={founder.email}
                onChange={(e) =>
                  handleFounderChange(index, "email", e.target.value)
                }
                placeholder="Email"
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required={index === 0}
              />
              <input
                type="number"
                value={founder.share}
                onChange={(e) =>
                  handleFounderChange(index, "share", e.target.value)
                }
                placeholder="Equity Share %"
                min="0"
                max="100"
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartupFields;

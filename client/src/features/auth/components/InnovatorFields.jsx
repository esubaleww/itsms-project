const InnovatorFields = ({
  formData,
  handleChange,
  interestInput,
  setInterestInput,
  skillInput,
  setSkillInput,
  handleArrayAdd,
  handleArrayRemove,
}) => {
  return (
    <div className="space-y-6 border-t pt-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Innovator Information
      </h2>

      {/* Institution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Institution/Affiliation <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g., University, Incubation Hub, Self-taught"
          required
        />
      </div>

      {/* Education */}
      <div className="space-y-3">
        <h3 className="text-md font-medium text-gray-700">
          Education (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="education.level"
            value={formData.education.level}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Education Level</option>
            <option value="High School">High School</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Master's">Master's</option>
            <option value="PhD">PhD</option>
            <option value="Self-taught">Self-taught</option>
          </select>

          <input
            type="text"
            name="education.fieldOfStudy"
            value={formData.education.fieldOfStudy}
            onChange={handleChange}
            placeholder="Field of Study"
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <input
          type="number"
          name="education.graduationYear"
          value={formData.education.graduationYear}
          onChange={handleChange}
          placeholder="Graduation Year"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Areas of Interest */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Areas of Interest
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              (e.preventDefault(),
              handleArrayAdd(
                "areasOfInterest",
                interestInput,
                setInterestInput,
              ))
            }
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., AI, AgriTech, Clean Energy"
          />
          <button
            type="button"
            onClick={() =>
              handleArrayAdd("areasOfInterest", interestInput, setInterestInput)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.areasOfInterest.map((interest, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {interest}
              <button
                type="button"
                onClick={() => handleArrayRemove("areasOfInterest", index)}
                className="text-green-600 hover:text-green-800 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              (e.preventDefault(),
              handleArrayAdd("skills", skillInput, setSkillInput))
            }
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., Python, Research, Prototyping"
          />
          <button
            type="button"
            onClick={() => handleArrayAdd("skills", skillInput, setSkillInput)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleArrayRemove("skills", index)}
                className="text-blue-600 hover:text-blue-800 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InnovatorFields;

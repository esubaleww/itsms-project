const InternFields = ({
  formData,
  handleChange,
  skillInput,
  setSkillInput,
  handleArrayAdd,
  handleArrayRemove,
  handleFileChange,
}) => {
  return (
    <div className="space-y-6 border-t pt-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Intern Information
      </h2>

      {/* Student ID and Institution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., STU2024001"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: STU + year + 4 digits
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            University/Institution <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Bahir Dar University"
            required
          />
        </div>
      </div>

      {/* Education Details */}
      <div className="space-y-3">
        <h3 className="text-md font-medium text-gray-700">Education Details</h3>
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
            <option value="Diploma">Diploma</option>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="education.graduationYear"
            value={formData.education.graduationYear}
            onChange={handleChange}
            placeholder="Graduation Year"
            min="2000"
            max="2030"
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="number"
            step="0.1"
            name="education.gpa"
            value={formData.education.gpa}
            onChange={handleChange}
            placeholder="GPA (optional)"
            min="0"
            max="4"
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
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
            placeholder="e.g., JavaScript, React, Python"
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
          {formData.skills.length === 0 && (
            <p className="text-sm text-gray-400">No skills added yet</p>
          )}
        </div>
      </div>

      {/* Documents Upload */}
      <div className="space-y-3">
        <h3 className="text-md font-medium text-gray-700">Documents</h3>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            CV/Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, "cv")}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Academic Transcript (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, "transcript")}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Recommendation Letter (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, "recommendation")}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-3">
        <h3 className="text-md font-medium text-gray-700">Emergency Contact</h3>

        <input
          type="text"
          name="emergencyContact.name"
          value={formData.emergencyContact.name}
          onChange={handleChange}
          placeholder="Contact Person Name"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="tel"
            name="emergencyContact.phone"
            value={formData.emergencyContact.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            name="emergencyContact.relationship"
            value={formData.emergencyContact.relationship}
            onChange={handleChange}
            placeholder="Relationship"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Internship Preferences */}
      <div className="space-y-3">
        <h3 className="text-md font-medium text-gray-700">
          Internship Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Preferred Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Department</option>
              <option value="Software Development">Software Development</option>
              <option value="Network Infrastructure">
                Network Infrastructure
              </option>
              <option value="Hardware Support">Hardware Support</option>
              <option value="Digital Services">Digital Services</option>
              <option value="Innovation">Innovation</option>
              <option value="Training">Training</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Preferred Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternFields;

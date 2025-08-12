'use client'
import { ChangeEvent, useRef, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation'
import { ArrowBigLeft } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
interface MissingPersonFormData {
  name: string;
  dob?: string;
  gender: string;
  missing_since: string;
  description: string;
  distinguishing_features: string;
  relationship: string;
  address: string;
  contact_info: string;
  status: 'finding' | 'found';
  images: File[]
}

const MissingPersonForm: NextPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<MissingPersonFormData>({
    name: '',
    gender: '',
    missing_since: '',
    description: '',
    distinguishing_features: '',
    relationship: '',
    address: '',
    contact_info: '',
    status: 'finding',
    images:[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };
   // Handle image selection
  // Adding new uploads
const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;
  const files = Array.from(e.target.files);  // File[]
console.log('FILES', files) 
  setFormData(prev => ({
    ...prev,
    images: [...prev.images, ...files],
  }));

  const newPreviews = files.map(f => URL.createObjectURL(f));
  setPreviewImages(prev => [...prev, ...newPreviews]);
};

// Removing an image by index
const removeImage = (index: number) => {
  setFormData(prev => {
    const imgs = [...prev.images];
    imgs.splice(index, 1);
    return { ...prev, images: imgs };
  });

  setPreviewImages(prev => {
    const pr = [...prev];
    pr.splice(index, 1);
    return pr;
  });
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 md:left-10 flex items-center text-gray-600 hover:text-indigo-700 transition-colors z-10"
      >
        <ArrowBigLeft />
        <Link href={'/'} className="font-medium">Back to Home</Link>
        
      </button>

      {/* Hero Section */}

      {/* Floating Form Container */}
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Form Header with Gradient */}
        <div className="bg-primary p-6 relative">
          <div className="absolute top-0 right-0 p-2 text-white/20 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Missing Person Report</h1>
          <p className="text-white mt-1">Complete all fields to help with the search</p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <div className="absolute right-3 top-9">
                <span className="text-xs text-red-500">*</span>
              </div>
            </div>

            {/* Gender Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-white"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unknown">Unknown</option>
              </select>
              <div className="absolute right-10 top-9 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* DOB Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <div className="relative">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Missing Since Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Missing Since *</label>
              <input
                type="date"
                name="missing_since"
                value={formData.missing_since}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Text Area Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Include details about last seen location, clothing, circumstances..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distinguishing Features</label>
            <textarea
              name="distinguishing_features"
              value={formData.distinguishing_features}
              onChange={handleChange}
              rows={3}
              placeholder="Scars, tattoos, birthmarks, disabilities, unique mannerisms..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Grid Section 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Relationship */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <input
                type="text"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                placeholder="Your relationship to missing person"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="At least province/state, more details preferable"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information *</label>
            <textarea
              name="contact_info"
              value={formData.contact_info}
              onChange={handleChange}
              required
              rows={2}
              placeholder="Phone number, email, social media where people can reach you"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photos (Multiple allowed)
            </label>
            
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
            
            {/* Custom upload area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">JPEG, PNG (Max 5MB each)</p>
              </div>
            </div>
          </div>
          {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Photos ({previewImages.length})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Upload preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-8">
            <button
              type="button"
              onClick={() => setFormData({
                name: '',
                gender: '',
                missing_since: '',
                description: '',
                distinguishing_features: '',
                relationship: '',
                address: '',
                contact_info: '',
                status: 'finding',
                images: []
              })}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
            >
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Submit Report
              </span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50/80 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            All information provided will be treated with confidentiality and used solely for reuniting missing persons with their loved ones.
          </p>
        </div>

      </div>
    </div>
    
  );
};

export default MissingPersonForm;

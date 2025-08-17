import { useCallback, useEffect, useRef, useState } from "react"
import SearchFiler from "./SearchFilter"
import ListPeople from "./ListPeople";
import Pagination from "./Pagination";
import { toast } from "sonner";
import Image from "next/image"
import { MissingPost } from "@/types/interface";
import { Input } from "./ui/input";
import { ImageUp } from "lucide-react";
import { calculateAgeGroup, calculateTimeMissing, debounce } from "@/lib/filter";
interface FormState {
  description: string;
  ageGroup: string;
  gender: string;
  timeMissing: string;
}

export const MainSearch = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<MissingPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<MissingPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formState, setFormState] = useState<FormState>({
    description: '',
    ageGroup: 'All Ages',
    gender: 'Any Gender',
    timeMissing: 'Any Time',
  });

  const itemsPerPage = 6;

  useEffect(() => {
    if (!uploadedFile) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(uploadedFile);
    setPreviewUrl(url);
    toast.success('Image uploaded successfully.');
    return () => URL.revokeObjectURL(url);
  }, [uploadedFile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/posts`);
        const data = await response.json();
        if (response.ok) {
          const mappedPosts: MissingPost[] = data.posts.map((post: any) => ({
            id_: post._id,
            name: post.name,
            description: post.description || "",
            missing_since: post.update_at || post.create_at,
            gender: post.gender,
            dob: post.dob,
            relationship: post.relationship || "",
            address: post.address || "",
            contact_infor: post.contact_infor || "",
            images: post.images || [],
          }));
          setPosts(mappedPosts);
          setFilteredPosts(mappedPosts);
        } else {
          console.error('API error:', data);
          toast.error('Error when loading data');
          setPosts([]);
          setFilteredPosts([]);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch posts');
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const displayedPosts = Array.isArray(filteredPosts)
    ? filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  const filterPosts = useCallback(
    debounce((postsToFilter: MissingPost[], form: FormState) => {
      if (!form.description && form.ageGroup === 'All Ages' && form.gender === 'Any Gender' && form.timeMissing === 'Any Time') {
        setFilteredPosts(postsToFilter);
        return;
      }

      const filtered = postsToFilter.filter((post) => {
        const descriptionMatch =
          !form.description || 
          post.description?.toLowerCase().includes(form.description.toLowerCase()) || 
          post.name.toLowerCase().includes(form.description.toLowerCase());
        
        const ageMatch = form.ageGroup === 'All Ages' || calculateAgeGroup(post.dob || '') === form.ageGroup;
        const genderMatch = form.gender === 'Any Gender' || post.gender.toLowerCase() === form.gender.toLowerCase();
        const timeMissingMatch = form.timeMissing === 'Any Time' || calculateTimeMissing(post.missing_since) === form.timeMissing;

        return descriptionMatch && ageMatch && genderMatch && timeMissingMatch;
      });

      setFilteredPosts(filtered);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let postsToFilter = posts;

    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/posts/search`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          const mappedPosts: MissingPost[] = data.posts.map((post: any) => ({
            id_: post._id,
            name: post.name,
            description: post.description || '',
            missing_since: post.update_at || post.create_at,
            gender: post.gender,
            dob: post.dob,
            relationship: post.relationship || '',
            address: post.address || '',
            contact_infor: post.contact_infor || '',
            images: post.images || [],
          }));
          postsToFilter = mappedPosts;
          toast.success('Image search completed successfully.');
        } else {
          console.error('API error:', data);
          toast.error('Image search failed. Please try again.');
          postsToFilter = [];
        }
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Failed to perform image search.');
        postsToFilter = [];
      }
    } else if (!formState.description && formState.ageGroup === 'All Ages' && formState.gender === 'Any Gender' && formState.timeMissing === 'Any Time') {
      toast.error('Please provide at least one search criterion or upload an image.');
      setIsLoading(false);
      return;
    }

    filterPosts(postsToFilter, formState);
    setIsLoading(false);
  };

  const clearImage = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="search-filter bg-white py-6 px-4 shadow-sm sticky top-10 z-40">
        <div className="container mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="basis-1/3 w-full space-y-4">
              <div className="block text-sm font-medium text-gray-700">Search by photo</div>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadedFile(e.target.files[0]);
                    }
                  }}
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center bg-primary px-4 py-2 hover:bg-gray-200 rounded-lg border cursor-pointer"
                >
                  <ImageUp className="mr-2" />
                  <span className="text-white font-medium">Choose Image</span>
                </label>
                {previewUrl && (
                  <div className="relative w-16 h-16">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded" />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <input
                type="text"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                placeholder="Or describe the person..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="basis-2/3 grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
              <select
                name="ageGroup"
                value={formState.ageGroup}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-indigo-500"
              >
                <option>All Ages</option>
                <option>Child (0-12)</option>
                <option>Teen (13-17)</option>
                <option>Adult (18+)</option>
              </select>
              <select
                name="gender"
                value={formState.gender}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-indigo-500"
              >
                <option>Any Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              <select
                name="timeMissing"
                value={formState.timeMissing}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-indigo-500"
              >
                <option>Any Time</option>
                <option>Less than 1 month</option>
                <option>1-6 months</option>
                <option>6 months-1year</option>
                <option>Greater than 1 year</option>
              </select>
              <button
                type="submit"
                className="bg-primary hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                <i className="fas fa-search mr-2"></i> Search
              </button>
            </div>
          </form>
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ListPeople ListPosts={displayedPosts} />
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};
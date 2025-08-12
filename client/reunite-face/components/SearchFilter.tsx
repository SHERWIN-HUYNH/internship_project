import { ImageUp } from "lucide-react";
import { Input } from "./ui/input"



const SearchFiler = ()=> {

    return (
    // SEARCH MISSING PEOPLE
    
    <div className="search-filter bg-white py-6 px-4 shadow-sm sticky top-16 z-40">
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search by photo</label>
                    <div className="flex items-center space-x-4">
                        <Input type="file" accept="image/*" className="hidden" id="image-upload"/>
                        <button
                            className="flex items-center space-x-2 bg-primary px-4 py-2 hover:bg-gray-200 text-gray-800 rounded-lg border">
                           <ImageUp className=" text-white text-md" /> <p className=" text-white text-md ">Upload Photo</p>
                        </button>
                        <div className="flex-1 relative">
                            <Input type="text" placeholder="Or describe the person..." 
                                className="w-full px-4 py-2 border rounded-r-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full md:w-auto">
                    <div>
                        <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-indigo-500">
                            <option>All Ages</option>
                            <option>Child (0-12)</option>
                            <option>Teen (13-17)</option>
                            <option>Adult (18+)</option>
                        </select>
                    </div>
                    <div>
                        <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-indigo-500">
                            <option>Any Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div>
                        <select className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-indigo-500">
                            <option>Less than 1 month</option>
                            <option>1-6 months</option>
                            <option>6 months-1year</option>
                            <option>Greater than 1 year</option>
                        </select>
                    </div>
                    <button className="bg-primary hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm">
                        <i className="fas fa-search mr-2"></i> Search
                    </button>
                </div>
            </div>
            
        </div>
    </div>
);
}

export default SearchFiler
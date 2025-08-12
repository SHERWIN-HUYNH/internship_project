import { MapPinHouse, Share2 } from "lucide-react";
import Image from "next/image";
type PersonCardType = {
  name: string;
  missing_since: string;
  age: number;
  gender: string;
  description: string;
  imageUrl: string;
  lastSeen: string;
  dateMissing: string;
};
const PersonCard = (personInfor: PersonCardType) => {
  return (
    <div className="person-card bg-white rounded-xl shadow-md overflow-hidden transition duration-300">
      <div className="relative h-48">
        <Image
          src="/assets/images/missing_people/person1.png"
          alt="Missing person: Sarah Johnson, 16-year-old female with brown hair, blue eyes, last seen wearing red t-shirt and jeans"
          width={600}
          height={400}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 bg-indigo-700 text-white px-3 py-1 text-sm font-medium">
          {personInfor.missing_since
            ? personInfor.missing_since
            : "Missing since: Jun 15, 2023"}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">
            {" "}
            {personInfor.name
              ? personInfor.name
              : "Sarah Johnson"}
          </h3>
          <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
            {" "}
            {personInfor.gender ? personInfor.gender : "Female, 16"}
          </span>
        </div>
        <p className="text-[#808080] mb-3 flex items-center space-x-2">
           <MapPinHouse className="mr-2 text-primary"/>
          {personInfor.lastSeen
            ? `Last seen: ${personInfor.lastSeen}`
            : "Last seen: Seattle, WA"}
        </p>
        <p className="text-[#808080] text-sm mb-4">
          {" "}
          {personInfor.description
            ? personInfor.description
            : "Last seen: Seattle, WASarah was last seen at Lincoln High School. She has brown hair, blue eyes, and a small mole on her right cheek."}
        </p>
        <div className="flex justify-between items-center">
          <button className="text-indigo-700 hover:text-white hover:bg-primary px-3 py-1 rounded-full font-medium text-sm">
            View Details <i className="fas fa-chevron-right ml-1"></i>
          </button>
          <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium flex" >
            <p>Share</p>  <Share2 className="ml-2 w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;

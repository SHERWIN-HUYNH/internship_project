import { MissingPost } from "@/types/interface";
import PersonCard from "./PersonCard";
import { useEffect } from "react";
interface ListPeopleProps {
  ListPosts: MissingPost[];
}
const ListPeople = ({ ListPosts }: ListPeopleProps) => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-12 sm:px-6 lg:px-8 lg:pt-16 ">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recent Missing Person Reports</h2>
            <div className="flex items-center space-x-2">
                <span className="text-gray-600">Sort by:</span>
                <select className="border-0 font-medium text-indigo-700 focus:ring-indigo-500">
                    <option>Most Recent</option>
                    <option>Time Missing</option>
                    <option>Alphabetical</option>
                </select>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  
          {ListPosts.length == 0 ? (
            <>
              <PersonCard
              name="Sarah Johnson"
              age={16}
              gender="Female"
              lastSeen="Seattle, WA"
              dateMissing="Jun 15, 2023"
              description="Sarah was last seen at Lincoln High School. She has brown hair, blue eyes, and a small mole on her right cheek."
              imageUrl="/assets/images/missing_people/person1.png"
              missing_since={"Missing since: Jun 15, 2023"} />
              <PersonCard
              name="Sarah Johnson"
              age={16}
              gender="Female"
              lastSeen="Seattle, WA"
              dateMissing="Jun 15, 2023"
              description="Sarah was last seen at Lincoln High School. She has brown hair, blue eyes, and a small mole on her right cheek."
              imageUrl="/assets/images/missing_people/person1.png"
              missing_since={"Missing since: Jun 15, 2023"} />
              <PersonCard
              name="Sarah Johnson"
              age={16}
              gender="Female"
              lastSeen="Seattle, WA"
              dateMissing="Jun 15, 2023"
              description="Sarah was last seen at Lincoln High School. She has brown hair, blue eyes, and a small mole on her right cheek."
              imageUrl="/assets/images/missing_people/person1.png"
              missing_since={"Missing since: Jun 15, 2023"} />
              <PersonCard
              name="Sarah Johnson"
              age={16}
              gender="Female"
              lastSeen="Seattle, WA"
              dateMissing="Jun 15, 2023"
              description="Sarah was last seen at Lincoln High School. She has brown hair, blue eyes, and a small mole on her right cheek."
              imageUrl="/assets/images/missing_people/person1.png"
              missing_since={"Missing since: Jun 15, 2023"} />
              <PersonCard
              name="Sarah Johnson"
              age={16}
              gender="Female"
              lastSeen="Seattle, WA"
              dateMissing="Jun 15, 2023"
              description="Sarah was last seen at Lincoln High School. She has brown hair, blue eyes, and a small mole on her right cheek."
              imageUrl="/assets/images/missing_people/person1.png"
              missing_since={"Missing since: Jun 15, 2023"} />
              <PersonCard
              name="Sarah Johnson"
              age={16}
              gender="Female"
              lastSeen="Seattle, WA"
              dateMissing="Jun 15, 2023"
              description="Sarah was last seen at Lincoln High School. She has brown hair, blue eyes, and a small mole on her right cheek."
              imageUrl="/assets/images/missing_people/person1.png"
              missing_since={"Missing since: Jun 15, 2023"} />
              </>
          ) :(
            ListPosts.map((post: MissingPost, index: number) => {
              const dobDate = new Date(post.dob || "");
              const age = Math.floor((Date.now() - dobDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
              const isUrlExpired = (url: string) => {
                const urlObj = new URL(url);
                const expires = urlObj.searchParams.get("Expires");
                if (!expires) return false;
                const expireTime = parseInt(expires) * 1000; // Convert to milliseconds
                return Date.now() > expireTime;
              };
              const imageUrl = post.images.length > 0
              ? `/api/image/${post.images.find(img => img.is_avatar)?.s3_key || post.images[0].s3_key}`
              : '/assets/images/missing_people/person1.png';
          
              

          return (
            <PersonCard
              key={post.id_ || index} 
              name={post.name}
              age={age}
              gender={post.gender}
              lastSeen={post.address || "Unknown"} 
              dateMissing={post.missing_since}
              description={post.description || "No description provided"}
              imageUrl={imageUrl} 
              missing_since={post.missing_since}
            />
          );
            }
          ))
          }
          
        </div>
        
    </div>
  );
};
export default ListPeople;

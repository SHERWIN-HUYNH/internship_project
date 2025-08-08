import { useEffect, useState } from "react"
import SearchFiler from "./SearchFilter"
import ListPeople from "./ListPeople";
import Pagination from "./Pagination";
import { toast } from "sonner";

const MainSearch = () => {
    const [peopleData, setPeopleData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://randomuser.me/api/?results=100');
            const data = await response.json();
            if(response.ok){
                setPeopleData(data);
            } else{
                toast.error("Error when loading data")
            }
        }

        fetchData();
    },[])

    const filteredPeople = () => {
        
    }
    return (
        <div>
            <SearchFiler />
            <ListPeople />
            <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        </div>
    )
}
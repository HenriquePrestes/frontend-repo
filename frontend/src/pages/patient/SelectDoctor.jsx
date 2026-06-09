import { useState } from "react";
import DoctorsFilter from "../../components/DoctorsFilter/DoctorsFilter";
import DoctorsGrid from "../../components/DoctorsGrid/DoctorsGrid";

export default function SelectDoctor() {
    const [filters, setFilters] = useState(null);

    const handleFilter = (newFilters) => {
        console.log("SelectDoctor: Aplicando filtros:", newFilters);
        setFilters(newFilters);
    };

    return(
        <div className="flex flex-col gap-10">
            <DoctorsFilter onFilter={handleFilter} />
            <DoctorsGrid filters={filters} />
        </div>
    )
}
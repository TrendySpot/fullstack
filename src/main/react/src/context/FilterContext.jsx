import { createContext, useContext, useState, useCallback } from "react";

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [spotType, setSpotType] = useState("");
  const [free, setFree] = useState(null);
  const [ongoing, setOngoing] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("createdAt,DESC");

  const resetFilters = () => {
    setArea("");
    setDate("");
    setSpotType("");
    setFree(null);
    setOngoing(null);
    setKeyword("");
    setSort("createdAt,DESC");
  };

  const setMainTagFilter = (tag) => {
    setArea("");
    setDate("");
    setKeyword("");
    setSort("createdAt,DESC");

    if (tag === "전체") {
      setSpotType("");
      setFree(null);
      setOngoing(null);
    } else if (tag === "팝업스토어") {
      setSpotType("POPUP");
      setFree(null);
      setOngoing(null);
    } else if (tag === "전시회") {
      setSpotType("EXHIBIT");
      setFree(null);
      setOngoing(null);
    } else if (tag === "무료") {
      setSpotType("");
      setFree(true);
      setOngoing(null);
    } else if (tag === "유료") {
      setSpotType("");
      setFree(false);
      setOngoing(null);
    } else if (tag === "진행중") {
      setSpotType("");
      setFree(null);
      setOngoing(true);
    } else if (tag === "오픈예정") {
      setSpotType("");
      setFree(null);
      setOngoing(false);
    }
  };

  const toQueryParams = useCallback(() => {
    const params = {};
    if (area) params.area = area;
    if (date) params.date = date;
    if (spotType) params.spotType = spotType;
    if (free !== null) params.free = free;
    if (ongoing !== null) params.ongoing = ongoing;
    if (keyword) params.keyword = keyword;
    if (sort) params.sort = sort;
    return params;
  }, [area, date, spotType, free, ongoing, keyword, sort]);

  return (
    <FilterContext.Provider
      value={{
        area,
        setArea,
        date,
        setDate,
        spotType,
        setSpotType,
        free,
        setFree,
        ongoing,
        setOngoing,
        keyword,
        setKeyword,
        sort,
        setSort,
        resetFilters,
        toQueryParams,
        setMainTagFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);

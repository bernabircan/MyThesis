import React, { useState } from "react";


export const SearchContext = React.createContext({
  query: "",
  searchHandler: () => {},
});

// Defining a simple HOC component
export const SearchContextProvider = (props) => {
  const [query, setQuery] = useState("");

  const searchHandler = (query) => {
    setQuery(query);
  };

  return (
    <SearchContext.Provider
      value={{ query: query, searchHandler: searchHandler }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};


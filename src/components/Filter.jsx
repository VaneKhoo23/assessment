import React, { useState, useCallback } from "react";
import "./Filter.css";

function Filter({cat, cats, fn, onNameChange}) {

  const [isOpen, setIsOpen] = useState(false);

//   const [cat, setCat] = useState(null);
  var category=cat;

  console.log(cats[0])
  return (
    <div>
    <div classname="select_filter">
        <select value={category} onChange={fn}>
          {cats.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
‍     </div>
    </div>
    
  );
}


export default Filter;
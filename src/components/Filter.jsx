import React, { useState, useCallback } from "react";
import "./Filter.css";

function Filter({cat, cats, fn, onNameChange}) {

  const [isOpen, setIsOpen] = useState(false);
  var category=cat;

  return (
    <div>
    <div className="select_filter">
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
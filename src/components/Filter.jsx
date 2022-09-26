import "./Filter.css";

function Filter({cat, cats, fn, onNameChange}) {

  var category=cat;

  // in the code below, it is such that for each category in the list of categories, it is map to an option to be
  // shown in the dropdown filter
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
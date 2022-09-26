import React, { useEffect, useState } from "react";
import Filter from '../components/Filter';
import ClipLoader from 'react-spinners/ClipLoader';
import ReactPaginate from 'react-paginate';
import 'purecss/build/pure.css';
import "./App.css";



function App() {

  // using useState hooks for state variables
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  // consts
  const usersPerPage = 5;
  const pagesVisited = pageNumber*usersPerPage;
  // set to get unique list of categories from api data
  const set = new Set();

  // using useEffect hook to manage the data retrieval to run and fetch data on the first render
  useEffect(() => {
    const controller = new AbortController(); // to abort fetch requests before it is completed
    fetch("/api/posts", { signal: controller.signal }) 
      .then((response => { // handling the response with .then
        if (!response.ok) { // if HTTP status is not "ok", throw error
          throw new Error(
            'This is an HTTP error: The status is ${response.status}'
          );
        }
        return response.json(); // convert Response onject to json format
      }))
      .then(json => { // get actual data from Promise
          setData(json);
          setLoading(false);
          set.add("All"); // add "All" as one of the 'categories' to be used for the filter

          if(data !== null) { 
            for (let i = 0; i < data.posts?.length; i++) {
              const post = data.posts[i];
              for (let j = 0; j < post.categories.length; j++) {
                set.add(post.categories[j].name); // add unique categories to the set
              }
            }
            setCats(Array.from(set)); // convert set to array to allow it to be used with mapping functions
        }
      })
      .catch(error => { // handle errors
        window.alert(error);
        setError(error);
        setLoading(false);
      });

  });

  // function to be passed to filter component
  const handleChange = event => {
      setCat(event.target.value);
      console.log(cat);
  }
  
  // data after filtering from the category filer dropdown
  const filterDropdown = 
      data?.posts?.filter(function(result) {
          for(let i=0; i < result.categories.length; i ++) {
            if (result.categories[i].name === cat) {
              return result.categories[i].name === cat
            }
          }
          if (cat==="All") {
            return true;
          }
          return false;
      });

  // data to be shown on a single page (pagination)
  const displayUsers = filterDropdown?.slice(pagesVisited, pagesVisited+usersPerPage);

  // pageCount for given data
  const pageCount = Math.ceil(filterDropdown?.length / usersPerPage);

  // to changepages
  const changePage = ({selected}) => {
    setPageNumber(selected);
  }; 

  // if page is loading, show a message/loader
  if (loading) {
    return (
      <main>
        <h1>A moment please... </h1>
        <ClipLoader color={'#fff'} size={150} />
      </main>
    );
  } 
  return ( // else load main content
    <main className="App">{/* Complete the exercise here. */}
      <section className="Posts">
      <header>Posts</header>
      
      <h5>Select a specific category!</h5>
      <Filter cat={cat} cats={cats} fn={handleChange} onNameChange={setCat}/>
      <br/>
      {loading && <ClipLoader color={'#fff'} size={150} />} 
      {error && ( 
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
      <ul>
        {data &&
        displayUsers?.map(({ id, title, author, publishDate, categories, summary }) => (
          <li key={id}>
            <article id="content">
              <section className="page">
                  <img src={author.avatar} className="icon" alt="" /> 
              </section>
              <section className="page">
                  <h4 id="author">By {author.name} </h4>
              </section>
              
              <h3> {title} </h3> 
              <h4>Published on {publishDate}. </h4>
              <section className="page">
                <section className = "pure-u-1-16">
                    <h4>Categories: </h4>
                </section>
                <section className = "pure-u-15-16" id="category">
                    <ul>
                      {categories && 
                        categories.map(({ id, name }) => (
                          <li key={id}>
                            <h5>{name}</h5>
                          </li>
                        ))}
                    </ul>
                </section>
              </section>
              <br/>
              <h4>Summary:</h4>
              <h4 className="summary">{summary}</h4>
            </article>
          </li>
        ))}
      </ul>
      </section>
    {/* Using react paginate library */}
    <section id="Pagination"> 
        <ReactPaginate 
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
      </section>
    </main>
  );
}

export default App;

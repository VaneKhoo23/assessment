// import Title from '../components/Title';
import Filter from '../components/Filter';
import 'purecss/build/pure.css';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import "./App.css";
import React, { useEffect, useState } from "react";


function App() {

  const [data, setData] = useState([]);
  const [isFetched,setIsFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const set = new Set();
  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 5;
  const pagesVisited = pageNumber*usersPerPage;

  
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/posts", { signal: controller.signal })
      .then((response => {
        if (!response.ok) {
          throw new Error(
            'This is an HTTP error: The status is ${response.status}'
          );
        }
        return response.json();
      }))
      .then(json => {
          setData(json);
          setLoading(false);
          // put into categories
          set.add("All");

          if(data !== null) {
            for (let i = 0; i < data.posts?.length; i++) {
              const post = data.posts[i];
              for (let j = 0; j < post.categories.length; j++) {
                set.add(post.categories[j].name);
              }
            }
            setCats(Array.from(set));
        }
      })
      .catch(error => {
        window.alert(error);
        setError(error);
        setLoading(false);
      });

  }, []);




  const handleChange = event => {
      setCat(event.target.value);
      console.log(cat);
  }
  

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

  const displayUsers = filterDropdown?.slice(pagesVisited, pagesVisited+usersPerPage);

 
  const pageCount = Math.ceil(filterDropdown?.length / usersPerPage);

  const changePage = ({selected}) => {
    setPageNumber(selected);
  }; 


  return ( 
    <main className="App">{/* Complete the exercise here. */}
      <section className="Posts">
      <header>Posts</header>
      {/* <Posts c={cat} c_list={cats} handleChange={handleChange} loading={loading}/> */}

      <Filter cat={cat} cats={cats} fn={handleChange} onNameChange={setCat}/>
      <br/>
      {loading && <div>A moment please...</div>}
      {/* {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )} */}
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

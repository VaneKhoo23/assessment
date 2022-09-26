// import Title from '../components/Title';
import Filter from '../components/Filter';
import 'purecss/build/pure.css';
import "./App.css";
import React, { useEffect, useState } from "react";


function App() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const set = new Set();
  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState('');


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
        console.log("WHy");
        set.add("All");
        for (let i = 0; i < data.posts.length; i++) {
          const post = data.posts[i];
          for (let j = 0; j < post.categories.length; j++) {
            set.add(post.categories[j].name);
          }
        }
        console.log("WHy");
        setCats(Array.from(set));
      })
      .catch(error => {
        window.alert(error);
        setError(error);
        setLoading(false);
      });
    return () => {
      controller.abort();
    };
  }, []);

  // User is currently on this page
  // const [currentPage, setCurrentPage] = useState(1);
  // // No of Records to be displayed on each page   
  // const [postsPerPage, setPostsPerPage] = useState(10);
  // const indexOfLastPost = currentPage*postsPerPage;
  // const indexOfFirstPost = indexOfLastPost-postsPerPage;
  // const currentPosts = data.posts.slice(indexOfFirstPost, indexOfLastPost);

  const handleChange = event => {
      setCat(event.target.value);
      console.log(cat);
  }

  const filterDropdown = data.posts.filter(function(result) {
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



  return ( 
    <div className="App">{/* Complete the exercise here. */}
      
      <h1>Posts</h1>

      <Filter cat={cat} cats={cats} fn={handleChange} onNameChange={setCat}/>

      {loading && <div>A moment please...</div>}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
      <ul>
        {data &&
        data.posts.map(({ id, title, author, publishDate, categories, summary }) => (
          <li key={id}>
            <div id="content">
              <div className="page">
                  <img src={author.avatar} className="icon" alt="" /> 
              </div>
              <div className="page">
                  <h4 id="author">By {author.name} </h4>
              </div>
                
              </div>
              <h3> {title} </h3> 
              <h4>Published on {publishDate}. </h4>
              <div className="page">
                <div className = "pure-u-1-16">
                    <h4>Categories: </h4>
                </div>
                <div className = "pure-u-15-16" id="category">
                    <ul>
                      {categories && 
                        categories.map(({ id, name }) => (
                          <li key={id}>
                            <h4>{name}</h4>
                          </li>
                        ))}
                    </ul>
                </div>
              </div>
              <br/>
              <h4>Summary:</h4>
              <h4 className="summary">{summary}</h4>
          </li>
        ))}
      </ul>















      
      {/* <nav>
        <ul className='pagination justify-content-center'>
            <li className="page-item">
              <a className="page-link"
                  onClick={prevPage}
                  href='#'>
                  Previous
              </a>
            </li>
            {pageNumbers.map(pgNumber => (
                <li key={pgNumber}
                  className={`page-item ${currentPage==pgNumber ? 'active': ''}`}>
                  
                  <a onClick={() => setCurrentPage(pgNumber)}
                    className='page-link'
                    href='#'>
                    {pgNumber}  
                  </a>
                </li>
            ))}
        </ul>
            </nav> */}
    </div>
  );
}

export default App;

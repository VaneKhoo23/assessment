// import Title from '../components/Title';
import 'purecss/build/pure.css';
import "./App.css";
import React, { useEffect, useState, useStateIfMounted } from "react";


function App() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categories = [];
  // const [value, setValue] = useState('checking value...');

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/posts", { signal: controller.signal })
      .then((response => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json()
      }))
      .then(json => {
        setData(json);
        setLoading(false);
        // put into categories
        for (let i = 0; i < data.posts.length; i++) {
          const post = data.posts[i];
          for (let j = 0; j < post.categories.length; j++){
              categories.push(post.categories[j]);
          }
        }
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

  return ( 
    <div className="App">{/* Complete the exercise here. */}
      
      <h1>Posts</h1>
      {/* <form onSubmit={handleSubmit}>
        <select value={categories} onChange={handleChange}>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

      </form> */}
      {loading && <div>A moment please...</div>}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
      <ul>
        {data &&
        data.posts.map(({ id, title, author, publishDate, categories, summary }) => (
          <li key={id}>
            <div id="content">
              <div class="page">
                  <img src={author.avatar} class="icon" alt="" /> 
              </div>
              <div class="page">
                  <h4 id="author">By {author.name} </h4>
              </div>
                
              </div>
              <h3> {title} </h3> 
              <h4>Published on {publishDate}. </h4>
              <div class="page">
                <div class = "pure-u-1-16">
                    <h4>Categories: </h4>
                </div>
                <div class = "pure-u-15-16" id="category">
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
              <h4 class="summary">{summary}</h4>
          </li>
        ))}
      </ul>
      

    </div>
  );
}

export default App;

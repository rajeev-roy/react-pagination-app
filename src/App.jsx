import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  let postPerPage = 7;
  let totalPages = totalPosts / postPerPage;
  let currentPageStartIndex = (currentPage - 1) * postPerPage;
  let currentPageEndIndex = currentPage * postPerPage + 1;

  const handlePageNoClick = (event) => {
    console.log(event.target.innerHTML);
    setCurrentPage(event.target.innerHTML);
  };

  let filteredPosts = posts.slice(currentPageStartIndex, currentPageEndIndex);

  useEffect(() => {
    if (fetchStatus) return;

    const controller = new AbortController();
    const signal = controller.signal;

    fetch("http://jsonplaceholder.typicode.com/posts", { signal })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setFetchStatus(true);
        setTotalPosts(data.length);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <div className="card-container">
        {filteredPosts &&
          filteredPosts.map((post) => {
            return (
              <div key={post.id} className="card text-bg-dark mb-3 card-item">
                <div className="card-header">{post.id}</div>
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.body}</p>
                </div>
              </div>
            );
          })}
      </div>
      <div className="pagination-content">
        <nav aria-label="...">
          <ul className="pagination pagination-lg">
            {Array.from({ length: totalPages }, (_, i) => {
              if (i > 0) {
                return (
                  <li
                    key={i}
                    className="page-item"
                    onClick={handlePageNoClick}
                  >
                    <a className="page-link">{i}</a>
                  </li>
                );
              }
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default App;

import React from "react";
import { useState } from "react";

function App() {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Tapahtuman aiheutti: ', event.target);
    console.log('Hakusana: ', query);
    searchMovies();
  };


  const handleClick = (event) => {
    event.preventDefault();
    console.log("Tapahtuman aiheutti: ", event.target);
    GetMovieData();
  };

  const searchMovies = () => {
    fetch(`http://localhost:5000/api/getall?title=${query}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Hakutulokset: ', data);
        setResults(data);
      });
  };

  const GetMovieData = () => {
    fetch("http://localhost:5000/api/getall")
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        console.log(data);
        const items = data;

        setResults(items)
      });
  };

  const handleDelete = (id) => {
    const updatedResults = results.filter((movie) => movie.id !== id);
    setResults(updatedResults);
  };

  const handleModify = (id) => {

    const movieToModify = results.find((movie) => movie.id === id);
    if (movieToModify) {
      // Kysy käyttäjältä uudet tiedot
      const newId = prompt('Enter the new ID:', movieToModify.id);
      const newTitle = prompt('Enter the new title:', movieToModify.Title);
      const newDirector = prompt(
        'Enter the new director name:',
        movieToModify.Director
      );

      // Luo uusi elokuva päivitetyillä tiedoilla
      const updatedMovie = {
        id: newId,
        Title: newTitle,
        Director: newDirector,
      };


      const movieIndex = results.findIndex((movie) => movie.id === id);

      // Luo uusi lista päivitetyillä tiedoilla
      const updatedResults = [
        ...results.slice(0, movieIndex),
        updatedMovie,
        ...results.slice(movieIndex + 1),
      ];

      // Päivitä lista uusilla tiedoilla
      setResults(updatedResults);
    }
  };

  const handleAdd = () => {
    // // Kysy käyttäjältä uudet tiedot elokuvalle
    const id = prompt('Enter the ID:');
    const title = prompt('Enter the title:');
    const director = prompt('Enter the director name:');

    // Luo uusi elokuva uusilla tiedoilla
    const newMovie = {
      id: id,
      Title: title,
      Director: director,
    };

    // Päivitä lista uusilla tiedoilla
    const updatedResults = [...results, newMovie];
    setResults(updatedResults);
  };

  

  const MovieArray = (props) => {
    const { data } = props;


    return (
      <div>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">ELOKUVAN NIMI</th>
              <th scope="col">OHJAAJA</th>
              <th scope="col">ENSI-ILTA</th>
              <th scope="col">MUOKKAUS</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td>{item.id}</td>
                <td>{item.Title}</td>
                <td>{item.Director}</td>
                <td>{item.release_date}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Poista
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleModify(item.id)}
                  >
                    Muokkaa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <h1>AC MOVIE HOUSE</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Hae Elokuvan perusteella:
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="form-control"
                placeholder="Syötä Elokuvan Nimi"
                name="query"
              />
            </label>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Hae
            </button>
            <button type="button" className="btn btn-success" onClick={handleClick}>
              Hae kaikki Elokuvat
            </button>
          </div>
        </form>
        <div>
          <MovieArray data={results} />
        </div>
        <div>
          <button className="btn btn-success" onClick={handleAdd}>
            Lisää Elokuva
          </button>
        </div>
      </div>
    </div>
  );
}


export default App;


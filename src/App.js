import React, { useState, useEffect } from "react"
import { FaSearch } from "react-icons/fa"
import Photo from "./Photo"
// key

const clientID = `?client_id=your key`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`
// secret
//LiV1tz09nOOsn0HUcenREZi1U-Kq3yvwvwkASw6QJBY

function App() {
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState("")

  const fetchImages = async () => {
    setLoading(true)
    let url
    const urlPage = `&page=${page}`
    const urlQuery = `&query=${query}`

    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
    } else {
      url = `${mainUrl}${clientID}${urlPage}`
    }

    try {
      const response = await fetch(url)
      const data = await response.json()
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results
        }
        if (query) {
          return [...oldPhotos, ...data.results]
        } else {
          return [...oldPhotos, ...data]
        }
      })
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    setPage(1)
  }
  useEffect(() => {
    fetchImages()
  }, [page])

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPage((oldPhotos) => {
          return oldPhotos + 1
        })
      }
    })
    return () => window.removeEventListener("scroll", event)
  }, [])
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="search"
            className="form-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo, index) => {
            return <Photo key={index} {...photo} />
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  )
}

export default App

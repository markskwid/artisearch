import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import Header from "./header";
import "../sass/styles.scss";
import { TfiSearch } from "react-icons/tfi";
import { MdArrowBack } from "react-icons/md";
import { ImSpotify, ImHeart } from "react-icons/im";
import {
  BsPersonCircle,
  BsHeartFill,
  BsPause,
  BsGlobe,
  BsBack,
  BsArrowReturnLeft,
  BsArrowBarLeft,
  BsCalendar2DateFill,
  BsVinylFill,
  BsArrowLeftCircleFill,
} from "react-icons/bs";
import { FaCopyright, FaCompactDisc } from "react-icons/fa";
import { SlSocialSpotify } from "react-icons/sl";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-js";

const MainContent = () => {
  const spotifyApi = new SpotifyWebApi();

  // variables
  const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
  ];

  const clientID = "c48f23b5284a4d628c5394119b721e6b";
  const uri = `https://markskwid.github.io/artisearch/`;
  const endpoint = "https://accounts.spotify.com/authorize";
  const response = "token";

  //states
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [information, setInformation] = useState([]);
  const [profile, setProfile] = useState([]);
  const [related, setRelated] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [search, setSearch] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [searchAlbum, setSearchAlbum] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState([]);

  //useeffects
  useEffect(() => {
    document.title = "Artisearch";
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if (hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];
      spotifyApi.setAccessToken(token);
      window.localStorage.setItem("token", token);
      var uri = window.location.toString();
      window.location.hash = "";
      if (uri.indexOf("#") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("#"));
        window.history.replaceState({}, document.title, clean_uri);
      }
    }

    setToken(token);
    spotifyApi.getMe().then((res) => {
      setProfile(res);
    });

    return () => {
      window.localStorage.removeItem("token");
      setToken("");
    };
  }, []);

  //functions

  const searchArtists = async (e) => {
    e.preventDefault();

    spotifyApi.searchArtists(searchKey).then(
      (data) => {
        setArtists(data.artists.items);
      },

      (err) => {
        console.log(err);
      }
    );
  };

  const getAlbumTracks = (album_id) => {
    spotifyApi.getAlbum(album_id).then(
      (data) => {
        //console.log(data);
        setSelectedAlbum(data);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const ArtistTopTracks = () => {
    //console.log(albums);
    return (
      <div className="gallery">
        <h2>Top Tracks</h2>
        <ul>
          {topTracks.map((e, index) => (
            <li key={e.id} className={"top-tracks"}>
              <img
                className="album-cover"
                src={topTracks[index].album.images[0].url}
                alt={e.name}
              />
              <p>{e.name}</p>
            </li>
          ))}
        </ul>

        <div className="artist-album-wrapper">
          <h2>Albums</h2>
          <ul className="album-wrapper">
            {albums
              .filter(
                ({ album_type, album_group, total_tracks }) =>
                  (album_group == "album" && album_type == "album") ||
                  (album_group == "single" &&
                    album_type == "single" &&
                    total_tracks > 2)
              )
              .map((e) => (
                <li key={e.id}>
                  <div
                    className="album-container"
                    onClick={() => {
                      getAlbumTracks(e.id);
                      setTimeout(() => setSearchAlbum(true), 2000);
                    }}
                  >
                    {e.images.length > 0 ? (
                      <>
                        <img src={e.images[0].url} />
                      </>
                    ) : (
                      <span>No album</span>
                    )}
                    <p>{e.name}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  };

  const DisplaySelectedAlbum = () => {
    //console.log("album", selectedAlbum);
    //console.log("tracks", selectedAlbum.tracks);

    return (
      <div className="album-view">
        <button className="close-album" onClick={() => setSearchAlbum(false)}>
          <BsArrowLeftCircleFill className="icon" />
        </button>
        <img
          src={selectedAlbum.images[0].url}
          className="album-cover-display"
        />
        <div className="album-info">
          <h2 className="album-title">{selectedAlbum.name}</h2>
          <p className="album-release-date">
            <BsCalendar2DateFill />
            {selectedAlbum.release_date}
          </p>

          <p className="album-release-date">
            <FaCompactDisc />
            {selectedAlbum.label}
          </p>

          <p className="album-release-date">
            <FaCopyright />
            {selectedAlbum.copyrights[0].text}
          </p>
        </div>
        <h3>Album Tracks</h3>
        <ol className="album-tracks" type="1">
          {selectedAlbum.tracks.items.map((e, index) => (
            <li key={e.id} className={"tracks"}>
              {index + 1 + "."} {e.name}
            </li>
          ))}
        </ol>
      </div>
    );
  };

  const DisplayArtist = () => {
    //console.log(information);
    //console.log(topTracks);

    return (
      <div className={`artist-wrapper`}>
        <div
          className="artist-cover"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(1, 1, 1, 0.20), rgba(1, 1, 1, 0.80)),
          url('${
            information.images.length ? information.images[0].url : null
          }')`,
          }}
        >
          <button
            className="btn-back"
            onClick={() => {
              setSearch(false);
              setSearchAlbum(false);
            }}
          >
            <MdArrowBack className={"icon"} />
          </button>
          <div className="info-container">
            <p className="artist-name">{information.name}</p>

            <p className="artist-info">
              <BsHeartFill className={"icon"} />
              {Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(information.followers.total)}
            </p>

            <p className="artist-info">
              <BsGlobe className={"icon"} />
              {information.popularity}
            </p>
          </div>
        </div>

        <div className="artist-body">
          {searchAlbum ? <DisplaySelectedAlbum /> : <ArtistTopTracks />}

          <div className="related-artist">
            <h2>Related Artists</h2>
            <div className="related-artist-container">
              {related.map((e) => (
                <div
                  className="related-wrapper"
                  key={e.id}
                  onClick={() => {
                    setInformation(e);
                    setSearch(true);
                    topTracksArtists(e.id);
                    relatedArtist(e.id);
                    getArtistAlbum(e.id);
                    setSearchAlbum(false);
                  }}
                >
                  {e.images.length ? (
                    <img src={`${e.images[0].url}`} />
                  ) : (
                    <BsPersonCircle className={"no-image"} />
                  )}
                  <p>{e.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const relatedArtist = (id) => {
    spotifyApi.getArtistRelatedArtists(id).then(
      (data) => {
        //console.log(data);
        setRelated(data.artists);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const getArtistAlbum = (id) => {
    spotifyApi.getArtistAlbums(id).then(
      (data) => {
        //console.log(data.items);
        setAlbums(data.items);
      },

      (err) => {
        console.log(err);
      }
    );
  };

  const topTracksArtists = (artist_id) => {
    spotifyApi.getArtistTopTracks(artist_id, "PH").then(
      (data) => {
        setTopTracks(data.tracks);
        //console.log(data.tracks[0].album);
      },

      (err) => {
        console.log(err);
      }
    );
  };

  const DisplaySearches = () => {
    return (
      <div className="search-wrapper">
        {artists.map((e) => (
          <div
            className={`artist-container`}
            key={e.id}
            onClick={() => {
              setInformation(e);
              setSearch(true);
              topTracksArtists(e.id);
              relatedArtist(e.id);
              getArtistAlbum(e.id);
            }}
          >
            {e.images.length ? (
              <img className="artist-profile" src={e.images[0].url} alt="" />
            ) : (
              <BsPersonCircle className={"no-image"} />
            )}
            <p className={"artist-name"}>{e.name}</p>
            <p className={"artist-followers"}>
              <BsHeartFill className={"heart-icon"} />
              {Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(e.followers.total)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const consoleTop = () => {
    topArtists.map((e) => console.log(e.name));
  };

  return (
    <>
      <header>
        <div className={"header-wrapper"}>
          <a className="web-title">
            Artise
            <span>
              <SlSocialSpotify />
            </span>
            rch
          </a>

          <ul>
            <li>
              <a href="#">
                {profile.display_name === undefined
                  ? null
                  : `
                Hello, ${profile.display_name}`}
              </a>
            </li>
          </ul>
        </div>
      </header>

      <main>
        <div className="main-wrapper">
          <h1>Get to know your favorite Spotify Artist</h1>
          <p className="page-description">
            Search your favorite artist and get to know more about them their
            total followers, genre, and their most streamed tracks. Login to
            know if you are following them.
          </p>

          {spotifyApi.getAccessToken() === null ? (
            <a
              className="auth-btn"
              href={`${endpoint}?client_id=${clientID}&redirect_uri=${uri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              <ImSpotify className="auth-icon-spotify" />
              Login to Spotify
            </a>
          ) : (
            <>
              <form onSubmit={searchArtists}>
                <div className="input-container">
                  <input
                    placeholder="Ex. The Band Camino"
                    onChange={(e) => setSearchKey(e.target.value)}
                  />

                  <button type={"submit"} className={"btn-search"}>
                    <TfiSearch />
                  </button>
                </div>
              </form>
            </>
          )}

          {search ? <DisplayArtist /> : <DisplaySearches />}
        </div>
      </main>
    </>
  );
};

export default MainContent;

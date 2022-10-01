import React, { useState, useEffect } from "react";
import useAuth from "../../scripts/useAuth";
import { CLIENT_ID } from "../../scripts/spotify";
import SpotifyWebApi from "spotify-web-api-node";
import "../../App.css";
import "./Dashboard.css";

import ProgressBar from "./ProgressBar/ProgressBar";

import { FastAverageColor } from "fast-average-color";

const spotifyApi = new SpotifyWebApi({ clientId: CLIENT_ID });

// helper to assist in printing timestamp
const stms = (seconds) => {
  const secondStamp = seconds % 60;
  return `${Math.floor(seconds / 60)}:${
    secondStamp >= 10 ? secondStamp : "0" + secondStamp
  }`;
};

// helper that grabs all the artists from the array
const grabArtists = (artistsData) => {
  let artists = "";
  artistsData.forEach((artist) => {
    artists = artists.concat(`${artist.name}, `);
  });

  artists = artists.substring(0, artists.length - 2);

  return artists;
};

const Dashboard = ({ code }) => {
  //   const [displayName, setDisplayName] = useState();
  const playingPollFreq = 1000;
  const pausedPollFreq = 3000;
  // const playSvgPoly = <polygon points="5 3 19 12 5 21 5 3"></polygon>
  // const pauseSVGPoly = <rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>}

  const playSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );
  const pauseSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  );
  const [buttonSvg, setButtonSvg] = useState(pauseSVG);

  const prevSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="19 20 9 12 19 4 19 20"></polygon>
      <line x1="5" y1="19" x2="5" y2="5"></line>
    </svg>
  );
  const nextSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="5 4 15 12 5 20 5 4"></polygon>
      <line x1="19" y1="5" x2="19" y2="19"></line>
    </svg>
  );

  // TODO:(rgrant) this will be the driver of EVERYTHING
  const [currTrackID, setCurrTrackID] = useState();

  const [topLeftInfo, setTopLeftInfo] = useState({
    upper: "upper!",
    lower: "lower",
  });

  // TODO:(rgrant) use this to dynamically change the frequency of polling
  const [isPlaying, setIsPlaying] = useState(false);
  const [pollFrequency, setPollFrequency] = useState(playingPollFreq);
  const [buttonText, setButtonText] = useState("___");

  // TODO:(rgrant) background color thingy
  const [complimentaryAlbumColor, setComplimentaryAlbumColor] =
    useState("#000025ff");

  // TODO:(rgrant) use this to not always poll album info, have a use-effect hook that watches 'track-title' or something like that
  const [currAlbum, setCurrAlbum] = useState();

  const baseState = {
    track_title: "track_title",
    artists: "artist_1, artist_2",
    album: "album_name",
    album_year: 1337,
    art_url: "https://picsum.photos/640",
    // playlist or album
    playing_from: "",
    is_playing: false,
    // TODO:(rgrant) get this with another call. What you can do is make this only go if something else changes
    //   info here is not tied up in the one call you make, so only re-check this if the 'track-title' or something changes, split that also into its own hook oops
    playing_from_name: "",
    // milliseconds for timestamp pos of song, and for how long song is
    track_pos: 69,
    track_len: 260,
  };

  const [curr, setCurr] = useState(baseState);
  const accessToken = useAuth(code);

  const fac = new FastAverageColor();

  const playPause = () => {
    if (isPlaying) {
      spotifyApi.pause().then(
        () => {
          setIsPlaying(false);
          setPollFrequency(pausedPollFreq);
          // setButtonText("Play");
          setButtonSvg(playSVG);
        },
        function (err) {
          console.log(`Something went wrong in pause/play: ${err}`);
        }
      );
    } else {
      // play the track
      spotifyApi.play().then(
        () => {
          setIsPlaying(true);
          setPollFrequency(playingPollFreq);
          // setButtonText("Pause");
          setButtonSvg(pauseSVG);
        },
        function (err) {
          console.log(`Something went wrong in pause/play: ${err}`);
        }
      );
    }
  };

  /**
   * Skips to next or previous track based on string. Also sets the polling rate
   *   and the
   * @param {string} direction either 'next' or 'prev'
   */
  const newTrack = (direction) => {
    if (direction === "next") {
      spotifyApi.skipToNext().then(
        () => {
          setPollFrequency(playingPollFreq);
          setButtonSvg(pauseSVG);
        },
        function (err) {
          console.log(`Something went wrong in skip to next: ${err}`);
        }
      );
    } else if (direction === "prev") {
      if (curr.track_pos <= 3) {
        spotifyApi.skipToPrevious().then(
          () => {
            setPollFrequency(playingPollFreq);
            setButtonSvg(pauseSVG);
          },
          function (err) {
            console.log(`Something went wrong in skip to prev: ${err}`);
          }
        );
      } else {
        spotifyApi.seek(0).then(
          () => {
            spotifyApi.play().then(
              () => {
                setPollFrequency(playingPollFreq);
                // setButtonText("Pause");
                setButtonSvg(pauseSVG);
              },
              function (err) {
                console.log(
                  `Something went wrong in play after skip to beginning: ${err}`
                );
              }
            );
          },
          function (err) {
            console.log(
              `Something went wrong in skip back to beginning: ${err} `
            );
          }
        );
      }
    } else {
      console.log(`Invalid string in newTrack: ${direction}`);
    }
  };

  //   use effect to check the polling and re-create timer
  useEffect(() => {
    if (!accessToken) return;
    isPlaying
      ? setPollFrequency(playingPollFreq)
      : setPollFrequency(pausedPollFreq);
  }, [isPlaying, accessToken]);

  // TODO:(rgrant)
  // useEffect that watches the track info, and only updates album info if track changes
  //   this should help by not re-rendering - actually not sure if this is relevant

  /**
   * TODO:(rgrant) DEFINITELY break this into helper
   *   this does two main things:
   *   every time you get a new track id:
   *     calculate the average color of the image and dim it a bit, to backgruond
   *   TODO:(rgrant) figure out a better way to check ID + context - maybe literally make a hook that's the combo of these two?
   *     the problem is, the ID can change but the context changes, in this case you want to update top-left info
   *     if the ID changes you ALWAYS want to update top left info
   *     AND update the album stuff
   */
  useEffect(() => {
    if (!accessToken) return;

    // stuff for calculating average color of image:
    fac
      .getColorAsync(document.querySelector("#spotify-album-art"))
      .then((color) => {
        console.log(color);
        // TODO:(rgrant) this is a real arbitrary amount of dimming
        setComplimentaryAlbumColor(`${color.hex}48`);
      });

    // stuff for calculating top-left info
    spotifyApi.getMyCurrentPlayingTrack().then(function (data) {
      // let leftInfo = "yeh";
      // let left
      // TODO:(rgrant) HERE if there is no context, disable the previous button?
      const playing_from = data.body.hasOwnProperty("context")
        ? data.body.context.type
        : null;
      console.log("playing_from is: ", playing_from);
      // TODO:(rgrant): move at least each of these individual things into helper functions
      //   define helper functions in a sub-directory here?
      // when context is album, say album(year) and track p of x
      if (playing_from === "album" || playing_from === null) {
        const albumName = data.body.item.album.name;
        const albumYear = data.body.item.album.release_date.substring(0, 4);
        const trackNum = data.body.item.track_number;
        const totalTracks = data.body.item.album.total_tracks;
        const upperInfo = `${albumName} ${" "}(${albumYear})`;
        const lowerInfo = `Track ${trackNum} of ${totalTracks}`;
        setTopLeftInfo({ upper: upperInfo, lower: lowerInfo });

        // when context is playlist, say name of playlist and who created it
      } else if (playing_from === "playlist") {
        const playlistURI = data.body.context.uri;
        const playlistId = playlistURI.split(":")[2];

        spotifyApi.getPlaylist(playlistId).then(function (data) {
          const playlistName = data.body.name;
          const playlistOwnerName = data.body.owner.display_name;
          setTopLeftInfo({ upper: playlistName, lower: playlistOwnerName });
        });

        // when context is artist say you're playing the artists top track
      } else if (playing_from === "artist") {
        const artistURI = data.body.context.uri;
        const artistId = artistURI.split(":")[2];
        spotifyApi.getArtist(artistId).then(function (data) {
          const artistName = data.body.name;
          setTopLeftInfo({
            upper: `${artistName}`,
            lower: `Artists' top tracks`,
          });
        });

        // output so its easy for dev or user to see context I need to add a case for
      } else {
        setTopLeftInfo({
          upper: `Screenshot me and bug report me!`,
          lower: `context is: ${playing_from}`,
        });
      }
    });
  }, [currTrackID]);

  useEffect(() => {
    if (!accessToken) {
      console.log("no access token yet!", !accessToken);
      return;
    }

    console.log("trying to set access token, does it not exist?", !accessToken);
    spotifyApi.setAccessToken(accessToken);

    const interval = setInterval(() => {
      // Get the User's Currently Playing Track and other info
      spotifyApi.getMyCurrentPlayingTrack().then(
        function (data) {
          const artists = grabArtists(data.body.item.artists);

          // TODO:(rgrant) break out into a helper to have this be REAL clean
          // take only info relevant to web app from the return payload
          const thenTrackInfo = {
            track_title: data.body.item.name,
            artists: artists,
            album: data.body.item.album.name,
            album_year: data.body.item.album.release_date.substring(0, 4),
            // playing_from: data.body.context.type,
            art_url: data.body.item.album.images[0].url,
            is_playing: data.body.is_playing,
            track_pos: Math.round(data.body.progress_ms / 1000, 2),
            track_len: Math.round(data.body.item.duration_ms / 1000, 2),
          };

          console.log("Now playing: ", data);
          console.log("sifted data", thenTrackInfo);

          // set the current internal Spotify song ID
          // to be used to check for: if the song ID ever changes - re:poll to check if its playing from an album or a playlist, and relevant info
          setCurrTrackID(data.body.item.id);

          setCurr(thenTrackInfo);
          setIsPlaying(thenTrackInfo.is_playing);
          thenTrackInfo.is_playing
            ? setButtonSvg(pauseSVG)
            : setButtonSvg(playSVG);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
    }, pollFrequency);
    return () => clearInterval(interval);
  }, [accessToken, pollFrequency]);

  return (
    <div
      className="dashboard-container"
      style={{ backgroundColor: complimentaryAlbumColor }}
    >
      <div className="left-column">
        <div className="context-info">
          <div className="sub-primary-text">{topLeftInfo.upper}</div>
          <div className="secondary-text">{topLeftInfo.lower}</div>
        </div>
      </div>

      <div className="center-column">
        <div className="essential-album-info">
          <div className="album-art">
            <img
              id="spotify-album-art"
              crossOrigin="anonymous"
              src={curr.art_url}
              alt={curr.album}
              width="520px"
              height="520px"
            />
          </div>

          <div className="album-text-info">
            <h2>{curr.track_title}</h2>
            <h5>{`${curr.artists}`}</h5>
          </div>
        </div>
        <div className="extraneous-info">
          <div onClick={() => newTrack("prev")}>{prevSVG} </div>
          <div onClick={() => playPause()}>{buttonSvg}</div>
          <div className="track-length-text">{`${stms(curr.track_pos)}`}</div>
          <ProgressBar
            percentDone={((curr.track_pos / curr.track_len) * 100).toFixed(3)}
          />
          <div className="track-length-text">{`${stms(curr.track_len)}`}</div>
          <div onClick={() => newTrack("next")}> {nextSVG}</div>
          {/* <div className="scrubber"> */}
            {/* <h5> */}
            {/* <div onClick={() => newTrack("prev")}>{prevSVG} </div> */}
            {/* <div onClick={() => playPause()}>{buttonSvg}</div> */}
            {/* <div>
              <ProgressBar
                percentDone={((curr.track_pos / curr.track_len) * 100).toFixed(
                  3
                )}
              />
            </div> */}
            {/* </h5> */}
            {/* <h5>
              <b onClick={() => newTrack("prev")}>{prevSVG} </b>
              <b onClick={() => playPause()}>{buttonSvg}</b>
              <b onClick={() => newTrack("next")}> {nextSVG}</b>
              {" | "}{" "}
              <>{`${stms(curr.track_pos)} of ${stms(curr.track_len)}`}</>
            </h5> */}
          {/* </div> */}
        </div>
      </div>

      <div
        className="right-column"
        // style={{ backgroundColor: complimentaryAlbumColor }}
      >
        {/* <div>Test</div> */}
      </div>
    </div>
  );
};

export default Dashboard;

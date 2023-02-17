import React, { useState, useEffect } from "react";
import "./ProgressBar.css";

const ProgressBar = ({ percentDone }) => {
    const [transitionTiming, setTransitionTiming] = useState("1")
  useEffect(() => {
    // TODO: (rgrant) there may be a less rudimentary way to do this. Also, currently
    //   if the user skips ahead on spotify, it will smooth scroll all the way to there.
    //   Spotify seems to nix the idea of smooth bar, it just inches up in digital
    //   increments. To think on.
    if (percentDone > 97) {
        setTransitionTiming(0) 
    } else {
        setTransitionTiming(1)
    }
    // if (!accessToken) return;
    // isPlaying
    //   ? setPollFrequency(playingPollFreq)
    //   : setPollFrequency(pausedPollFreq);
  }, [percentDone]);

  return (
    <span className="progress-bar-container">
      <div className="base-bar">
        <div className="progress-bar" style={{ "width": `${percentDone}%`, "transitionDuration": `${transitionTiming}s` }}>
        </div>
      </div>
    </span>
  );
};

export default ProgressBar;

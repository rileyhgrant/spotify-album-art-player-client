import React, { useState, useEffect } from "react";
import "./ProgressBar.css";

const ProgressBar = ({ percentDone }) => {
  
    const [transitionTiming, setTransitionTiming] = useState("1")
    // yeh
  useEffect(() => {
    // TODO:(rgrant) there may be a less rudimentary way to do this
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

  //   const { percentDone } = props;
  return (
    <span className="progress-bar-container">
      <div className="base-bar">
        <div className="progress-bar" style={{ "width": `${percentDone}%`, "transition-duration": `${transitionTiming}s` }}>
          {/* <span className="label">{`${percentDone}%`}</span> */}
          {/* <span className="label">{`${transitionTiming}s`}</span> */}
        </div>
      </div>
    </span>
  );
};

export default ProgressBar;

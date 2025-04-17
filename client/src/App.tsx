import React, { ChangeEvent, useEffect, useState } from 'react';
import navBarButtons from './assets/windows_navbar_buttons.svg';
import navBarMusicIcon from './assets/music_icon.svg';

import audioPlayerStop from './assets/stopButtonUpscaled.svg';
import audioPlayerPlay from './assets/playButtonUpscaled.svg';

import musicBarImage from './assets/musicBar.svg';

import quarterRestImage from './assets/musicNotes/quarterRest.svg';
import quarterNoteImage from './assets/musicNotes/quarterNote.svg';
import halfNoteImage from './assets/musicNotes/halfNote.svg';
import eigthNoteSingleImage from './assets/musicNotes/eigthNote.svg';
import eigthNoteDoubleImage from './assets/musicNotes/eigthNoteDouble.svg'

import eigthNoteSingleButtonImage from './assets/musicNoteIcons/eigthNoteSingleButton.svg'
import eigthNoteSingleButtonToggledImage from './assets/musicNoteIcons/eigthNoteSingleButtonToggled.svg'

import eigthNoteDoubleButtonImage from './assets/musicNoteIcons/eigthNoteDoubleButton.svg'
import eigthNoteDoubleToggledButtonImage from './assets/musicNoteIcons/eigthNoteDoubleButtonToggled.svg'

import quarterNoteButtonImage from './assets/musicNoteIcons/quarterNoteButton.svg'
import quarterNoteButtonToggledImage from './assets/musicNoteIcons/quarterNoteButtonToggled.svg'

import halfNoteButtonImage from './assets/musicNoteIcons/halfNoteButton.svg'
import halfNoteButtonToggledImage from './assets/musicNoteIcons/halfNoteButtonToggled.svg'

import playbackButtonImage from './assets/musicNoteIcons/playbackButton.svg'
import playbackButtonToggledImage from './assets/musicNoteIcons/playbackToggled.svg'

import trashCanButtonImage from './assets/musicNoteIcons/trashCanButton.svg'
import trashCanButtonToggledImage from './assets/musicNoteIcons/trashCanButtonToggled.svg'

import sendButtonImage from './assets/musicNoteIcons/sendButton.svg'
import sendButtonToggledImage from './assets/musicNoteIcons/sendButtonToggled.svg'

import emptyImage from './assets/emptyImage.svg';

import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import { saveAs } from "file-saver";

import './App.css';

function App() {
  const [rhythmLessonMap, setRhythmLessonMap] = useState(new Map());
  const [intervalLessonMap, setIntervalLessonMap] = useState(new Map());
  const [currentMap, setCurrentMap] = useState(new Map());
  const [selectionType, setSelectionType] = useState(0);
  const [LessonType, setLessonType] = useState("");
  const [AudioFile, setAudioFile] = useState("");
  const [audioPlayerImage, setAudioPlayerImage] = useState(audioPlayerStop);
  const [audioPlayer, setAudioPlayer] = useState(new Audio());
  const [lessonSelected, setLessonSelected] = useState("");
  const [rhythmConfig, setRhythmConfig] = useState([
    "qr", "qr", "qr", "qr",
    "qr", "qr", "qr", "qr",
    "qr", "qr", "qr", "qr",
    "qr", "qr", "qr", "qr"
  ]);
  const [noteSelected, setNoteSelected] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [verificationResponseText, setVerificationResponseText] = useState("");
  const [verificationResponse, setVerificationResponse] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transcriptResponse = await fetch('http://localhost:3000/transcript-lessons');
        const transcriptData = await transcriptResponse.json();

        const intervalResponse = await fetch('http://localhost:3000/interval-lessons');
        const intervalData = await intervalResponse.json();

        const transcriptMap = new Map(Object.entries(transcriptData));
        const intervalMap = new Map(Object.entries(intervalData));

        setRhythmLessonMap(transcriptMap);
        setIntervalLessonMap(intervalMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setIconStop();
    console.log(`UPDATING AUDIO PLAYER with request ${AudioFile}`);
    const fetchAudio = async () => {
      const response = await fetch(`http://localhost:3000/audiofiles?file=${AudioFile}`);
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.onended = () => setAudioPlayerImage(audioPlayerStop);
      setAudioPlayer(audio);
    };

    audioPlayer.pause();
    fetchAudio();
  }, [AudioFile]);

  useEffect(() => {
    setIconStop();
    if (selectionType === 1) {
      setCurrentMap(rhythmLessonMap);
      setLessonType("Rhythm Lessons");
    } else if (selectionType === 2) {
      setCurrentMap(intervalLessonMap);
      setLessonType("Interval Lessons");
    } else {
      setLessonType("");
    }
  }, [selectionType]);

  // function generateMidi(){
  //   const midi = new Midi();
  //   const track = midi.addTrack();

  //   let currentTime = 0;
  //   const notePitch = 60; // Middle C

  //   let rhythmString: string = "";
  //   for (let i: number = 0; i < rhythmConfig.length; i++) {
  //     let element: string = rhythmConfig[i];
  //     switch (element){
  //       case "qr": 
  //         rhythmString += ",,,,"
  //         break;
  //       case "er": 
  //         rhythmString += ",,"
  //         break
  //       case "q": 
  //         rhythmString += "q"
  //         break
  //       case "h": 
  //         rhythmString += "h"
  //         break;
  //       case "e":
  //         rhythmString += "e"
  //         break;
  //     }
  //   }

  //   for (let i = 0; i < rhythmString.length; i++) {
  //     const symbol = rhythmString[i];
      
  //     switch (symbol) {
  //       case ",":
  //         currentTime += 0.25; // 16th rest
  //         break;
  //       case "e":
  //         track.addNote({
  //           midi: notePitch,
  //           time: currentTime,
  //           duration: 0.5, // 1/2 beat (eighth note)
  //         });
  //         currentTime += 0.5;
  //         break;
  //       case "q":
  //         track.addNote({
  //           midi: notePitch,
  //           time: currentTime,
  //           duration: 1, // 1 beat
  //         });
  //         currentTime += 1;
  //         break;
  //       case "h":
  //         track.addNote({
  //           midi: notePitch,
  //           time: currentTime,
  //           duration: 2, // 2 beats
  //         });
  //         currentTime += 2;
  //         break;
  //       default:
  //         // Invalid character or whitespace, skip
  //         break;
  //     }
  //   }

  //   const bytes = midi.toArray();
  //   const blob = new Blob([new Uint8Array(bytes)], { type: "audio/midi" });
  //   saveAs(blob, "rhythm.mid");


  //   console.log("MIDI GENERATED...");
  //   playRhythm()
  // }

  

  async function playRhythm() {
    console.log("PLAYING RHYTHM");
  
    await Tone.start();
  
    const bpm = 90;
    const secondsPerBeat = 60 / bpm;
  
    const synth = new Tone.Synth().toDestination();
  
    // Click sound (basic short synth beep)
    const clickSynth = new Tone.MembraneSynth().toDestination();
  
    const now = Tone.now();
    let timeOffset = 0;
  
    for (const token of rhythmConfig) {
      const scheduledTime = now + timeOffset * secondsPerBeat;
  
      // Click every quarter note
      if (timeOffset % 1 === 0) {
        clickSynth.triggerAttackRelease("C2", "16n", scheduledTime);
      }
  
      switch (token) {
        case "q":
          synth.triggerAttackRelease("C4", secondsPerBeat, scheduledTime);
          timeOffset += 1;
          break;
        case "h":
          synth.triggerAttackRelease("C4", secondsPerBeat * 2, scheduledTime);
          timeOffset += 2;
          break;
        case "e":
        case "es":
          synth.triggerAttackRelease("C4", secondsPerBeat / 2, scheduledTime);
          timeOffset += 0.5;
          break;
        case "ed":
          synth.triggerAttackRelease("C4", secondsPerBeat / 2, scheduledTime);
          synth.triggerAttackRelease("C4", secondsPerBeat / 2, scheduledTime + secondsPerBeat / 2);
          timeOffset += 1;
          break;
        case "qr":
        case "":
          timeOffset += 1;
          break;
        default:
          timeOffset += 1;
          break;
      }
    }
  }
  
  function setIconStop() {
    setAudioPlayerImage(audioPlayerStop);
  }

  function getNoteByIndex(index: number) {
    switch (rhythmConfig[index]) {
      case "qr": return quarterRestImage;
      case "q": return quarterNoteImage;
      case "h": return halfNoteImage;
      case "es": return eigthNoteSingleImage;
      case "ed": return eigthNoteDoubleImage;
      case "": return emptyImage;
    }
  }

  function updateNoteByIndex(index: number) {
    const configCopy = [...rhythmConfig];

    if (noteSelected === "c") {
      if (configCopy[index] === "h" && index + 1 < configCopy.length) {
        configCopy[index + 1] = "qr";
      }
      configCopy[index] = "qr";
    }

    if (noteSelected === "q") {
      configCopy[index] = "q";
    }

    if (noteSelected === "ed") {
      configCopy[index] = "ed";
    }

    if (noteSelected === "es") {
      configCopy[index] = "es"
    }

    if (noteSelected === "h") {
      configCopy[index] = "h";
      configCopy[index + 1] = "";
    }

    setNoteSelected("");
    setRhythmConfig(configCopy);
  }

  function playAudio() {
    if (!audioPlaying) {
      setAudioPlaying(true);
      audioPlayer.currentTime = 0;
      audioPlayer.play();
    }
  }

  function stopAudio() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    setAudioPlaying(false);
  }

  async function verifyRhythm(): Promise<any>{
    var cleaned_submission = Object.assign([], rhythmConfig);

    let submission: string = "";
    for (let i: number = 0; i < cleaned_submission.length; i++) {
      let element: string = cleaned_submission[i];
      switch (element){
        case "qr": 
          submission += ",,,,"
          break;
        case "er": 
          submission += ",,"
          break
        case "q": 
          submission += "q"
          break
        case "h": 
          submission += "h"
          break;
        case "e":
          submission += "e"
          break;
      }
    }

    console.log(`submission scrubbed into proper format: ${submission}`);

    try {
      let lesson: string = lessonSelected;
      const params = new URLSearchParams({ submission, lesson});

      const submissionVerificationResponse = await fetch(`/verify?${params.toString()}`, {
        method: 'GET',
      });

      const data = await submissionVerificationResponse.json();

      console.log(`RESPONSE: ${data.message}`);

      setVerificationResponseText(data.message);
      setVerificationResponse(data.success);
    
    } catch (error){
      console.error("Error verifying lesson:", error);
      throw error;
    }
  }

  return (
    <>
      <div>
        <div className="outer-border">
          <div className="header">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <img
                src={navBarMusicIcon}
                style={{ objectFit: "contain", width: "10%" }}
                onClick={() => {
                  stopAudio;
                }}
              />
              <h4>Audio Transcription Tutor</h4>
            </div>
            <img src={navBarButtons} style={{ objectFit: "contain" }} />
          </div>
  
          <div className="sub-nav">
            <div
              className="sub-nav-item"
              style={{ display: "flex", flexDirection: "row" }}
              onClick={() => {
                setSelectionType(1);
                console.log("set selection type as 1");
              }}
            >
              <u>R</u>
              <p>hythm</p>
            </div>
            <div
              className="sub-nav-item"
              style={{ display: "flex", flexDirection: "row" }}
              onClick={() => {
                setSelectionType(2);
                console.log("set selection type as 2");
              }}
            >
              <u>I</u>
              <p>ntervals</p>
            </div>
          </div>
  
          <div style={{ display: "flex", flexDirection: "row", height: "80vh" }}>
            <div className="inner-border" style={{ width: "15%" }}>
              <h3 style={{ color: "black" }}>{LessonType}</h3>
              {[...currentMap.entries()].map(([key]) => (
                <div
                  className="menu-item"
                  style={{ display: "flex", flexDirection: "row" }}
                  onClick={() => {
                    setAudioFile(currentMap.get(key)["rhythm-wav-path"]);
                    setLessonSelected(key);
                  }}
                >
                  <u>{key[0]}</u>
                  <p>{key.substring(1)}</p>
                </div>
              ))}
            </div>
  
            <div style={{ padding: "20px" }} />
  
            {/* <div style={{display: "flex", flexDirection: "column", height:"100%"}}> */}
              <div className="inner-border" style={{ width: "85%", height: "40%" }}>
              {selectionType == 1 && AudioFile !== "" && (
                <div className="transcription-tool-bar" style={{ width: "99%", height: "35px" }}>
                  <div className="inner-border" style={{ width: "100%", height: "100%", padding: 0 }}>
                    <div className="outer-border" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: "4px" }}>
                      <img style={{ cursor: "pointer", height: "100%", maxHeight: "100%", objectFit: "contain" }} src={audioPlayerPlay} onClick={() => playAudio()} />
                      <img style={{ cursor: "pointer", height: "100%", maxHeight: "100%", objectFit: "contain" }} src={audioPlayerStop} onClick={() => stopAudio()} />
                      <div className="inner-border" style={{ padding: "0 10px", display: "flex", alignItems: "center", height: "100%" }}>
                        <p style={{ color: "black", margin: 0 }}>{lessonSelected}</p>
                      </div>
                      <img style={{ cursor: "pointer", height: "100%", objectFit: "contain" }} src={noteSelected === "es" ? eigthNoteSingleButtonToggledImage : eigthNoteSingleButtonImage} onClick={() => setNoteSelected(noteSelected === "es" ? "" : "es")} />
                      <img style={{ cursor: "pointer", height: "100%", objectFit: "contain" }} src={noteSelected === "ed" ? eigthNoteDoubleToggledButtonImage : eigthNoteDoubleButtonImage} onClick={() => setNoteSelected(noteSelected === "ed" ? "" : "ed")} />
                      <img style={{ cursor: "pointer", height: "100%", objectFit: "contain" }} src={noteSelected === "q" ? quarterNoteButtonToggledImage : quarterNoteButtonImage} onClick={() => setNoteSelected(noteSelected === "q" ? "" : "q")} />
                      <img style={{ cursor: "pointer", height: "100%", objectFit: "contain" }} src={noteSelected === "h" ? halfNoteButtonToggledImage : halfNoteButtonImage} onClick={() => setNoteSelected(noteSelected === "h" ? "" : "h")} />
                      <img style={{ cursor: "pointer", height: "100%", objectFit: "contain" }} src={noteSelected === "p" ? playbackButtonToggledImage : playbackButtonImage} onClick={() => {playRhythm()}} />
                      <img style={{ cursor: "pointer", height: "100%", objectFit: "contain" }} src={noteSelected === "c" ? trashCanButtonToggledImage : trashCanButtonImage} onClick={() => setNoteSelected(noteSelected === "c" ? "" : "c")} />
                      <img style={{ cursor: "pointer", height: "100%", objectFit: "contain" }} src={sendButtonImage} onClick={() => verifyRhythm()} />
                    </div>
                  </div>
                </div>
              )}
  
              {selectionType == 1 && AudioFile !== "" && (
                <div className="music-bar-container" style={{ position: "relative", width: "100%" }}>
                  <img
                    src={musicBarImage}
                    style={{ width: "100%", display: "block" }}
                    alt="Music Bar"
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "50%",
                      display: "flex",
                      transform: "translateY(50%)",
                      alignContent: "center",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      padding: "0 5px",
                      pointerEvents: "auto",
                    }}
                  >
                    {[...Array(16)].map((_, index) => (
                      <div
                        className="musicBarDiv"
                        key={index}
                        style={{
                          width: "6%",
                          height: "100%",
                        }}
                        onClick={() => updateNoteByIndex(index)}
                      >
                        <img
                          src={getNoteByIndex(index)}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>


          </div>
        </div>
      </div>
    </>
  );
};

export default App;

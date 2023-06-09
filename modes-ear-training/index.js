import {FretboardBuilder} from "https://kairuz.github.io/music-tools/fretboard/fretboard.js";
import WebAudioFontPlayer from "https://kairuz.github.io/webaudiofont/npm/dist/player.js";
import {LazyLoader} from "https://kairuz.github.io/modality/util.js";
import {SCALES, SCALE_NAMES, MODES_NAMES,
  SCALES_NAMES_MODES_NAMES} from "https://kairuz.github.io/modality/glossary.js";
import ScaleUi from "./scale-ui.js";


window.addEventListener('load', () => {

  const audioContext = new AudioContext();

  const webAudioFontPlayer = new WebAudioFontPlayer();

  const webAudioFontPresetPath = 'https://surikov.github.io/webaudiofontdata/sound/0253_Acoustic_Guitar_sf2_file.js';
  const webAudioFontPresetVarName = '_tone_0253_Acoustic_Guitar_sf2_file';

  const webAudioFontLoader = LazyLoader(() => {
    return new Promise((resolve) => {
      webAudioFontPlayer.loader.startLoad(audioContext, webAudioFontPresetPath, webAudioFontPresetVarName);
      webAudioFontPlayer.loader.waitLoad(() => {
        resolve();
      });
    });
  });

  const audioLoader = LazyLoader(() => {
    return new Promise((resolve, reject) => {
      // "suspended" | "running" | "closed";
      console.log('audioContext.state ' + audioContext.state);
      switch (audioContext.state) {
        case 'suspended': {
          audioContext
              .resume()
              .then(resolve);
          return;
        }
        case 'running': {
          resolve();
          return;
        }
        default: {
          reject('invalid audioContext state');
          return;
        }
      }
    }).then(() => webAudioFontLoader.get());
  });

  let expectedScaleNameIndex = null;
  let expectedScaleName = null;
  let expectedModeNameIndex = null;
  let expectedModeName = null;

  const playingNodes = (() => {
    let playingNodesSeq = 0;
    const playingNodesMap = new Map();
    return {
      add: (node) => {
        const playingNodeId = playingNodesSeq++;
        playingNodesMap.set(playingNodeId, node);
        node.addEventListener('ended', () => {
          playingNodesMap.delete(playingNodeId);

          if (playingNodesMap.size === 0) {
            stopButton.setAttribute('disabled', 'disabled');
            replayButton.removeAttribute('disabled');
            playingNodesSeq = 0;
          }
        });
      },
      stop: () => {
        playingNodesMap.forEach((playingNode) => playingNode.stop());
      }
    };
  })();

  const ask = () => {
    audioLoader.get().then(() => {

      scaleIndexIncludesForRound.clear();
      scaleIndexIncludes.forEach((scaleIndexInclude) => scaleIndexIncludesForRound.add(scaleIndexInclude));

      const scaleIndexIncludesArr = Array.from(scaleIndexIncludes.values());
      const scaleIndexExcludesArr = Array.from(SCALES.keys()).filter((i) => !scaleIndexIncludes.has(i));

      expectedScaleNameIndex = scaleIndexIncludesArr[Math.trunc(Math.random() * scaleIndexIncludesArr.length)];
      expectedScaleName = SCALE_NAMES[expectedScaleNameIndex];
      const expectedScaleModeNames = MODES_NAMES[expectedScaleNameIndex];
      expectedModeNameIndex = Math.trunc(Math.random() * expectedScaleModeNames.length);
      expectedModeName = expectedScaleModeNames[expectedModeNameIndex];
      console.log(`(CHEAT...) expected ${expectedScaleName} - ${expectedModeName}`);
      allModeAnswerButtons.forEach((modeAnswerButton) => modeAnswerButton.removeAttribute('disabled'));
      allModePlayButtons.forEach((modePlayButton) => modePlayButton.setAttribute('disabled', 'disabled'));

      scaleIndexIncludesArr
          .map((scaleIndexInclude) => scaleUis[scaleIndexInclude])
          .forEach((scaleUi) => scaleUi.getModeAnswerButtons().forEach((modeButton) => modeButton.removeAttribute('disabled')));
      scaleIndexExcludesArr
          .map((scaleIndexExclude) => scaleUis[scaleIndexExclude])
          .forEach((scaleUi) => scaleUi.getModeAnswerButtons().forEach((modeButton) => modeButton.setAttribute('disabled' , 'disabled')));

      const expectedScale = SCALES[expectedScaleNameIndex];
      fretboardDiv.classList.remove('visible');
      fretboardDiv.classList.add('hidden');
      const name = `C - ${expectedScaleName} - ${expectedModeName}`;
      const modeFlags = expectedScale.getModeFlags(expectedModeNameIndex);
      fretboard.selectMode(modeFlags, name);

      stop();
      playExpectedScaleMode();

      answerDiv.innerHTML = '&nbsp;';
      answerDiv.classList.remove('answer-incorrect');
      answerDiv.classList.remove('answer-correct');
    });
  };

  const stop = () => {
    playingNodes.stop();
  };

  const playExpectedScaleMode = () => {
    play(expectedScaleNameIndex, expectedModeNameIndex);
  };

  const play = (scaleNameIndex, modeNameIndex) => {
    const playOctave = (delayFactor, playOctaves, sustainFactor = delayFactor * 1.4, octave = 4) => {
      const scale = SCALES[scaleNameIndex];
      const flags = scale.getModeFlags(modeNameIndex);

      for (let i = 0; i <= flags.length * playOctaves; i++) {
        const flag = flags[i % flags.length];
        if (flag === 1) {

          const node = webAudioFontPlayer.queueWaveTable(
              audioContext, audioContext.destination, window[webAudioFontPresetVarName],
              audioContext.currentTime + delayAcc, (12 * octave) + i, sustainFactor);

          playingNodes.add(node.audioBufferSourceNode);

          nodePromises.push(new Promise((resolve) => {
            node.audioBufferSourceNode.addEventListener('ended', resolve);
          }));
          delayAcc += delayFactor;
        }
      }

      for (let i = (flags.length * playOctaves) - 1; i >= 0; i--) {
        const flag = flags[i % flags.length];
        if (flag === 1) {

          const node = webAudioFontPlayer.queueWaveTable(
              audioContext, audioContext.destination, window[webAudioFontPresetVarName],
              audioContext.currentTime + delayAcc, (12 * 4) + i, i === 0 ? sustainFactor * 1.6 : sustainFactor);

          playingNodes.add(node.audioBufferSourceNode);

          nodePromises.push(new Promise((resolve) => {
            node.audioBufferSourceNode.addEventListener('ended', resolve);
          }));
          delayAcc += delayFactor;
        }
      }
    };

    replayButton.setAttribute('disabled', 'disabled');
    stopButton.removeAttribute('disabled');

    const nodePromises = [];
    let delayAcc = 0;

    playOctave(0.4, 1);
    playOctave(0.25, 1);
    playOctave(0.18, 1);
    playOctave(0.4, 2);
    playOctave(0.25, 2);
    playOctave(0.18, 2);

    return Promise.all(nodePromises);
  };

  const askAnswerDiv = document.createElement('div');

  const answerDiv = document.createElement('div');
  answerDiv.setAttribute('id', 'answer');
  answerDiv.innerHTML = '&nbsp;';
  askAnswerDiv.appendChild(answerDiv);

  const askButton = document.createElement('button');
  askButton.setAttribute('id', 'ask-button');
  askButton.textContent = 'next';
  askAnswerDiv.appendChild(askButton);
  askButton.addEventListener('click', () => {
    if (scaleIndexIncludes.size > 0) {
      ask();
    }
  });

  const replayButton = document.createElement('button');
  replayButton.setAttribute('id', 'replay-button');
  replayButton.textContent = 'replay';
  askAnswerDiv.appendChild(replayButton);
  replayButton.setAttribute('disabled', 'disabled');
  replayButton.addEventListener('click', () => {
    replayButton.setAttribute('disabled', 'disabled');
    playExpectedScaleMode();
  });

  const stopButton = document.createElement('button');
  stopButton.setAttribute('id', 'stop-button');
  stopButton.textContent = 'stop';
  askAnswerDiv.appendChild(stopButton);
  stopButton.setAttribute('disabled', 'disabled');
  stopButton.addEventListener('click', () => {
    stop();
  });

  const appDiv = document.getElementById('app');

  appDiv.appendChild(askAnswerDiv);

  const answer = (scaleName, modeName) => {
    const correct = (scaleName === expectedScaleName && modeName === expectedModeName);

    answerDiv.innerHTML = `${expectedScaleName} - ${expectedModeName}`;

    if (correct) {
      answerDiv.classList.add('answer-correct');
    }
    else {
      answerDiv.classList.add('answer-incorrect');
    }

    fretboardDiv.classList.remove('hidden');
    fretboardDiv.classList.add('visible');

    allModeAnswerButtons.forEach((modeAnswerButton) => modeAnswerButton.setAttribute('disabled', 'disabled'));
    allModePlayButtons.forEach((modePlayButton) => modePlayButton.removeAttribute('disabled'));
    expectedScaleName = null;
    expectedModeName = null;
  };

  const scaleIndexIncludes = new Set();
  const scaleIndexIncludesForRound = new Set();

  const allModeAnswerButtons = [];
  const allModePlayButtons = [];

  let disabledIncludeCheckboxIndex = 0;

  const includeCallback = (scaleIndex) => {
    if (scaleIndexIncludes.size === 1 &&
        disabledIncludeCheckboxIndex !== null &&
        scaleUis[disabledIncludeCheckboxIndex].getIncludeCheckbox().checked === false) {
      scaleUis[disabledIncludeCheckboxIndex].getIncludeCheckbox().checked = true;
    }
    scaleIndexIncludes.add(scaleIndex);
    if (scaleIndexIncludes.size === 1) {
      return;
    }
    if (disabledIncludeCheckboxIndex !== null) {
      scaleUis[disabledIncludeCheckboxIndex].getIncludeCheckbox().disabled = false;
      disabledIncludeCheckboxIndex = null;
    }
  };

  const excludeCallback = (scaleIndex) => {
    if (scaleIndexIncludes.size === 1) {
      if (disabledIncludeCheckboxIndex !== null &&
          scaleUis[disabledIncludeCheckboxIndex].getIncludeCheckbox().checked === false) {
        scaleUis[disabledIncludeCheckboxIndex].getIncludeCheckbox().checked = true
      }
      return;
    }
    scaleIndexIncludes.delete(scaleIndex);
    if (scaleIndexIncludes.size === 1) {
      disabledIncludeCheckboxIndex = scaleIndexIncludes.values().next().value;
      scaleUis[disabledIncludeCheckboxIndex].getIncludeCheckbox().disabled = true;
    }
  };

  const scaleUis = SCALES_NAMES_MODES_NAMES.map(([scale, scaleName, modeNames], scaleIndex) => {
    return ScaleUi(scaleIndex, scale, scaleName, modeNames, scaleIndex === 0,
                   allModeAnswerButtons, allModePlayButtons, scaleIndexIncludes, scaleIndexIncludesForRound,
                   () => expectedScaleName, () => expectedModeName, answer, audioLoader, play, stop, includeCallback, excludeCallback);
  });

  scaleUis[0].getIncludeCheckbox().disabled = true;
  scaleUis.forEach((scaleUi) => appDiv.appendChild(scaleUi.getDiv()));

  appDiv.appendChild(document.createElement('br'));

  const fretboardDiv = document.createElement('div');
  fretboardDiv.classList.add('hidden');

  appDiv.appendChild(fretboardDiv);

  const labelledRadioFormDivWidth = 100;

  const fretboard = FretboardBuilder()
      .medium()
      .ofNoOfFrets(15)
      .build();
  fretboard.setHorizontal();

  fretboardDiv.style['width'] = `${fretboard.getFretboardParentDivSize() + labelledRadioFormDivWidth}px`;
  fretboardDiv.style['height'] = `${fretboard.getFretboardParentDivSize()}px`;

  const labelledRadiosDiv = document.createElement('div');
  labelledRadiosDiv.appendChild(fretboard.getHandednessLabelledForm().getLabel());
  labelledRadiosDiv.appendChild(document.createElement('br'));
  labelledRadiosDiv.appendChild(fretboard.getOrientationLabelledForm().getLabel());
  labelledRadiosDiv.appendChild(document.createElement('br'));
  labelledRadiosDiv.style['position'] = 'absolute';
  labelledRadiosDiv.style['margin'] = '10px';
  labelledRadiosDiv.style['width'] = `${labelledRadioFormDivWidth}px`;
  labelledRadiosDiv.style['height'] = `${labelledRadioFormDivWidth}px`;
  fretboardDiv.appendChild(labelledRadiosDiv);
  const fretboardContainerDiv = document.createElement('div');
  fretboardContainerDiv.style['position'] = 'absolute';
  fretboardContainerDiv.style['left'] = `${labelledRadioFormDivWidth}px`;
  fretboardContainerDiv.appendChild(fretboard.getFretboardParentDiv());
  fretboardDiv.appendChild(fretboardContainerDiv);

});

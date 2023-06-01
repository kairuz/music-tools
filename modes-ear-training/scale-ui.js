const ScaleUi = (scaleIndex, scale, scaleName, modeNames, include,
                 allModeAnswerButtons, allModePlayButtons,
                 scaleIndexIncludes, scaleIndexIncludesForRound,
                 getExpectedScaleName, getExpectedModeName, answer,
                 loadAudio, play, stop) => {
  const div = document.createElement('div');
  div.classList.add('scale');

  const scaleHeaderDiv = document.createElement('div');
  scaleHeaderDiv.classList.add('scale-name');
  scaleHeaderDiv.textContent = scaleName;

  const includeCheckbox = document.createElement('input');
  includeCheckbox.setAttribute('type', 'checkbox');

  scaleHeaderDiv.appendChild(includeCheckbox);
  if (include === true) {
    includeCheckbox.checked = include;
    scaleIndexIncludes.add(scaleIndex);
  }
  includeCheckbox.addEventListener('click', () => {
    if (includeCheckbox.checked) {
      scaleIndexIncludes.add(scaleIndex);
    }
    else {
      scaleIndexIncludes.delete(scaleIndex);
    }
  });

  div.appendChild(scaleHeaderDiv);

  const modesDiv = document.createElement('div');
  modesDiv.classList.add('modes');
  div.appendChild(modesDiv);

  const modeAnswerButtons = modeNames.map((modeName, i) => {
    const modeDiv = document.createElement('div');
    modeDiv.classList.add('mode');
    modesDiv.appendChild(modeDiv);
    const modeAnswerButton = document.createElement('button');
    modeAnswerButton.classList.add('mode-answer-button');
    modeAnswerButton.textContent = modeName;
    modeDiv.appendChild(modeAnswerButton);
    modeAnswerButton.addEventListener('click', () => {
      if (scaleIndexIncludesForRound.has(scaleIndex)) {
        if (getExpectedScaleName() !== null && getExpectedModeName() !== null) {
          answer(scaleName, modeName);
        }
      }
    });
    const modePlayButton = document.createElement('button');
    modePlayButton.classList.add('mode-play-button');

    modePlayButton.textContent = String.fromCodePoint(128266);
    modeDiv.appendChild(modePlayButton);
    modePlayButton.addEventListener('click', () => {
      loadAudio().then(() => {
        stop();
        play(scaleIndex, i);
      });
    });
    modeAnswerButton.setAttribute('disabled', 'disabled');

    allModeAnswerButtons.push(modeAnswerButton);
    allModePlayButtons.push(modePlayButton);

    return modeAnswerButton;
  });

  return {
    getDiv: () => div,
    getModeAnswerButtons: () => modeAnswerButtons
  }
};


export default ScaleUi;

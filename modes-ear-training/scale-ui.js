const ScaleUi = (scaleIndex, scale, scaleName, modeNames, include,
                 allModeAnswerButtons, allModePlayButtons,
                 scaleIndexIncludes, scaleIndexIncludesForRound,
                 getExpectedScaleName, getExpectedModeName, answer,
                 audioLoader, play, stop, includeCallback, excludeCallback) => {
  const div = document.createElement('div');
  div.classList.add('scale');

  const scaleHeaderDiv = document.createElement('div');

  const includeCheckbox = document.createElement('input');
  includeCheckbox.type = 'checkbox';
  const includeCheckboxId = `scaleToggleCheckbox_${scaleIndex}`;
  includeCheckbox.id = includeCheckboxId;
  includeCheckbox.classList.add('toggle');
  includeCheckbox.checked = include;

  const includeCheckboxLabel = document.createElement('label');
  includeCheckboxLabel.htmlFor = includeCheckboxId;
  includeCheckboxLabel.id = `${includeCheckboxId}_label`;
  includeCheckboxLabel.appendChild(document.createTextNode(scaleName));

  scaleHeaderDiv.appendChild(includeCheckbox);
  scaleHeaderDiv.appendChild(includeCheckboxLabel);
  if (include === true) {
    scaleIndexIncludes.add(scaleIndex);
  }
  includeCheckbox.addEventListener('click', () => {
    if (includeCheckbox.checked) {
      includeCallback(scaleIndex);
    }
    else {
      excludeCallback(scaleIndex);
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
      audioLoader.get().then(() => {
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
    getIncludeCheckbox: () => includeCheckbox,
    getModeAnswerButtons: () => modeAnswerButtons
  }
};


export default ScaleUi;

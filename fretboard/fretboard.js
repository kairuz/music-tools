import FretboardLayoutManager from './fretboard-layout-manager.js';
import {indexForKeyName} from "https://kairuz.github.io/modality/glossary.js"


// E4 B3 G3 D3 A2 E2
const STANDARD_TUNING = [[4, 'E'], [3, 'B'], [3, 'G'], [3, 'D'], [2, 'A'], [2, 'E']];

const DEFAULT_FRET_WIDTH            = 80;
const DEFAULT_FRET_BAR_WIDTH        = 4;
const DEFAULT_GUITARSTRING_SPACE    = 40;
const DEFAULT_NO_OF_FRETS           = 6;
const DEFAULT_MUTE_NOTE_DIV_SIZE    = 4;
const DEFAULT_NOTE_DIV_SIZE         = 30;
const DEFAULT_FRET_MARKER_DIV_SIZE  = 20;
const DEFAULT_NAME_FONT_SIZE        = 18;

const FRET_MARKERS = [0, 3, 5, 7, 9];


const LabelledRadiosClickCallbacks = (
    _clickRightHandedCallback = () => {},
    _clickLeftHandedCallback = () => {},
    _clickVerticalCallback = () => {},
    _clickHorizontalCallback = () => {},
) => {
  const clickRightHandedCallback = typeof _clickRightHandedCallback === 'function' ? _clickRightHandedCallback : () => {};
  const clickLeftHandedCallback = typeof _clickLeftHandedCallback === 'function' ? _clickLeftHandedCallback : () => {};
  const clickVerticalCallback = typeof _clickVerticalCallback === 'function' ? _clickVerticalCallback : () => {};
  const clickHorizontalCallback = typeof _clickHorizontalCallback === 'function' ? _clickHorizontalCallback : () => {};

  return {
    clickRightHandedCallback,
    clickLeftHandedCallback,
    clickVerticalCallback,
    clickHorizontalCallback,
  }
};

const DEFAULT_LABELLED_RADIO_CLICK_CALLBACKS = LabelledRadiosClickCallbacks();

const FretboardBuilder = () => {
  let guitarstrings                 = STANDARD_TUNING;
  let labelledRadiosClickCallbacks  = DEFAULT_LABELLED_RADIO_CLICK_CALLBACKS;
  let fretWidth                     = DEFAULT_FRET_WIDTH;
  let fretBarWidth                  = DEFAULT_FRET_BAR_WIDTH;
  let guitarstringSpace             = DEFAULT_GUITARSTRING_SPACE;
  let noOfFrets                     = DEFAULT_NO_OF_FRETS;
  let noteDivSize                   = DEFAULT_NOTE_DIV_SIZE;
  let fretMarkerDivSize             = DEFAULT_FRET_MARKER_DIV_SIZE;
  let muteNoteDivSize               = DEFAULT_MUTE_NOTE_DIV_SIZE;
  let scaleNameFontSize             = DEFAULT_NAME_FONT_SIZE;

  const resize = (factor) => {
    fretWidth         = DEFAULT_FRET_WIDTH * factor;
    fretBarWidth      = DEFAULT_FRET_BAR_WIDTH * factor;
    guitarstringSpace = DEFAULT_GUITARSTRING_SPACE * factor;
    noteDivSize       = DEFAULT_NOTE_DIV_SIZE * factor;
    fretMarkerDivSize = DEFAULT_FRET_MARKER_DIV_SIZE * factor;
    muteNoteDivSize   = DEFAULT_MUTE_NOTE_DIV_SIZE * factor;
    scaleNameFontSize = DEFAULT_NAME_FONT_SIZE * factor;
  };

  const thiz = {
    ofGuitarstrings: (_guitarstrings) => {guitarstrings = _guitarstrings; return thiz;},
    ofLabelledRadiosClickCallbacks: (_labelledRadiosClickCallbacks) => {labelledRadiosClickCallbacks = _labelledRadiosClickCallbacks; return thiz;},
    ofFretWidth: (_fretWidth) => {fretWidth = _fretWidth; return thiz;},
    ofFretBarWidth: (_fretBarWidth) => {fretBarWidth = _fretBarWidth; return thiz;},
    ofGuitarstringSpace: (_guitarstringSpace) => {guitarstringSpace = _guitarstringSpace; return thiz;},
    ofNoOfFrets: (_noOfFrets) => {noOfFrets = _noOfFrets; return thiz;},
    ofNoteDivSize: (_noteDivSize) => {noteDivSize = _noteDivSize; return thiz;},
    ofFretMarkerDivSize: (_fretMarkerDivSize) => {fretMarkerDivSize = _fretMarkerDivSize; return thiz;},
    ofMuteNoteDivSize: (_muteNoteDivSize) => {muteNoteDivSize = _muteNoteDivSize; return thiz;},
    ofScaleNameFontSize: (_scaleNameFontSize) => {scaleNameFontSize = _scaleNameFontSize; return thiz;},
    resize: (factor) => {resize(factor); return thiz;},
    small: () => {resize(0.5); return thiz;},
    medium: () => {resize(0.7); return thiz;},
    large: () => {resize(1); return thiz;},
    build: () => Fretboard(
        guitarstrings,
        labelledRadiosClickCallbacks,
        fretWidth,
        fretBarWidth,
        guitarstringSpace,
        noOfFrets,
        noteDivSize,
        fretMarkerDivSize,
        muteNoteDivSize,
        scaleNameFontSize
    )
  };

  return thiz;
};

const Fretboard = (
    _guitarstrings                = STANDARD_TUNING,
    _labelledRadiosClickCallbacks = DEFAULT_LABELLED_RADIO_CLICK_CALLBACKS,
    _fretWidth                    = DEFAULT_FRET_WIDTH,
    _fretBarWidth                 = DEFAULT_FRET_BAR_WIDTH,
    _guitarstringSpace            = DEFAULT_GUITARSTRING_SPACE,
    _noOfFrets                    = DEFAULT_NO_OF_FRETS,
    _noteDivSize                  = DEFAULT_NOTE_DIV_SIZE,
    _fretMarkerDivSize            = DEFAULT_FRET_MARKER_DIV_SIZE,
    _muteNoteDivSize              = DEFAULT_MUTE_NOTE_DIV_SIZE,
    _nameFontSize                 = DEFAULT_NAME_FONT_SIZE
) => {

  let isLeftHanded = false;
  let isHorizontal = false;

  const loadLayout = () => {
    if (isHorizontal) {
      if (isLeftHanded) {
        layoutManager.loadHorizontalLeftHanded();
      }
      else {
        layoutManager.loadHorizontalRightHanded();
      }
    }
    else {
      if (isLeftHanded) {
        layoutManager.loadVerticalLeftHanded();
      }
      else {
        layoutManager.loadVerticalRightHanded();
      }
    }
  };

  const setLayout = (_isHorizontal, _isLeftHanded) => {
    isHorizontal = _isHorizontal;
    isLeftHanded = _isLeftHanded;
    loadLayout();
  };

  const setRightHanded = () => {
    handednessLabelledForm.getLabelledRadios().getRight().check();
    setLayout(isHorizontal, false);
  };
  const setLeftHanded = () => {
    handednessLabelledForm.getLabelledRadios().getLeft().check();
    setLayout(isHorizontal, true);
  };
  const setVertical = () => {
    orientationLabelledForm.getLabelledRadios().getVertical().check();
    setLayout(false, isLeftHanded);
  };
  const setHorizontal = () => {
    orientationLabelledForm.getLabelledRadios().getHorizontal().check();
    setLayout(true, isLeftHanded);
  };

  const [
    handednessLabelledForm,
    orientationLabelledForm
  ] = (() => {
    const buildLabelledRadio = (labelText, groupName, isChecked, onClickCallback) => {
      const label = document.createElement('label');
      label.style['display'] = 'block';
      label.style['font-size'] = '8px';
      label.style['font-weight'] = 'normal';
      label.textContent = labelText;
      const radio = document.createElement('input');
      radio.setAttribute('type', 'radio');
      if (isChecked) {
        radio.setAttribute('checked', 'checked');
      }
      radio.setAttribute('name', groupName);
      radio.addEventListener('click', onClickCallback);
      label.appendChild(radio);

      return {
        getLabel: () => label,
        getRadio: () => radio,
        check: () => radio['checked'] = true
      };
    };

    const buildLabelledForm = (labelText, labelledRadios) => {
      const form = document.createElement('form');
      labelledRadios.getRadios().forEach((labelledRadio) => form.appendChild(labelledRadio.getLabel()));
      const label = document.createElement('label');
      label.style['font-size'] = '10px';
      label.style['font-weight'] = 'bold';
      label.textContent = labelText;
      label.appendChild(form);

      return {
        getLabel: () => label,
        getLabelledRadios: () => labelledRadios,
        getForm: () => form
      };
    };

    const clickRightHanded = () => {
      setRightHanded();
      labelledRadiosClickCallbacks.clickRightHandedCallback();
    };

    const clickLeftHanded = () => {
      setLeftHanded();
      labelledRadiosClickCallbacks.clickLeftHandedCallback();
    };

    const clickVertical = () => {
      setVertical();
      labelledRadiosClickCallbacks.clickVerticalCallback();
    };

    const clickHorizontal = () => {
      setHorizontal();
      labelledRadiosClickCallbacks.clickHorizontalCallback();
    };

    const handednessLabelledRadios = (() => {
      const right = buildLabelledRadio('right', 'handednessRadiogroup', true, clickRightHanded);
      const left = buildLabelledRadio('left', 'handednessRadiogroup', false, clickLeftHanded);

      return {
        getRight: () => right,
        getLeft: () => left,
        getRadios: () => [right, left]
      };
    })();

    const orientationLabelledRadios = (() => {
      const vertical = buildLabelledRadio('vertical', 'orientationRadiogroup', true, clickVertical);
      const horizontal = buildLabelledRadio('horizontal', 'orientationRadiogroup', false, clickHorizontal);

      return {
        getVertical: () => vertical,
        getHorizontal: () => horizontal,
        getRadios: () => [vertical, horizontal]
      };
    })();

    return [
      buildLabelledForm('handedness', handednessLabelledRadios),
      buildLabelledForm('orientation', orientationLabelledRadios)
    ];
  })();

  const guitarstrings = _guitarstrings;
  const labelledRadiosClickCallbacks = _labelledRadiosClickCallbacks;
  const fretWidth = _fretWidth;
  const fretBarWidth = _fretBarWidth;
  const guitarstringSpace = _guitarstringSpace;
  const noOfFrets = _noOfFrets;
  const noteDivSize = _noteDivSize;
  const fretMarkerDivSize = _fretMarkerDivSize;
  const muteNoteDivSize = _muteNoteDivSize;
  const nameFontSize = _nameFontSize;
  const fretBarDivs = [];
  const fretMarkerDivs = [];
  const guitarstringDivs = [];
  const noteDivs = [];
  const muteDivPairs = [];
  const fretboardDiv = document.createElement('div');
  const fretboardDivSize = fretBarWidth + (fretWidth * (noOfFrets - 1));
  const fretboardAndBorderDiv = document.createElement('div');
  const fretboardParentDiv = document.createElement('div');
  const fretboardBorderSize = (noteDivSize + muteNoteDivSize);
  const fretboardParentDivSize = fretboardDivSize + (fretboardBorderSize * 2);
  const nameDiv = document.createElement('div');
  const neckWidth = guitarstringSpace * guitarstrings.length;
  const neckLength = (fretWidth * (noOfFrets - 1)) + noteDivSize;
  const nameDivSize = fretboardParentDivSize - neckWidth - (fretboardBorderSize * 2);

  const layoutManager = FretboardLayoutManager(fretBarDivs, fretMarkerDivs, FRET_MARKERS, guitarstringDivs, noteDivs, nameDiv, muteDivPairs, fretboardDiv, guitarstrings,
      fretWidth, fretBarWidth, guitarstringSpace, noOfFrets, noteDivSize, fretMarkerDivSize, muteNoteDivSize, neckWidth, fretboardBorderSize, nameDivSize);

  fretboardParentDiv.setAttribute('class', 'fretboardParent');
  fretboardParentDiv.style['box-sizing'] = 'border-box';
  fretboardParentDiv.style['width'] = `${fretboardParentDivSize}px`;
  fretboardParentDiv.style['height'] = `${fretboardParentDivSize}px`;
  fretboardParentDiv.appendChild(fretboardAndBorderDiv);
  fretboardParentDiv.appendChild(nameDiv);

  fretboardAndBorderDiv.setAttribute('class', 'fretboardAndBorder');
  fretboardAndBorderDiv.style['position'] = 'absolute';
  fretboardAndBorderDiv.style['width'] = `${fretboardParentDivSize - fretboardBorderSize}px`;
  fretboardAndBorderDiv.style['height'] = `${fretboardParentDivSize - fretboardBorderSize}px`;
  fretboardAndBorderDiv.style['top'] = `${fretboardBorderSize}px`;
  fretboardAndBorderDiv.style['left'] = `${fretboardBorderSize}px`;
  fretboardAndBorderDiv.appendChild(fretboardDiv);

  fretboardDiv.setAttribute('class', 'fretboard');
  fretboardDiv.style['position'] = 'absolute';
  fretboardDiv.style['outline'] = '1px solid LightGrey';

  nameDiv.setAttribute('class', 'name');
  nameDiv.style['position'] = 'absolute';
  nameDiv.style['width'] = `${nameDivSize}px`;
  nameDiv.style['height'] = `${nameDivSize}px`;
  nameDiv.style['color'] = 'black';
  nameDiv.style['font-size'] = `${nameFontSize}px`;
  nameDiv.style['font-weight'] = 'bold';
  nameDiv.style['word-break'] = 'break-word';

  for (let i = 0; i < noOfFrets; i++) {
    const fretBarDiv = document.createElement('div');
    fretBarDiv.setAttribute('class', 'fretBar');
    fretBarDiv.style['position'] = 'absolute';
    fretBarDiv.style['background'] = 'LightGrey';
    fretBarDiv.style['outline'] = '1px solid Silver';
    fretboardDiv.appendChild(fretBarDiv);
    fretBarDivs.push(fretBarDiv);

    if (i !== 0 && FRET_MARKERS.includes(i % 12)) {
      if (i % 12 === 0) {
        const fretMarkerDivTop = document.createElement('div');
        fretMarkerDivTop.classList.add('fretMarker', 'fretMarkerTop');
        fretMarkerDivTop.style['position'] = 'absolute';
        fretMarkerDivTop.style['border-radius'] = '50%';
        fretMarkerDivTop.style['width'] = `${fretMarkerDivSize}px`;
        fretMarkerDivTop.style['height'] = `${fretMarkerDivSize}px`;
        fretMarkerDivTop.style['background'] = 'LightGrey';
        fretMarkerDivTop.style['outline'] = '1px solid Silver';
        fretboardDiv.appendChild(fretMarkerDivTop);

        const fretMarkerDivBottom = document.createElement('div');
        fretMarkerDivBottom.classList.add('fretMarker', 'fretMarkerBottom');
        fretMarkerDivBottom.style['position'] = 'absolute';
        fretMarkerDivBottom.style['border-radius'] = '50%';
        fretMarkerDivBottom.style['width'] = `${fretMarkerDivSize}px`;
        fretMarkerDivBottom.style['height'] = `${fretMarkerDivSize}px`;
        fretMarkerDivBottom.style['background'] = 'LightGrey';
        fretMarkerDivBottom.style['outline'] = '1px solid Silver';
        fretboardDiv.appendChild(fretMarkerDivBottom);

        fretMarkerDivs.push([fretMarkerDivTop, fretMarkerDivBottom]);
      }
      else {
        const fretMarkerDiv = document.createElement('div');
        fretMarkerDiv.classList.add('fretMarker', 'fretMarkerMid');
        fretMarkerDiv.style['position'] = 'absolute';
        fretMarkerDiv.style['border-radius'] = '50%';
        fretMarkerDiv.style['width'] = `${fretMarkerDivSize}px`;
        fretMarkerDiv.style['height'] = `${fretMarkerDivSize}px`;
        fretMarkerDiv.style['background'] = 'LightGrey';
        fretMarkerDiv.style['outline'] = '1px solid Silver';
        fretboardDiv.appendChild(fretMarkerDiv);
        fretMarkerDivs.push(fretMarkerDiv);
      }
    }
  }

  for (let i = 0; i < guitarstrings.length; i++) {
    const colors = ['LightGrey', 'DarkKhaki'];

    const guitarstringDiv = document.createElement('div');
    guitarstringDiv.setAttribute('class', 'guitar-string');
    guitarstringDiv.style['position'] = 'absolute';
    guitarstringDiv.style['outline'] = '1px solid black';
    guitarstringDiv.style['background'] = (i > 1) ? colors[1] : colors[0];

    fretboardDiv.appendChild(guitarstringDiv);
    guitarstringDivs.push(guitarstringDiv);

    noteDivs[i] = [];

    for (let j = 0; j < noOfFrets; j++) {
      const noteDiv = document.createElement('div');
      noteDiv.setAttribute('class', 'note');
      noteDiv.style['position'] = 'absolute';
      noteDiv.style['border-radius'] = '50%';
      noteDiv.style['width'] = `${noteDivSize}px`;
      noteDiv.style['height'] = `${noteDivSize}px`;
      noteDiv.style['background'] = 'transparent';
      noteDiv.style['text-align'] = 'center';
      if (j !== 0) {
        noteDiv.style['color'] = 'white';
      }
      else {
        noteDiv.style['color'] = 'black';
      }

      fretboardDiv.appendChild(noteDiv);
      noteDivs[i][j] = noteDiv;

      if (j === 0) {
        // muted string Xs
        const muteDivA = document.createElement('div');
        muteDivA.setAttribute('class', 'muteNoteA');
        muteDivA.style['position'] = 'absolute';
        muteDivA.style['width'] = `${muteNoteDivSize}px`;
        muteDivA.style['height'] = `${noteDivSize}px`;
        muteDivA.style['transform'] = 'rotate(45deg)';
        fretboardDiv.appendChild(muteDivA);

        const muteDivB = document.createElement('div');
        muteDivB.setAttribute('class', 'muteNoteB');
        muteDivB.style['position'] = 'absolute';
        muteDivB.style['width'] = `${muteNoteDivSize}px`;
        muteDivB.style['height'] = `${noteDivSize}px`;
        muteDivB.style['transform'] = 'rotate(315deg)';
        fretboardDiv.appendChild(muteDivB);

        muteDivPairs[i] = [muteDivA, muteDivB];
      }
    }
  }

  let selectedModeFlagsAndName = null;
  let selectedChordAndName = null;

  const applyMode = (modeFlags, name, noteDivCallback) => {
    nameDiv.innerHTML = `${name}`;
    guitarstrings.forEach(([_, guitarstringNote], guitarstringIndex) => {
      const guitarstringNoteIndex = indexForKeyName(guitarstringNote);
      let degree = (() => {
        let c = 0;
        for (let i = 0; i < guitarstringNoteIndex; i++) {
          if (modeFlags[i]) {
            c++;
          }
        }
        return c;
      })();

      for (let i = 0; i < noOfFrets; i++) {
        if ((modeFlags[(guitarstringNoteIndex + i) % modeFlags.length]) === 1) {
          degree = (degree % 7) + 1; // todo 7
          noteDivCallback(degree, i, guitarstringIndex);
        }
      }
    });
  };

  const unapplySelectedMode = () => {
    const [selectedModeFlags, selectedName] = selectedModeFlagsAndName;
    applyMode(selectedModeFlags, selectedName, (degree, fret, guitarstringIndex) => {
      if (fret === 0) {
        noteDivs[guitarstringIndex][fret].style['border'] = null;
      }
      else {
        noteDivs[guitarstringIndex][fret].style['background'] = 'transparent';
      }
      noteDivs[guitarstringIndex][fret].textContent = '';
    });
  };

  const applySelectedMode = () => {
    const [selectedModeFlags, selectedName] = selectedModeFlagsAndName;
    applyMode(selectedModeFlags, selectedName, (degree, fret, guitarstringIndex) => {
      if (fret === 0) {
        noteDivs[guitarstringIndex][fret].style['border'] = `${muteNoteDivSize}px solid black`;
      }
      else {
        noteDivs[guitarstringIndex][fret].style['background'] = 'black';
      }
      noteDivs[guitarstringIndex][fret].textContent = `${degree}`;
    });
  };

  const applyChord = (chord, name, noteDivCallback, openNoteDivCallback, muteNoteDivCallback) => {
    nameDiv.innerHTML = `${name}`;

    const guitarstringFretIndexesEntries = Object.entries(chord);

    const stringFretIndexesKeys = guitarstringFretIndexesEntries.map((guitarstringFretIndexesEntry) => guitarstringFretIndexesEntry[0]);
    const guitarstringsKeys = Object.keys(guitarstrings);

    const openGuitarstringIndexes = guitarstringFretIndexesEntries
        .filter((stringFretIndexesEntry) => stringFretIndexesEntry[1] === 0)
        .map((stringFretIndexesEntry) => stringFretIndexesEntry[0]);
    const mutedGuitarstringIndexes = guitarstringsKeys
        .filter((guitarstringKey) => !stringFretIndexesKeys.includes(guitarstringKey));

    mutedGuitarstringIndexes.forEach((mutedGuitarstringIndex) => muteDivPairs[mutedGuitarstringIndex].forEach(muteNoteDivCallback));
    openGuitarstringIndexes.forEach((openGuitarstringIndex) => openNoteDivCallback(noteDivs[openGuitarstringIndex][0]));

    guitarstringFretIndexesEntries.forEach((guitarstringFretIndexesEntry) => {
      const guitarstringIndex = guitarstringFretIndexesEntry[0];
      const fretInd = guitarstringFretIndexesEntry[1];
      if (fretInd === 0) {
        return;
      }
      const noteDiv = noteDivs[guitarstringIndex][fretInd];
      noteDivCallback(noteDiv);
    });
  };

  const unapplySelectedChord = () => {
    const [selectedChord, selectedName] = selectedChordAndName;
    applyChord(
        selectedChord, selectedName,
        (noteDiv) => noteDiv.style['background'] = 'transparent',
        (openDiv) => openDiv.style['border'] = null,
        (muteDiv) => muteDiv.style['background'] = 'transparent');
  };

  const applySelectedChord = () => {
    const [selectedChord, selectedName] = selectedChordAndName;
    applyChord(
        selectedChord, selectedName,
        (noteDiv) => noteDiv.style['background'] = 'black',
        (openDiv) => openDiv.style['border'] = `${muteNoteDivSize}px solid black`,
        (muteDiv) => muteDiv.style['background'] = 'black');
  };

  const unapplySelected = () => {
    if (selectedModeFlagsAndName !== null) {
      unapplySelectedMode();
    }
    else if (selectedChordAndName !== null) {
      unapplySelectedChord();
    }
  };

  const applySelected = () => {
    if (selectedModeFlagsAndName !== null) {
      applySelectedMode();
    }
    else if (selectedChordAndName !== null) {
      applySelectedChord();
    }
  };

  const selectMode = (modeFlags, name) => {
    unapplySelected();
    selectedChordAndName = null;
    selectedModeFlagsAndName = [modeFlags, name];
    applySelected();
  };

  const selectChord = (chord, name) => {
    unapplySelected();
    selectedModeFlagsAndName = null;
    selectedChordAndName = [chord, name];
    applySelected();
  };

  loadLayout();

  return {
    selectMode,
    selectChord,
    setLeftHanded,
    setRightHanded,
    setHorizontal,
    setVertical,

    getFretBarDivs: () => fretBarDivs,
    getGuitarstringDivs: () => guitarstringDivs,
    getNoteDivs: () => noteDivs,
    getFretboardDiv: () => fretboardDiv,
    getFretboardParentDiv: () => fretboardParentDiv,
    getHandednessLabelledForm: () => handednessLabelledForm,
    getOrientationLabelledForm: () => orientationLabelledForm,

    getNeckWidth: () => neckWidth,
    getNeckLength: () => neckLength,

    getFretboardDivSize: () => fretboardDivSize,
    getFretboardBorderSize: () => fretboardBorderSize,
    getFretboardParentDivSize: () => fretboardParentDivSize,
    getScaleNameDivSize: () => nameDivSize,

    getGuitarstrings: () => guitarstrings,
    getLabelledRadiosClickCallbacks: () => labelledRadiosClickCallbacks,
    getFretWidth: () => fretWidth,
    getFretBarWidth: () => fretBarWidth,
    getGuitarstringSpace: () => guitarstringSpace,
    getNoOfFrets: () => noOfFrets,
    getNoteDivSize: () => noteDivSize,
    getMuteNoteDivSize: () => muteNoteDivSize
  };
};

const CHORD_C_MAJ         = Object.freeze([{0: 0, 1: 1, 2: 0, 3: 2, 4: 3},        'C Major']);
const CHORD_C_MAJ_7       = Object.freeze([{0: 0, 1: 1, 2: 4, 3: 2, 4: 3},        'C Major Seventh']);
const CHORD_C_DOM_7       = Object.freeze([{0: 0, 1: 1, 2: 3, 3: 2, 4: 3},        'C Dominant Seventh']);
const CHORD_C_MAJ_OVER_G  = Object.freeze([{0: 0, 1: 1, 2: 0, 3: 2, 4: 3, 5: 3},  'C Major over G']);
const CHORD_C_MIN         = Object.freeze([{0: 3, 1: 4, 2: 5, 3: 5, 4: 3},        'C Minor']);
const CHORD_C_MIN_7       = Object.freeze([{0: 3, 1: 4, 2: 3, 3: 5, 4: 3},        'C Minor Seventh']);
const CHORD_D_MAJ         = Object.freeze([{0: 2, 1: 3, 2: 2, 3: 0},              'D Major']);
const CHORD_D_MAJ_OVER_Fs = Object.freeze([{0: 2, 1: 3, 2: 2, 3: 0, 4: 0, 5: 2},  'D Major over F#']);
const CHORD_D_MAJ_7       = Object.freeze([{0: 2, 1: 2, 2: 2, 3: 0},              'D Major Seventh']);
const CHORD_D_MIN         = Object.freeze([{0: 1, 1: 3, 2: 2, 3: 0},              'D Minor']);
const CHORD_D_MIN_7       = Object.freeze([{0: 1, 1: 1, 2: 2, 3: 0},              'D Minor Seventh']);
const CHORD_D_DOM_7       = Object.freeze([{0: 2, 1: 1, 2: 2, 3: 0},              'D Dominant Seventh']);
const CHORD_E_MAJ         = Object.freeze([{0: 0, 1: 0, 2: 1, 3: 2, 4: 2, 5: 0},  'E Major']);
const CHORD_E_MIN         = Object.freeze([{0: 0, 1: 0, 2: 0, 3: 2, 4: 2, 5: 0},  'E Minor']);
const CHORD_E_MIN_7       = Object.freeze([{0: 0, 1: 0, 2: 0, 3: 0, 4: 2, 5: 0},  'E Minor Seventh']);
const CHORD_E_DOM_7       = Object.freeze([{0: 0, 1: 0, 2: 1, 3: 0, 4: 2, 5: 0},  'E Dominant Seventh']);
const CHORD_F_MAJ         = Object.freeze([{0: 1, 1: 1, 2: 2, 3: 3, 4: 3, 5: 1},  'F Major']);
const CHORD_F_MIN         = Object.freeze([{0: 1, 1: 1, 2: 1, 3: 3, 4: 3, 5: 1},  'F Minor']);
const CHORD_F_MIN_7       = Object.freeze([{0: 1, 1: 1, 2: 1, 3: 1, 4: 3, 5: 1},  'F Minor Seventh']);
const CHORD_F_DOM_7       = Object.freeze([{0: 1, 1: 1, 2: 2, 3: 1, 4: 3, 5: 1},  'F Dominant Seventh']);
const CHORD_G_MAJ         = Object.freeze([{0: 3, 1: 0, 2: 0, 3: 0, 4: 2, 5: 3},  'G Major']);
const CHORD_G_MIN         = Object.freeze([{0: 3, 1: 3, 2: 3, 3: 5, 4: 5, 5: 3},  'G Minor']);
const CHORD_G_DOM_7       = Object.freeze([{0: 1, 1: 0, 2: 0, 3: 0, 4: 2, 5: 3},  'G Dominant Seventh']);
const CHORD_A_MAJ         = Object.freeze([{0: 0, 1: 2, 2: 2, 3: 2, 4: 0},        'A Major']);
const CHORD_A_MAJ_7       = Object.freeze([{0: 0, 1: 2, 2: 1, 3: 2, 4: 0},        'A Major Seventh']);
const CHORD_A_MIN         = Object.freeze([{0: 0, 1: 1, 2: 2, 3: 2, 4: 0},        'A Minor']);
const CHORD_A_MIN_7       = Object.freeze([{0: 0, 1: 1, 2: 0, 3: 2, 4: 0},        'A Minor Seventh']);
const CHORD_A_DOM_7       = Object.freeze([{0: 0, 1: 2, 2: 0, 3: 2, 4: 0},        'A Dominant Seventh']);
const CHORD_B_MAJ         = Object.freeze([{0: 2, 1: 4, 2: 4, 3: 4, 4: 2},        'B Major']);
const CHORD_B_MIN         = Object.freeze([{0: 2, 1: 3, 2: 4, 3: 4, 4: 2},        'B Minor']);
const CHORD_B_DOM_7       = Object.freeze([{0: 2, 1: 0, 2: 2, 3: 1, 4: 2},        'B Dominant Seventh']);

const CHORDS = Object.freeze([CHORD_C_MAJ, CHORD_C_MAJ_7, CHORD_C_DOM_7, CHORD_C_MAJ_OVER_G, CHORD_C_MIN, CHORD_C_MIN_7,
                              CHORD_D_MAJ, CHORD_D_MAJ_OVER_Fs, CHORD_D_MAJ_7, CHORD_D_MIN, CHORD_D_MIN_7, CHORD_D_DOM_7,
                              CHORD_E_MAJ, CHORD_E_MIN, CHORD_E_MIN_7, CHORD_E_DOM_7,
                              CHORD_F_MAJ, CHORD_F_MIN, CHORD_F_MIN_7, CHORD_F_DOM_7,
                              CHORD_G_MAJ, CHORD_G_MIN, CHORD_G_DOM_7,
                              CHORD_A_MAJ, CHORD_A_MAJ_7, CHORD_A_MIN, CHORD_A_MIN_7, CHORD_A_DOM_7,
                              CHORD_B_MAJ, CHORD_B_MIN, CHORD_B_DOM_7]);


export {
  STANDARD_TUNING, DEFAULT_FRET_WIDTH, DEFAULT_FRET_BAR_WIDTH, DEFAULT_GUITARSTRING_SPACE,
  DEFAULT_NO_OF_FRETS, DEFAULT_MUTE_NOTE_DIV_SIZE, DEFAULT_NOTE_DIV_SIZE,
  CHORD_C_MAJ, CHORD_C_MAJ_7, CHORD_C_DOM_7, CHORD_C_MAJ_OVER_G, CHORD_C_MIN, CHORD_C_MIN_7,
  CHORD_D_MAJ, CHORD_D_MAJ_OVER_Fs, CHORD_D_MAJ_7, CHORD_D_MIN, CHORD_D_MIN_7, CHORD_D_DOM_7,
  CHORD_E_MAJ, CHORD_E_MIN, CHORD_E_MIN_7, CHORD_E_DOM_7,
  CHORD_F_MAJ, CHORD_F_MIN, CHORD_F_MIN_7, CHORD_F_DOM_7,
  CHORD_G_MAJ, CHORD_G_MIN, CHORD_G_DOM_7,
  CHORD_A_MAJ, CHORD_A_MAJ_7, CHORD_A_MIN, CHORD_A_MIN_7, CHORD_A_DOM_7,
  CHORD_B_MAJ, CHORD_B_MIN, CHORD_B_DOM_7,
  CHORDS,
  LabelledRadiosClickCallbacks,
  FretboardBuilder,
  Fretboard
};

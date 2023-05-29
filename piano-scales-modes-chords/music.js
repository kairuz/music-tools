const Scale = (_name, _steps, _intervals, _flags) => {
  const name = _name;
  const steps = _steps;
  const intervals = _intervals;
  const flags = _flags;

  return {
    buildModeIntervals: (mode) => {
      const modeIndex = mode - 1;
      return intervals.slice(modeIndex, intervals.length).concat(intervals.slice(0, modeIndex));
    },
    getName: () => name,
    getSteps: () => steps,
    getIntervals: () => intervals,
    getFlags: () => flags,
    getNumberOfDiatonicNotes: () => flags.filter((flag) => flag === true).length,
    getNumberOfHalfNotes: () => flags.length,
  };
};

Scale.flagsFromIntervals = (intervals) => {
  return intervals.reduce((acc, currElem) => {
    acc.push(true);
    for (let j = 1; j < currElem; j++) {
      acc.push(false);
    }
    return acc;
  }, []);
};

Scale.stepsFromFlags = (flags) => {
  return flags.reduce((acc, elem, i) => {
    if (elem === true) {
      acc.push(i);
    }
    return acc;
  }, []);
};

Scale.fromIntervals = (name, intervals) => {
  const flags = Scale.flagsFromIntervals(intervals);
  const steps = Scale.stepsFromFlags(flags);
  return Scale(name, steps, intervals, flags);
};

const Piano = () => {

  const audioContext = (() => {
    let audioContext = null;

    return {
      get: () => {
        if (audioContext === null) {
          audioContext = new AudioContext();
        }
        return audioContext;
      }
    };
  })();

  const playNote = (note, frequency, _startTime, duration, onStarted = null, onEnded = null) => {
    const oscillatorNode = audioContext.get().createOscillator();
    oscillatorNode.frequency.value = frequency;

    const startTime = audioContext.get().currentTime + _startTime;


    const gainNode = audioContext.get().createGain();
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.0, startTime + duration);

    oscillatorNode.start(startTime);
    oscillatorNode.stop(startTime + duration);

    let started = false;
    let ended = false;

    if (typeof onStarted === 'function') {
      setTimeout(() => {
        started = true;
        onStarted(ended);
      }, _startTime * 1000);
    }

    if (typeof onEnded === 'function') {
      oscillatorNode.addEventListener('ended', () => {
        ended = true;
        onEnded(started);
      });
    }

    oscillatorNode.connect(gainNode);
    gainNode.connect(audioContext.get().destination);
  };

  const body = document.getElementsByTagName('body')[0];
  const computedStyle = getComputedStyle(body);
  const noteDivWidth = Number(computedStyle.getPropertyValue('--noteWidth').trim());
  const pianoKeyDivWidth = Number(computedStyle.getPropertyValue('--pianoKeyWidth').trim());
  const pianoKeyAccidentalDivWidth = Number(computedStyle.getPropertyValue('--pianoKeyAccidentalWidth').trim());

  const noteNames = [
    'C',
    'C#<br />Db',
    'D',
    'D#<br />Eb',
    'E',
    'F',
    'F#<br />Gb',
    'G',
    'G#<br />Ab',
    'A',
    'A#<br />Bb',
    'B'
  ];

  const noOfOctaves = 9;
  const noteNamesIndexOfA = noteNames.indexOf('A');
  const startingNoteIndex = noteNamesIndexOfA;
  const noteNamesIndexOfC = noteNames.indexOf('C');
  const endingNoteIndex = noteNamesIndexOfC;
  const startingOctave = 0;

  const noOfNotes = 12;

  const noOfDiatonicNotes = 7;
  const noOfDiatonicNotesFromStartingNoteIndex = 2;

  const majorScaleIntervals         = [2, 2, 1, 2, 2, 2, 1]; // W, W, H, W, W, W, H


  const harmonicMinorScaleIntervals               = [2, 1, 2, 2, 1, 3, 1];
  const harmonicMajorScaleIntervals               = [2, 2, 1, 2, 1, 3, 1];
  const melodicMinorScaleIntervals                = [2, 1, 2, 2, 2, 2, 1];

  const majorScale = Scale.fromIntervals('Major', majorScaleIntervals);
  const SCALES = [
    majorScale,
    Scale.fromIntervals('Harmonic Minor', harmonicMinorScaleIntervals),
    Scale.fromIntervals('Harmonic Major', harmonicMajorScaleIntervals),
    Scale.fromIntervals('Melodic Minor', melodicMinorScaleIntervals)
  ];

  const ModeOption = (number, radio, label) => {
    return {
      getNumber: () => number,
      getRadio: () => radio,
      getLabel: () => label
    }
  };

  const SelectionType = (name) => {
    return {
      getName: () => name
    }
  };

  const SELECTION_TYPES = [SelectionType('scale'), SelectionType('chord')];

  const ChordType = (name, noOfNotes) => {
    return {
      getName: () => name,
      getNoOfNotes: () => noOfNotes
    };
  };

  const CHORD_TYPES = [
    ChordType('dyad', 2), ChordType('triad', 3), ChordType('tetrad', 4),
    ChordType('5 note', 5), ChordType('6 note', 6), ChordType('7 note', 7)
  ];

  const NoteInfo = (_index, _name, _accidental, _octave, _halfStepsFromMiddleA, _frequency) => {
    const index = _index;
    const name = _name;
    const accidental = _accidental;
    const octave = _octave;
    const halfStepsFromMiddleA = _halfStepsFromMiddleA;
    const frequency = _frequency;

    return {
      getIndex: () => index,
      getName: () => name,
      isAccidental: () => accidental,
      getOctave: () => octave,
      getHalfStepsFromMiddleA: () => halfStepsFromMiddleA,
      getFrequency: () => frequency
    }
  };

  const notesAndPianoKeys = (() => {
    const noteInfos = [];
    const noteDivs = [];
    const pianoKeyDivs = [];
    const noteRootFlagsSpanLists = [];
    let length = 0;
    const selected = new Set();
    const scaleRoots = new Set();
    const modeRoots = new Set();
    const diatonicAlts = new Set();
    const modes = new Map();

    // ■ "\u25A0" &#9632;
    // □ "\u25A1"	&#9633;

    return {
      add: (noteInfo, noteDiv, pianoKeyDiv, noteRootFlagsSpanList) => {
        noteInfos[length] = noteInfo;
        noteDivs[length] = noteDiv;
        pianoKeyDivs[length] = pianoKeyDiv;
        noteRootFlagsSpanLists[length] = noteRootFlagsSpanList;
        length++;
      },
      start: (index) => {
        noteDivs[index].classList.add('playingNote');
        pianoKeyDivs[index].classList.add('playingNote');
      },
      end: (index) => {
        noteDivs[index].classList.remove('playingNote');
        pianoKeyDivs[index].classList.remove('playingNote');
      },
      select: (index) => {
        selected.add(index);
        noteDivs[index].classList.add('selectedNote');
        pianoKeyDivs[index].classList.add('selectedNote');
      },
      deselect: (index) => {
        selected.delete(index);
        noteDivs[index].classList.remove('selectedNote');
        pianoKeyDivs[index].classList.remove('selectedNote');
      },
      clearRoot: (index) => {
        const rootClasses = 'rootNote scaleRootNote scaleRootNoteAlt modeRootNote modeRootNoteAlt diatonicNoteAlt'.split(' ');
        noteRootFlagsSpanLists[index].forEach((span) => span.classList.remove(...rootClasses));
      },
      clearScaleRoots: () => scaleRoots.clear(),
      markScaleRoot: (index, isAlt) => {
        scaleRoots.add(index);
        const rootClasses = `rootNote ${isAlt ? 'scaleRootNoteAlt' : 'scaleRootNote'}`.split(' ');
        noteRootFlagsSpanLists[index][0].classList.add(...rootClasses);
      },
      clearModeRoots: () => modeRoots.clear(),
      markModeRoot: (index, isAlt) => {
        modeRoots.add(index);
        const rootClasses = `rootNote ${isAlt ? 'modeRootNoteAlt' : 'modeRootNote'}`.split(' ');
        noteRootFlagsSpanLists[index][1].classList.add(...rootClasses);
      },
      clearDiatonicAlts: () => diatonicAlts.clear(),
      clearModes: () => modes.clear(),
      markDiatonicNoteAlt: (index) => {
        diatonicAlts.add(index);
        noteRootFlagsSpanLists[index][2].classList.add('rootNote', 'diatonicNoteAlt');
      },
      markMode: (index, mode) => modes.set(index, mode),
      getNoteDiv: (index) => noteDivs[index],
      getPianoKeyDiv: (index) => pianoKeyDivs[index],
      getNoteInfo: (index) => noteInfos[index],
      getLength: () => length,
      getSelected: () => selected,
      getScaleRoots: () => scaleRoots,
      getModeRoots: () => modeRoots,
      getDiatonicAlts: () => diatonicAlts,
      getModes: () => modes
    };
  })();

  const selection = (() => {
    let scale = SCALES[0];
    let lockToKey = true;
    let mode = 1;
    let modeOptions = [];
    let includeOctave = true;
    let type = SELECTION_TYPES[0];
    let chordType = CHORD_TYPES[1];
    let noteIndex = 39;

    return {
      buildSteps: () => {
        const modeIntervals = scale.buildModeIntervals(mode);
        const modeFlags = Scale.flagsFromIntervals(modeIntervals);
        const modeSteps = Scale.stepsFromFlags(modeFlags);

        let res = null;
        if (type.getName() === 'scale') {
          res = modeSteps;
          if (includeOctave) {
            res.push(res[0] + scale.getNumberOfHalfNotes());
          }
        }
        else if (type.getName() === 'chord') {
          const chordSteps = [];
          const wrappedModeSteps =
            modeSteps.concat(modeSteps.map((modeStep) => modeStep + scale.getNumberOfHalfNotes()));
          let ii = 0;
          for (let i = 0; i < chordType.getNoOfNotes(); i++) {
            chordSteps.push(wrappedModeSteps[ii]);
            ii += 2;
          }

          res = chordSteps;
        }
        return res;
      },
      clearModeOptions: () => modeOptions.length = 0,
      toggleLockToKey: () => lockToKey = !lockToKey,
      toggleIncludeOctave: () => includeOctave = !includeOctave,
      setScale: (_scale) => scale = _scale,
      setLockToKey: (_lockToKey) => lockToKey = _lockToKey,
      setModeOptions: (_modeOptions) => modeOptions = _modeOptions,
      setMode: (_mode) => mode = _mode,
      setIncludeOctave: (_includeOctave) => includeOctave = _includeOctave,
      setType: (_type) => type = _type,
      setChordType: (_chordType) => chordType = _chordType,
      setNoteIndex: (_noteIndex) => noteIndex = _noteIndex,
      getScale: () => scale,
      isLockToKey: () => lockToKey,
      getModeOptions: () => modeOptions,
      getMode: () => mode,
      isIncludeOctave: () => includeOctave,
      getType: () => type,
      getChordType: () => chordType,
      getNoteIndex: () => noteIndex
    }
  })();


  const selectedScaleDiv = document.createElement('div');
  selectedScaleDiv.setAttribute('id', 'scale');

  const lockToKeyCheckbox = document.createElement('input');
  lockToKeyCheckbox.setAttribute('id', 'lockToKey');

  const selectedModeDiv = document.createElement('div');
  selectedModeDiv.setAttribute('id', 'mode');

  const includeOctaveCheckbox = document.createElement('input');
  includeOctaveCheckbox.setAttribute('id', 'includeOctave');

  const selectedSelectionTypeDiv = document.createElement('div');
  selectedSelectionTypeDiv.setAttribute('id', 'selectionType');

  const selectedChordTypeDiv = document.createElement('div');
  selectedChordTypeDiv.setAttribute('id', 'chordType');

  const selectedNoteDiv = document.createElement('div');
  selectedNoteDiv.setAttribute('id', 'selectedNote');

  const indicesDiv = document.createElement('div');
  indicesDiv.setAttribute('id', 'indices');
  indicesDiv.setAttribute('style', 'height: 10px;');

  const notesDiv = document.createElement('div');
  notesDiv.setAttribute('id', 'notes');

  const pianoDiv = document.createElement('div');
  pianoDiv.setAttribute('id', 'piano');

  const clearSelection = () => {
    for (let i = 0; i < notesAndPianoKeys.getLength(); i++) {
      notesAndPianoKeys.clearRoot(i);
    }

    selection.buildSteps().forEach((k) => {
      if (selection.getNoteIndex() + k < notesAndPianoKeys.getLength()) {
        notesAndPianoKeys.deselect(selection.getNoteIndex() + k);
      }
    });
  };

  const markScaleRoots = (selectedNoteDivIndex) => {
    notesAndPianoKeys.clearScaleRoots();
    const scaleRootIndex = selectedNoteDivIndex - selection.getScale().getSteps()[selection.getMode() - 1];
    if (scaleRootIndex >= 0) {
      notesAndPianoKeys.markScaleRoot(scaleRootIndex, false);
    }
    let isFirst = true;
    for (let i = scaleRootIndex; i >= 0; i -= selection.getScale().getNumberOfHalfNotes()) {
      if (isFirst === false) {
        notesAndPianoKeys.markScaleRoot(i, true);
      }
      isFirst = false;
    }
    isFirst = true;
    for (let i = scaleRootIndex; i < notesAndPianoKeys.getLength(); i += selection.getScale().getNumberOfHalfNotes()) {
      if (isFirst === false) {
        notesAndPianoKeys.markScaleRoot(i, true);
      }
      isFirst = false;
    }
  };

  const markModeRoots = (selectedNoteDivIndex) => {
    notesAndPianoKeys.clearModeRoots();
    const modeRootIndex = selectedNoteDivIndex;
    notesAndPianoKeys.markModeRoot(modeRootIndex, false);
    let isFirst = true;
    for (let i = modeRootIndex; i >= 0; i -= selection.getScale().getNumberOfHalfNotes()) {
      if (isFirst === false) {
        notesAndPianoKeys.markModeRoot(i, true);
      }
      isFirst = false;
    }
    isFirst = true;
    for (let i = modeRootIndex; i < notesAndPianoKeys.getLength(); i += selection.getScale().getNumberOfHalfNotes()) {
      if (isFirst === false) {
        notesAndPianoKeys.markModeRoot(i, true);
      }
      isFirst = false;
    }
  };

  const markDiatonicNotes = (selectedNoteDivIndex) => {
    notesAndPianoKeys.clearDiatonicAlts();
    let i = selectedNoteDivIndex;
    let ii = selection.getScale().getNumberOfDiatonicNotes() - 1;
    while (i >= 0) {
      i -= selection.getScale().buildModeIntervals(selection.getMode())[ii];
      if (i >= 0) {
        notesAndPianoKeys.markDiatonicNoteAlt(i);
        ii--;
        if (ii < 0) {
          ii = selection.getScale().getNumberOfDiatonicNotes() - 1;
        }
      }
    }
    const selectedSteps = selection.buildSteps();
    let iii = 0;
    i = selectedNoteDivIndex;
    ii = 0;
    while (i < notesAndPianoKeys.getLength()) {
      if (i < notesAndPianoKeys.getLength()) {
        if (selectedSteps[iii] === (i - selectedNoteDivIndex)) {
          iii++;
        }
        else {
          notesAndPianoKeys.markDiatonicNoteAlt(i);
        }
        i += selection.getScale().buildModeIntervals(selection.getMode())[ii];

        ii++;
        if (ii === selection.getScale().buildModeIntervals(selection.getMode()).length) {
          ii = 0;
        }
      }
    }
  };


  const markModes = (selectedNoteDivIndex) => {
    notesAndPianoKeys.clearModes();
    const scaleIntervals = selection.getScale().getIntervals();
    let i = selectedNoteDivIndex;
    let ii = selection.getMode() - 2;
    if (ii < 0) {
      ii = selection.getScale().getNumberOfDiatonicNotes() - 1;
    }
    while (i >= 0) {
      i -= scaleIntervals[ii];
      if (i >= 0) {
        notesAndPianoKeys.markMode(i, ii + 1);
        ii--;
        if (ii < 0) {
          ii = selection.getScale().getNumberOfDiatonicNotes() - 1;
        }
      }
    }
    i = selectedNoteDivIndex;
    ii = selection.getMode() - 1;
    while (i < notesAndPianoKeys.getLength()) {
      if (i < notesAndPianoKeys.getLength()) {
        notesAndPianoKeys.markMode(i, ii + 1);
        i += scaleIntervals[ii];
        ii++;
        if (ii === selection.getScale().buildModeIntervals(selection.getMode()).length) {
          ii = 0;
        }
      }
    }
  };

  const noteClick = (selectedNoteDivIndex) => {
    selection.setNoteIndex(selectedNoteDivIndex);
    const selectedNoteInfo = notesAndPianoKeys.getNoteInfo(selectedNoteDivIndex);
    selectedNoteDiv.innerHTML = `${selectedNoteInfo.getName()}<sub>${selectedNoteInfo.getOctave()}</sub>`;

    const steps = selection.buildSteps();

    steps.forEach((k) => {
      if (selectedNoteDivIndex + k < notesAndPianoKeys.getLength()) {
        notesAndPianoKeys.select(selectedNoteDivIndex + k);
      }
    });

    markScaleRoots(selectedNoteDivIndex);
    markModeRoots(selectedNoteDivIndex);
    markDiatonicNotes(selectedNoteDivIndex);
    markModes(selectedNoteDivIndex);

  };


  const loadModeOptions = (scale) => {
    scale.getSteps().forEach((step, i) => {
      const modeNumber = i + 1;
      const selectedModeRadio = document.createElement('input');
      const selectedModeRadioId = `selectedModeRadio_${scale.getName()}_${modeNumber}`;
      selectedModeRadio.setAttribute('type', 'radio');
      selectedModeRadio.setAttribute('id', selectedModeRadioId);
      selectedModeRadio.setAttribute('name', 'selected-mode-radio');
      if (modeNumber === selection.getMode()) {
        selectedModeRadio.setAttribute('checked', 'checked');
      }
      const selectedModeRadioLabel = document.createElement('label');
      selectedModeRadioLabel.textContent = `${modeNumber}`;
      selectedModeRadioLabel.setAttribute('for', selectedModeRadioId);
      selectedModeDiv.appendChild(selectedModeRadio);
      selectedModeDiv.appendChild(selectedModeRadioLabel);

      selection.getModeOptions().push(ModeOption(modeNumber, selectedModeRadio, selectedModeRadioLabel));

      selectedModeRadio.addEventListener('click', () => {
        clearSelection();

        if (selection.isLockToKey()) {
          const prevMode = selection.getMode();
          selection.setMode(modeNumber);
          const selectedNoteDivIndex = selection.getNoteIndex() + (selection.getScale().getSteps()[modeNumber - 1] - selection.getScale().getSteps()[prevMode - 1]);
          noteClick(selectedNoteDivIndex);
        }
        else {
          selection.setMode(modeNumber);
          noteClick(selection.getNoteIndex());
        }

      });

    });
  };

  loadModeOptions(selection.getScale());

  SCALES.forEach((scale, i) => {
    const selectedScaleRadio = document.createElement('input');
    const selectedScaleRadioId = `selectedScaleRadio_${scale.getName()}`;
    selectedScaleRadio.setAttribute('type', 'radio');
    selectedScaleRadio.setAttribute('id', selectedScaleRadioId);
    selectedScaleRadio.setAttribute('name', 'selected-scale-radio');
    if (i === 0) {
      selectedScaleRadio.setAttribute('checked', 'checked');
    }
    const selectedScaleRadioLabel = document.createElement('label');
    selectedScaleRadioLabel.textContent = `${scale.getName()}`;
    selectedScaleRadioLabel.setAttribute('for', selectedScaleRadioId);
    selectedScaleDiv.appendChild(selectedScaleRadio);
    selectedScaleDiv.appendChild(selectedScaleRadioLabel);
    // selectedScaleDiv.appendChild(document.createElement('br'));

    selectedScaleRadio.addEventListener('click', () => {

      clearSelection();
      selection.setScale(scale);

      selection.getModeOptions().forEach((modeOption) => {
        selectedModeDiv.removeChild(modeOption.getRadio());
        selectedModeDiv.removeChild(modeOption.getLabel());
      });

      selection.clearModeOptions();

      loadModeOptions(selection.getScale());

      const selectedNoteDivIndex = selection.getNoteIndex();
      noteClick(selectedNoteDivIndex);

    });

  });

  lockToKeyCheckbox.setAttribute('type', 'checkbox');
  if (selection.isLockToKey()) {
    lockToKeyCheckbox.setAttribute('checked', 'checked');
  }
  lockToKeyCheckbox.addEventListener('click', () => {
    selection.toggleLockToKey();
  });

  includeOctaveCheckbox.setAttribute('type', 'checkbox');
  if (selection.isIncludeOctave()) {
    includeOctaveCheckbox.setAttribute('checked', 'checked');
  }
  includeOctaveCheckbox.addEventListener('click', () => {
    clearSelection();
    selection.toggleIncludeOctave();
    const selectedNoteDivIndex = selection.getNoteIndex();
    noteClick(selectedNoteDivIndex);
  });

  const selectionTypeRadios = [];

  SELECTION_TYPES.forEach((selectionType, i) => {
    const selectedSelectionTypeRadio = document.createElement('input');
    const selectedSelectionTypeRadioId = `selectedSelectionTypeRadio_${selectionType.getName()}`;
    selectedSelectionTypeRadio.setAttribute('type', 'radio');
    selectedSelectionTypeRadio.setAttribute('id', selectedSelectionTypeRadioId);
    selectedSelectionTypeRadio.setAttribute('name', 'selected-type-radio');
    selectionTypeRadios.push(selectedSelectionTypeRadio);
    if (i === 0) {
      selectedSelectionTypeRadio.setAttribute('checked', 'checked');
    }
    const selectedSelectionTypeRadioLabel = document.createElement('label');
    selectedSelectionTypeRadioLabel.textContent = `${selectionType.getName()}`;
    selectedSelectionTypeRadioLabel.setAttribute('for', selectedSelectionTypeRadioId);
    selectedSelectionTypeDiv.appendChild(selectedSelectionTypeRadio);
    selectedSelectionTypeDiv.appendChild(selectedSelectionTypeRadioLabel);

    selectedSelectionTypeRadio.addEventListener('click', () => {

      clearSelection();
      selection.setType(selectionType);
      const selectedNoteDivIndex = selection.getNoteIndex();
      noteClick(selectedNoteDivIndex);

    });

  });

  CHORD_TYPES.forEach((chordType, i) => {
    const selectedChordTypeRadio = document.createElement('input');
    const selectedChordTypeRadioId = `selectedChordTypeRadio_${chordType.getName()}`;
    selectedChordTypeRadio.setAttribute('type', 'radio');
    selectedChordTypeRadio.setAttribute('id', selectedChordTypeRadioId);
    selectedChordTypeRadio.setAttribute('name', 'selected-chord-type-radio');
    if (i === 1) {
      selectedChordTypeRadio.setAttribute('checked', 'checked');
    }
    const selectedChordTypeRadioLabel = document.createElement('label');
    selectedChordTypeRadioLabel.textContent = `${chordType.getName()}`;
    selectedChordTypeRadioLabel.setAttribute('for', selectedChordTypeRadioId);
    selectedChordTypeDiv.appendChild(selectedChordTypeRadio);
    selectedChordTypeDiv.appendChild(selectedChordTypeRadioLabel);

    selectedChordTypeRadio.addEventListener('click', () => {
      clearSelection();
      selection.setChordType(chordType);
      const selectedNoteDivIndex = selection.getNoteIndex();
      noteClick(selectedNoteDivIndex);
    });
  });

  const firstCNoteLeft = (noOfNotes - startingNoteIndex) * noteDivWidth;
  const firstCKeyDiatonicLeft = noOfDiatonicNotesFromStartingNoteIndex * pianoKeyDivWidth;
  const firstCAdjust = firstCKeyDiatonicLeft - firstCNoteLeft;

  const MIDDLE_A_FREQ = 440;

  const calcNoteFrequencyFromMiddleA = (halfStepsFromMiddleA) => {
    return MIDDLE_A_FREQ * Math.pow(2, halfStepsFromMiddleA / 12);
  };

  const OCTAVES_BELOW_MIDDLE_C = 4;

  for (let j = 0; j < noOfOctaves; j++) {
    const octavesOffset = j - OCTAVES_BELOW_MIDDLE_C;

    let diatonicCount = 0;
    let accidentalCountSinceDiatonic = 0;

    const isFirstOctave = j === 0;
    const isLastOctave = j === (noOfOctaves - 1);

    const startI = isFirstOctave ? startingNoteIndex : 0;
    const endI = isLastOctave ? endingNoteIndex + 1 : noOfNotes;

    for (let i = startI; i < endI; i++) {
      const noteDiv = document.createElement('div');
      noteDiv.setAttribute('class', 'note');
      const noteSpan = document.createElement('span');
      noteSpan.setAttribute('class', 'noteName');
      noteDiv.appendChild(noteSpan);
      const flagSpansDiv = document.createElement('div');
      noteDiv.appendChild(flagSpansDiv);
      const pianoKeyDiv = document.createElement('div');
      const scaleRootSpan = document.createElement('span');
      const modeRootSpan = document.createElement('span');
      const diatonicNoteAltSpan = document.createElement('span');
      flagSpansDiv.appendChild(scaleRootSpan);
      flagSpansDiv.appendChild(modeRootSpan);
      flagSpansDiv.appendChild(diatonicNoteAltSpan);
      const noteRootFlagsSpanList = [scaleRootSpan, modeRootSpan, diatonicNoteAltSpan];

      const noteName = noteNames[i];
      const isAccidental = majorScale.getFlags()[i] === false;
      const noteOctave = j + startingOctave;
      const halfStepsFromMiddleC = ((octavesOffset * noOfNotes) + i);
      const halfStepsFromMiddleA = halfStepsFromMiddleC - noteNamesIndexOfA;
      const noteFrequency = calcNoteFrequencyFromMiddleA(halfStepsFromMiddleA);
      const noteInfo = NoteInfo(notesAndPianoKeys.getLength(), noteName, isAccidental, noteOctave, halfStepsFromMiddleA, noteFrequency);

      notesAndPianoKeys.add(noteInfo, noteDiv, pianoKeyDiv, noteRootFlagsSpanList);

      const indexDiv = document.createElement('div');
      indexDiv.innerHTML = noteInfo.getIndex();

      indicesDiv.appendChild(indexDiv);
      notesDiv.appendChild(noteDiv);
      pianoDiv.appendChild(pianoKeyDiv);

      const noteLeft = firstCAdjust + (
        isFirstOctave ?
          ((i - startingNoteIndex) * noteDivWidth) :
          ((noOfNotes - startingNoteIndex) * noteDivWidth) +
            ((j - 1) * noOfNotes * noteDivWidth) + (i * noteDivWidth)
      );

      noteDiv.setAttribute('style', `left: ${noteLeft}px`);
      indexDiv.setAttribute('style', `font-size: 8px; text-align: center; position: absolute; left: ${noteLeft}px;`);
      const diatonicKeyLeft =
        isFirstOctave ?
          diatonicCount * pianoKeyDivWidth :
          (noOfDiatonicNotesFromStartingNoteIndex * pianoKeyDivWidth) +
            ((j - 1) * noOfDiatonicNotes * pianoKeyDivWidth) +
            (diatonicCount * pianoKeyDivWidth);

      if (isAccidental === false) {
        pianoKeyDiv.setAttribute('class', 'pianoKey');
        pianoKeyDiv.setAttribute('style', `left: ${diatonicKeyLeft}px`);
        diatonicCount++;
        accidentalCountSinceDiatonic = 0;
      }
      else {
        accidentalCountSinceDiatonic++;
        pianoKeyDiv.setAttribute('class', 'pianoKeyAccidental');
        pianoKeyDiv.setAttribute('style', `left: ${diatonicKeyLeft - (pianoKeyAccidentalDivWidth / 2)}px`);
      }

      const noteClickIndex =
        isFirstOctave ?
          i - startingNoteIndex :
          (noOfNotes - startingNoteIndex) + ((j - 1) * noOfNotes) + i;

      const clearSelectionAndNoteClick = () => {
        const includes = notesAndPianoKeys.getModes().has(noteClickIndex);

        if (selection.isLockToKey()) {
          if (includes) {
            clearSelection();
            const before = selection.getMode();
            const mode = notesAndPianoKeys.getModes().get(noteClickIndex);
            selection.setMode(mode);
            selection.getModeOptions()[mode - 1].getRadio().checked = true;

            noteClick(noteClickIndex);
          }
        }
        else {
          clearSelection();
          noteClick(noteClickIndex);
        }

      };

      const rightClick = (e) => {
        e.preventDefault();
        clearSelection();
        noteClick(noteClickIndex);
      };

      noteDiv.addEventListener('click', clearSelectionAndNoteClick);
      noteDiv.addEventListener('contextmenu', rightClick);
      pianoKeyDiv.addEventListener('click', clearSelectionAndNoteClick);
      pianoKeyDiv.addEventListener('contextmenu', rightClick);

      noteSpan.innerHTML = noteName + ((isFirstOctave && i === startI) ||
                                   i === noteNamesIndexOfA || i === noteNames.indexOf('C')  ?
                                   `<sub>${noteOctave}</sub>` : '');
    }
  }

  noteClick(selection.getNoteIndex());

  const buildPlayButton = (text, playCallback) => {
    const playButton = document.createElement('button');
    playButton.textContent = text;
    playButton.addEventListener('click', playCallback);
    return playButton;
  };

  const playChordButton = buildPlayButton('Play Chord', () => {
    const steps = selection.buildSteps();
    for (let k = 0; k < steps.length; k++) {
      if ((selection.getNoteIndex() + steps[k]) < notesAndPianoKeys.getLength()) {
        const noteIndex = selection.getNoteIndex() + steps[k];
        playNote(noteIndex, notesAndPianoKeys.getNoteInfo(noteIndex).getFrequency(), 0.05, 0.80,
                 (ended) => {
                   if (ended === false) {
                     notesAndPianoKeys.start(noteIndex);
                   }
                 },
                 (started) => {
                   if (started === true) {
                     notesAndPianoKeys.end(noteIndex);
                   }
                 });
      }
    }
  });

  const playArpeggioButton = buildPlayButton('Play Arpeggio', () => {
    const steps = selection.buildSteps();
    for (let k = 0; k < steps.length; k++) {
      if ((selection.getNoteIndex() + steps[k]) < notesAndPianoKeys.getLength()) {
        const noteIndex = selection.getNoteIndex() + steps[k];
        playNote(noteIndex, notesAndPianoKeys.getNoteInfo(noteIndex).getFrequency(), (k / 3), 0.80,
                 (ended) => {
                   if (ended === false) {
                     notesAndPianoKeys.start(noteIndex);
                   }
                 },
                 (started) => {
                   if (started === true) {
                     notesAndPianoKeys.end(noteIndex);
                   }
                 });
      }
    }
  });


  return {
    init: () => {
      document.getElementsByTagName('body')[0].appendChild(playChordButton);
      document.getElementsByTagName('body')[0].appendChild(playArpeggioButton);

      const scaleLabel = document.createElement('label');
      scaleLabel.textContent = 'Scale';
      scaleLabel.setAttribute('for', 'scale');
      body.appendChild(document.createElement('br'));
      body.appendChild(scaleLabel);
      body.appendChild(selectedScaleDiv);
      body.appendChild(document.createElement('br'));

      const lockToKeyLabel = document.createElement('label');
      lockToKeyLabel.textContent = 'Lock To Key';
      lockToKeyLabel.setAttribute('for', 'lockToKey');
      body.appendChild(document.createElement('br'));
      body.appendChild(lockToKeyCheckbox);
      body.appendChild(lockToKeyLabel);
      body.appendChild(document.createElement('br'));

      const modeLabel = document.createElement('label');
      modeLabel.textContent = 'Mode / Chord';
      modeLabel.setAttribute('for', 'mode');
      body.appendChild(document.createElement('br'));
      body.appendChild(modeLabel);
      body.appendChild(selectedModeDiv);
      body.appendChild(document.createElement('br'));

      const selectionTypeLabel = document.createElement('label');
      selectionTypeLabel.textContent = 'Type';
      selectionTypeLabel.setAttribute('for', 'selectionType');
      body.appendChild(document.createElement('br'));
      body.appendChild(selectionTypeLabel);
      body.appendChild(selectedSelectionTypeDiv);
      body.appendChild(document.createElement('br'));

      const typeScaleFieldset = document.createElement('fieldset');
      body.appendChild(typeScaleFieldset);

      const typeScaleLegend = document.createElement('legend');
      typeScaleLegend.textContent = 'Scale';
      typeScaleFieldset.appendChild(typeScaleLegend);

      const includeOctaveLabel = document.createElement('label');
      includeOctaveLabel.textContent = 'Include Octave';
      includeOctaveLabel.setAttribute('for', 'includeOctave');
      typeScaleFieldset.appendChild(document.createElement('br'));
      typeScaleFieldset.appendChild(includeOctaveCheckbox);
      typeScaleFieldset.appendChild(includeOctaveLabel);
      typeScaleFieldset.appendChild(document.createElement('br'));

      body.appendChild(document.createElement('br'));

      const typeChordFieldset = document.createElement('fieldset');
      body.appendChild(typeChordFieldset);
      typeChordFieldset.setAttribute('disabled', 'disabled');

      const typeChordLegend = document.createElement('legend');
      typeChordLegend.textContent = 'Chord';
      typeChordLegend.classList.add('disabled');
      typeChordFieldset.appendChild(typeChordLegend);

      selectionTypeRadios[0].addEventListener('click', () => {
        typeScaleFieldset.removeAttribute('disabled');
        typeScaleLegend.classList.remove('disabled');
        typeChordFieldset.setAttribute('disabled', 'disabled');
        typeChordLegend.classList.add('disabled');
      });
      selectionTypeRadios[1].addEventListener('click', () => {
        typeChordFieldset.removeAttribute('disabled');
        typeChordLegend.classList.remove('disabled');
        typeScaleFieldset.setAttribute('disabled', 'disabled');
        typeScaleLegend.classList.add('disabled');
      });

      const chordTypeLabel = document.createElement('label');
      chordTypeLabel.textContent = 'Type';
      chordTypeLabel.setAttribute('for', 'chordType');
      typeChordFieldset.appendChild(document.createElement('br'));
      typeChordFieldset.appendChild(chordTypeLabel);
      typeChordFieldset.appendChild(selectedChordTypeDiv);
      typeChordFieldset.appendChild(document.createElement('br'));

      body.appendChild(document.createElement('br'));
      body.appendChild(document.createElement('br'));
      body.appendChild(selectedNoteDiv);
      body.appendChild(document.createElement('br'));
      body.appendChild(document.createElement('br'));
      body.appendChild(document.createElement('br'));
      body.appendChild(indicesDiv);
      body.appendChild(notesDiv);
      body.appendChild(pianoDiv);

    },

    getNotesAndPianoKeys: () => notesAndPianoKeys

  };
};


export {Scale, Piano};

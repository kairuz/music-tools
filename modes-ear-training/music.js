const NOTE_NAMES = [
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

const NOTE_NAME_INDEX = {
  'C': 0,
  'C#': 1,
  'Db': 1,
  'D': 2,
  'D#': 3,
  'Eb': 3,
  'E': 4,
  'F': 5,
  'F#': 6,
  'Gb': 6,
  'G': 7,
  'G#': 8,
  'Ab': 8,
  'A': 9,
  'A#': 10,
  'Bb': 10,
  'B': 11,
};

const NOTES_PER_OCTAVE = 12;


const flagsToModeFlags = (flags, noOfNotes, modeNo) => {
  const modeIndex = (() => {
    let counted = 0;
    for (let i = 0; i < flags.length; i++) {
      const flag = flags[i];
      if (flag === true) {
        counted++;
        if (counted === modeNo) {
          return i;
        }
      }
    }
  })();

  return flags.slice(modeIndex, flags.length).concat(flags.slice(0, modeIndex));
};


const flagsToIntervals = (flags, noOfIntervals = null) => {
  return flags.reduce((acc, flag) => {
    if (noOfIntervals !== null && acc.length === noOfIntervals) {
      return acc;
    }

    if (flag === true) {
      acc.push(0);
    }
    acc[acc.length - 1]++;
    return acc;
  }, []);
};

const flagsToPositions = (flags, noOfPositions = null) => {
  return flags.reduce((acc, flag, i) => {
    if (noOfPositions !== null && acc.length === noOfPositions) {
      return acc;
    }
    if (flag === true) {
      acc.push(i + 1);
    }
    return acc;
  }, []);
};

const intervalsToPositions = (flags, intervals, noOfPositions = null) => {
  return flags.reduce((acc, flag, i) => {
    if (noOfPositions !== null && acc.length === noOfPositions) {
      return acc;
    }
    if (flag === true) {
      acc.push(i + 1);
    }
    return acc;
  }, []);
};


const flagsToChordIntervals = (flags) => {
  let curr = 0;
  let skip = 1;
  return flags.slice(1).reduce((acc, flag) => {
    curr++;
    if (flag === true && ++skip === 3) {
      acc.push(curr);
      curr = 0;
      skip = 1;
    }
    return acc;
  }, []);
};


const Scale = (_name, _flags = []) => {
  const name = _name;
  const flags = [..._flags];
  const noOfNotes = flags.reduce((acc, cur) => acc + (cur ? 1 : 0), 0);

  return {
    toModeFlags: (modeNo) => flagsToModeFlags(flags, noOfNotes, modeNo),
    flagsToIntervals: (noOfIntervals) => flagsToIntervals(flags, noOfIntervals),
    flagsToPositions: (noOfPositions) => flagsToPositions(flags, noOfPositions),
    getName: () => name,
    getFlags: () => [...flags],
    getNoOfNotes: () => noOfNotes
  };
};

const scaleNames = ['Major', 'Harmonic Minor', 'Harmonic Major', 'Melodic Minor'];

const majorScaleModeNames         = ['Ionian (Major)', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian (Natural Minor)', 'Locrian'];
const harmonicMinorScaleModeNames = ['Augmented Major', 'Altered Dorian', 'Phrygian Dominant', 'Lydian #2', 'Super Locrian bb7', 'Aeolian #7 (Harmonic Minor)', 'Locrian #6'];
const harmonicMajorScaleModeNames = ['Ionian b6 (Harmonic Major)', 'Dorian b5', 'Phrygian b4', 'Lydian b3', 'Mixolydian b2', 'Lydian Augmented #2', 'Locrian bb7'];
const melodicMinorScaleModeNames  = ['Ionian b3 (Melodic Minor)', 'Dorian b2', 'Lydian Augmented', 'Lydian Dominant', 'Mixolydian b6', 'Aeolian b5', 'Super Locrian'];

const scaleModeNames = [majorScaleModeNames, harmonicMinorScaleModeNames, harmonicMajorScaleModeNames, melodicMinorScaleModeNames];

const flagsToStr = (flags) => flags.map((flag) => Number(Boolean(flag))).join('');
const flagsFromStr = (flagsStr) => flagsStr.split('').map((flagStr) => Boolean(Number(flagStr)));
const majorFlags                = flagsFromStr('101011010101');
const minorFlags                = flagsFromStr('101101011010'); // Major with b3 b6 b7
const harmonicMinorFlags        = flagsFromStr('101101011001'); // Minor with #7
const harmonicMinorIonianFlags  = flagsFromStr('101011001101'); // Harmonic Minor mode 3 (From Aeolian to Ionian)
const harmonicMajorFlags        = flagsFromStr('101011011001'); // Harmonic Minor with #3
const melodicMinorFlags         = flagsFromStr('101101010101'); // Harmonic Minor with #6

const majorScale                = Scale(scaleNames[0], majorFlags);
const harmonicMinorIonianScale  = Scale(scaleNames[1], harmonicMinorIonianFlags);
const harmonicMajorScale        = Scale(scaleNames[2], harmonicMajorFlags);
const melodicMinorScale         = Scale(scaleNames[3], melodicMinorFlags);

const scales = [majorScale, harmonicMinorIonianScale, harmonicMajorScale, melodicMinorScale];


export {
  NOTE_NAMES, NOTE_NAME_INDEX, NOTES_PER_OCTAVE,
  Scale,
  scaleNames,
  majorScaleModeNames, harmonicMinorScaleModeNames, harmonicMajorScaleModeNames, melodicMinorScaleModeNames, scaleModeNames,
  flagsToStr, flagsFromStr, majorFlags, minorFlags, harmonicMinorFlags, harmonicMinorIonianFlags, harmonicMajorFlags, melodicMinorFlags,
  majorScale, harmonicMinorIonianScale, harmonicMajorScale, melodicMinorScale,
  scales
};

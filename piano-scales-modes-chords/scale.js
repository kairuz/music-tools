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


export default Scale;

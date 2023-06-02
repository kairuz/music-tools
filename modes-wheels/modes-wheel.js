import {dragRotatableElem} from "./drag-rotate.js";


const majorScaleFlags         = [true,  false,  true,   false,  true,   true,   false,  true, false,  true,   false,  true];
const harmonicMinorScaleFlags = [                       true,   false,  true,   false,  true, true,   false,  false,  true,   true,  false,  true];
const harmonicMajorScaleFlags = [true,  false,  true,   false,  true,   true,   false,  true, true,   false,  false,  true];
const melodicMinorScaleFlags  = [true,  false,  true,   true,   false,  true,   false,  true, false,  true,   false,  true];
const majorScaleModes         = ['ionian',    'dorian',     'phrygian',     'lydian',     'mixolydian',     'aeolian',    'locrian'];
const harmonicMinorScaleModes = ['ionian #5', 'dorian #4',  'phrygian #3',  'lydian #2',  'mixolydian #1',  'aeolian #7', 'locrian #6'];
const harmonicMajorScaleModes = ['ionian b6', 'dorian b5',  'phrygian b4',  'lydian b3',  'mixolydian b2',  'aeolian b1', 'locrian b7'];
const melodicMinorScaleModes  = ['ionian #1', 'dorian #7',  'phrygian #6',  'lydian #5',  'mixolydian #4',  'aeolian #3', 'locrian #2'];

const ModesWheel = (name, scaleFlags, modes, colors, modesWheelDiv) => {
  const noteNames = [
    '<br />C',
    '<br />C#<br />Db',
    '<br />D',
    '<br />D#<br />Eb',
    '<br />E',
    '<br />F',
    '<br />F#<br />Gb',
    '<br />G',
    '<br />G#<br />Ab',
    '<br />A',
    '<br />A#<br />Bb',
    '<br />B'
  ];

  const style = document.styleSheets[0].cssRules[0].style;
  const keyWheelSize = Number(style.getPropertyValue('--key-wheel-size'));

  /* need PI and trig in css */
  style.setProperty('--key-width', `${2 * (keyWheelSize / 2) * Math.tan(Math.PI/12)}`);

  const modesWheelParentDiv = document.createElement('div');
  modesWheelParentDiv.classList.add('modes-wheel-parent');

  const modeWheelDiv = document.createElement('div');
  modeWheelDiv.classList.add('mode-wheel');
  modesWheelParentDiv.appendChild(modeWheelDiv);
  const modeWheelDivStyle = modeWheelDiv.style;
  dragRotatableElem(modeWheelDiv, (angleRotation) => modeWheelDivStyle.setProperty('transform', `rotate(${angleRotation}deg)`), modesWheelDiv);

  const modeIterator = modes[Symbol.iterator]();
  const colorsIterator = colors[Symbol.iterator]();

  scaleFlags.forEach((majorScaleFlag, i) => {
    if (!scaleFlags[i]) {
      return;
    }
    const modeDiv = document.createElement('div');
    const rotation = (360 / scaleFlags.length) * i;

    modeDiv.classList.add('mode');
    modeDiv.style.setProperty('transform', `rotate(${rotation}deg)`);
    modeDiv.style.setProperty('background', colorsIterator.next().value);
    modeDiv.appendChild(document.createTextNode(modeIterator.next().value));
    modeWheelDiv.appendChild(modeDiv);
  });

  const keyWheelDiv = document.createElement('div');
  keyWheelDiv.classList.add('key-wheel');
  modesWheelParentDiv.appendChild(keyWheelDiv);
  const keyWheelDivStyle = keyWheelDiv.style;
  dragRotatableElem(keyWheelDiv, (angleRotation) => keyWheelDivStyle.setProperty('transform', `rotate(${angleRotation}deg)`), modesWheelDiv);

  scaleFlags.forEach((majorScaleFlag, i) => {
    const keyDiv = document.createElement('div');
    const rotation = (360 / scaleFlags.length) * i;
    keyDiv.classList.add('key');
    keyDiv.classList.add(majorScaleFlags[i] === true ? 'key-diatonic' : 'key-accidental');
    keyDiv.style.setProperty('transform', `rotate(${rotation}deg)`);
    keyWheelDiv.appendChild(keyDiv);

    const keyLabelDiv = document.createElement('div');
    keyLabelDiv.innerHTML = noteNames[i];
    keyLabelDiv.classList.add('key-label');
    keyLabelDiv.classList.add(majorScaleFlags[i] === true ? 'key-label-diatonic' : 'key-label-accidental');
    keyLabelDiv.style.setProperty('transform', `rotate(${rotation}deg)`);
    keyWheelDiv.appendChild(keyLabelDiv);

    if (majorScaleFlags[i] === true) {
      const prevIndex = i === 0 ? majorScaleFlags.length - 1 : i - 1;

      if (majorScaleFlags[prevIndex] === true) {
        const keyLeftDividerDiatonicDiv = document.createElement('div');
        keyLeftDividerDiatonicDiv.classList.add('key-left-divider-diatonic');
        keyLeftDividerDiatonicDiv.style.setProperty('transform', `rotate(${rotation}deg) skew(15deg)`);
        keyWheelDiv.appendChild(keyLeftDividerDiatonicDiv);
      }
      else {
        const keyLeftDividerAccidentalDiv = document.createElement('div');
        keyLeftDividerAccidentalDiv.classList.add('key-left-divider-accidental');
        keyLeftDividerAccidentalDiv.style.setProperty('transform', `rotate(${rotation}deg) skew(30deg)`);
        keyWheelDiv.appendChild(keyLeftDividerAccidentalDiv);
      }
    }
  });

  const keyCenterWheelDiv = document.createElement('div');
  keyCenterWheelDiv.classList.add('key-center-wheel');
  keyWheelDiv.appendChild(keyCenterWheelDiv);

  const centerWheelDiv = document.createElement('div');
  centerWheelDiv.classList.add('center-wheel');
  centerWheelDiv.innerHTML = name;
  modesWheelParentDiv.appendChild(centerWheelDiv);

  return {
    getParentDiv: () => modesWheelParentDiv
  };

};

export {
  majorScaleFlags, harmonicMinorScaleFlags, harmonicMajorScaleFlags, melodicMinorScaleFlags,
  majorScaleModes, harmonicMinorScaleModes, harmonicMajorScaleModes, melodicMinorScaleModes,
  ModesWheel
};

import {NOTES_PER_OCTAVE, NOTE_NAMES} from '../music.js';


//               frets:          strings:
// vert-right:   right to left,  top to bottom
// vert-left:    left to right,  top to bottom
// horiz-right:  top to bottom,  left to right
// horiz-left:   top to bottom,  right to left

const NO_OF_NOTES = 108;

const FretboardLayoutManager = (
    fretBarDivs,
    fretMarkerDivs,
    fretMarkers,
    guitarstringDivs,
    noteDivs,
    chordNameDiv,
    muteDivPairs,
    fretboardDiv,
    guitarstrings,
    fretWidth,
    fretBarWidth,
    guitarstringSpace,
    noOfFrets,
    noteDivSize,
    fretMarkerDivSize,
    muteNoteDivSize,
    neckWidth,
    fretboardBorderSize,
    chordNameDivSize
) => {

  const loadVerticalRightHanded = () => {
    fretboardDiv.style['width'] = `${guitarstringSpace * guitarstrings.length}px`;
    fretboardDiv.style['height'] = `${fretWidth * (noOfFrets - 1)}px`;

    chordNameDiv.style['left'] = `${neckWidth + (fretboardBorderSize * 1.5)}px`;
    chordNameDiv.style['bottom'] = `calc(50% - ${chordNameDivSize / 2}px)`;
    chordNameDiv.style['top'] = null;
    chordNameDiv.style['text-align'] = 'left';

    fretBarDivs.forEach((fretBarDiv, i) => {
      if (i === 0) {
        return;
      }
      fretBarDiv.style['left'] = null;
      fretBarDiv.style['top'] = `${i * fretWidth}px`;
      fretBarDiv.style['right'] = '0';
      fretBarDiv.style['height'] = `${fretBarWidth}px`;
      fretBarDiv.style['width'] = `${guitarstringSpace * guitarstrings.length}px`;
    });

    fretMarkerDivs.forEach((fretMarkerDiv, i) => {
      if ((i + 1) % fretMarkers.length === 0) {
        const [fretMarkerDivTop, fretMarkerDivBottom] = fretMarkerDiv;
        fretMarkerDivTop.style['left'] = null;
        fretMarkerDivTop.style['bottom'] = null;
        const fretMarkerDivTopTopPx = (12 * Math.trunc((i + 1) / fretMarkers.length) * fretWidth) +
                                       (fretMarkers[(i + 1) % fretMarkers.length] * fretWidth) - (fretWidth / 2) - (fretMarkerDivSize / 2);
        fretMarkerDivTop.style['top'] = `${fretMarkerDivTopTopPx}px`;
        fretMarkerDivTop.style['right'] = `${guitarstringSpace - (fretMarkerDivSize / 2)}px`;

        fretMarkerDivBottom.style['right'] = null;
        fretMarkerDivBottom.style['bottom'] = null;
        const fretMarkerDivBottomTopPx = (12 * Math.trunc((i + 1) / fretMarkers.length) * fretWidth) +
                                          (fretMarkers[(i + 1) % fretMarkers.length] * fretWidth) - (fretWidth / 2) - (fretMarkerDivSize / 2)
        fretMarkerDivBottom.style['top'] = `${fretMarkerDivBottomTopPx}px`;
        fretMarkerDivBottom.style['left'] = `${guitarstringSpace - (fretMarkerDivSize / 2)}px`;
      }
      else {
        fretMarkerDiv.style['right'] = null;
        fretMarkerDiv.style['bottom'] = null;
        const fretMarkerDivTopPx = (12 * Math.trunc((i + 1) / fretMarkers.length) * fretWidth) +
                                    (fretMarkers[(i + 1) % fretMarkers.length] * fretWidth) - (fretWidth / 2) - (fretMarkerDivSize / 2);
        fretMarkerDiv.style['top'] = `${fretMarkerDivTopPx}px`;
        fretMarkerDiv.style['left'] = `${((guitarstringSpace * guitarstrings.length) / 2) - (fretMarkerDivSize / 2)}px`;
      }
    });

    guitarstringDivs.forEach((guitarstringDiv, i) => {
      const guitarstringDivWidth = ((NO_OF_NOTES / 1.5) - ((guitarstrings[i][0] * NOTES_PER_OCTAVE) + NOTE_NAMES.indexOf(guitarstrings[i][1]))) * 0.1;
      const guitarstringDivCenter = ((guitarstringSpace / 2) - (guitarstringDivWidth / 2));
      guitarstringDiv.style['left'] = null;
      guitarstringDiv.style['right'] = `${guitarstringDivCenter + (i * guitarstringSpace)}px`;
      guitarstringDiv.style['top'] = '0';
      guitarstringDiv.style['width'] = `${guitarstringDivWidth}px`;
      guitarstringDiv.style['height'] = `${(fretWidth * (noOfFrets - 1)) + fretBarWidth}px`;
    });

    noteDivs.forEach((noteDivI, i) => {
      noteDivI.forEach((noteDiv, j) => {
        noteDiv.style['left'] = null;
        noteDiv.style['right'] = `${((guitarstringSpace / 2) - (noteDivSize / 2)) + (i * guitarstringSpace)}px`;
        if (j === 0) {
          noteDiv.style['top'] = null;
          noteDiv.style['bottom'] = `${fretWidth * (noOfFrets - 1)}px`;
        }
        else {
          noteDiv.style['bottom'] = null;
          noteDiv.style['top'] = `${(fretWidth * (j - 1)) + ((fretWidth / 2) - (noteDivSize / 2))}px`;
        }
      });
    });

    muteDivPairs.forEach((muteDivPair, i) => {
      muteDivPair.forEach((muteDiv) => {
        muteDiv.style['left'] = null;
        muteDiv.style['right'] = `${(guitarstringSpace / 2) + (i * guitarstringSpace) - (muteNoteDivSize / 2)}px`;
        muteDiv.style['top'] = null;
        muteDiv.style['bottom'] = `${fretWidth * (noOfFrets - 1)}px`;
      });
    });
  };

  const loadVerticalLeftHanded = () => {
    fretboardDiv.style['width'] = `${guitarstringSpace * guitarstrings.length}px`;
    fretboardDiv.style['height'] = `${fretWidth * (noOfFrets - 1)}px`;

    chordNameDiv.style['left'] = `${neckWidth + (fretboardBorderSize * 1.5)}px`;
    chordNameDiv.style['bottom'] = `calc(50% - ${chordNameDivSize/2}px)`;
    chordNameDiv.style['top'] = null;
    chordNameDiv.style['text-align'] = 'left';

    fretBarDivs.forEach((fretBarDiv, i) => {
      if (i === 0) {
        return;
      }
      fretBarDiv.style['right'] = null;
      fretBarDiv.style['top'] = `${i * fretWidth}px`;
      fretBarDiv.style['left'] = '0';
      fretBarDiv.style['height'] = `${fretBarWidth}px`;
      fretBarDiv.style['width'] = `${guitarstringSpace * guitarstrings.length}px`;
    });

    fretMarkerDivs.forEach((fretMarkerDiv, i) => {
      if ((i + 1) % fretMarkers.length === 0) {
        const [fretMarkerDivTop, fretMarkerDivBottom] = fretMarkerDiv;
        fretMarkerDivTop.style['right'] = null;
        fretMarkerDivTop.style['bottom'] = null;
        const fretMarkerDivTopTopPx = (12 * Math.trunc((i + 1) / fretMarkers.length) * fretWidth) +
                                      (fretMarkers[(i + 1) % fretMarkers.length] * fretWidth) - (fretWidth / 2) - (fretMarkerDivSize / 2);
        fretMarkerDivTop.style['top'] = `${fretMarkerDivTopTopPx}px`;
        fretMarkerDivTop.style['left'] = `${guitarstringSpace - (fretMarkerDivSize / 2)}px`;

        fretMarkerDivBottom.style['left'] = null;
        fretMarkerDivBottom.style['bottom'] = null;
        const fretMarkerDivBottomTopPx = (12 * Math.trunc((i + 1) / fretMarkers.length) * fretWidth) +
                                         (fretMarkers[(i + 1) % fretMarkers.length] * fretWidth) - (fretWidth / 2) - (fretMarkerDivSize / 2)
        fretMarkerDivBottom.style['top'] = `${fretMarkerDivBottomTopPx}px`;
        fretMarkerDivBottom.style['right'] = `${guitarstringSpace - (fretMarkerDivSize / 2)}px`;
      }
      else {
        fretMarkerDiv.style['left'] = null;
        fretMarkerDiv.style['bottom'] = null;
        const fretMarkerDivTopPx = (12 * Math.trunc((i + 1) / fretMarkers.length) * fretWidth) +
                                   (fretMarkers[(i + 1) % fretMarkers.length] * fretWidth) - (fretWidth / 2) - (fretMarkerDivSize / 2);
        fretMarkerDiv.style['top'] = `${fretMarkerDivTopPx}px`;
        fretMarkerDiv.style['right'] = `${((guitarstringSpace * guitarstrings.length) / 2) - (fretMarkerDivSize / 2)}px`;
      }
    });

    guitarstringDivs.forEach((guitarstringDiv, i) => {
      const guitarstringDivWidth = ((NO_OF_NOTES / 1.5) - ((guitarstrings[i][0] * NOTES_PER_OCTAVE) + NOTE_NAMES.indexOf(guitarstrings[i][1]))) * 0.1;
      const guitarstringDivCenter = ((guitarstringSpace / 2) - (guitarstringDivWidth / 2));
      guitarstringDiv.style['right'] = null;
      guitarstringDiv.style['left'] = `${guitarstringDivCenter + (i * guitarstringSpace)}px`;
      guitarstringDiv.style['top'] = '0';
      guitarstringDiv.style['width'] = `${guitarstringDivWidth}px`;
      guitarstringDiv.style['height'] = `${(fretWidth * (noOfFrets - 1)) + fretBarWidth}px`;
    });

    noteDivs.forEach((noteDivI, i) => {
      noteDivI.forEach((noteDiv, j) => {
        noteDiv.style['right'] = null;
        noteDiv.style['left'] = `${((guitarstringSpace / 2) - (noteDivSize / 2)) + (i * guitarstringSpace)}px`;
        if (j === 0) {
          noteDiv.style['top'] = null;
          noteDiv.style['bottom'] = `${fretWidth * (noOfFrets - 1)}px`;
        }
        else {
          noteDiv.style['bottom'] = null;
          noteDiv.style['top'] = `${(fretWidth * (j - 1)) + ((fretWidth / 2) - (noteDivSize / 2))}px`;
        }
      });
    });

    muteDivPairs.forEach((muteDivPair, i) => {
      muteDivPair.forEach((muteDiv) => {
        muteDiv.style['left'] = `${(guitarstringSpace / 2) + (i * guitarstringSpace) - (muteNoteDivSize / 2)}px`;
        muteDiv.style['right'] = null;
        muteDiv.style['top'] = null;
        muteDiv.style['bottom'] = `${fretWidth * (noOfFrets - 1)}px`;
      });
    });
  };

  const loadHorizontalRightHanded = () => {
    fretboardDiv.style['height'] = `${guitarstringSpace * guitarstrings.length}px`;
    fretboardDiv.style['width'] = `${fretWidth * (noOfFrets - 1)}px`;

    chordNameDiv.style['right'] = `calc(50% - ${chordNameDivSize/2}px)`;
    chordNameDiv.style['left'] = null;
    chordNameDiv.style['top'] = `${neckWidth + (fretboardBorderSize * 1.5)}px`;
    chordNameDiv.style['text-align'] = 'center';

    fretBarDivs.forEach((fretBarDiv, i) => {
      if (i === 0) {
        return;
      }
      fretBarDiv.style['right'] = null;
      fretBarDiv.style['left'] = `${i * fretWidth}px`;
      fretBarDiv.style['top'] = '0';
      fretBarDiv.style['width'] = `${fretBarWidth}px`;
      fretBarDiv.style['height'] = `${guitarstringSpace * guitarstrings.length}px`;
    });

    fretMarkerDivs.forEach((fretMarkerDiv, i) => {
      if ((i + 1) % fretMarkers.length === 0) {
        const [fretMarkerDivTop, fretMarkerDivBottom] = fretMarkerDiv;
        fretMarkerDivTop.style['right'] = null;
        fretMarkerDivTop.style['top'] = null;
        const fretMarkerDivTopLeftPx = (12 * Math.trunc((i + 1) / fretMarkers.length) * fretWidth) +
                                       (fretMarkers[(i + 1) % fretMarkers.length] * fretWidth) - (fretWidth / 2) - (fretMarkerDivSize / 2);
        fretMarkerDivTop.style['left'] = `${fretMarkerDivTopLeftPx}px`;
        fretMarkerDivTop.style['bottom'] = `${guitarstringSpace - (fretMarkerDivSize / 2)}px`;

        fretMarkerDivBottom.style['right'] = null;
        fretMarkerDivBottom.style['bottom'] = null;
        const fretMarkerDivBottomLeftPx = (12 * Math.trunc((i + 1) / fretMarkers.length) * fretWidth) +
                                          (fretMarkers[(i + 1) % fretMarkers.length] * fretWidth) - (fretWidth / 2) - (fretMarkerDivSize / 2);
        fretMarkerDivBottom.style['left'] = `${fretMarkerDivBottomLeftPx}px`;
        fretMarkerDivBottom.style['top'] = `${guitarstringSpace - (fretMarkerDivSize / 2)}px`;
      }
      else {
        fretMarkerDiv.style['right'] = null;
        fretMarkerDiv.style['bottom'] = null;
        const fretMarkerDivLeftPx = (12 * Math.trunc((i + 1) / fretMarkers.length) * fretWidth) +
                                    (fretMarkers[(i + 1) % fretMarkers.length] * fretWidth) - (fretWidth / 2) - (fretMarkerDivSize / 2);
        fretMarkerDiv.style['left'] = `${fretMarkerDivLeftPx}px`;
        fretMarkerDiv.style['top'] = `${((guitarstringSpace * guitarstrings.length) / 2) - (fretMarkerDivSize / 2)}px`;
      }
    });

    guitarstringDivs.forEach((guitarstringDiv, i) => {
      const guitarstringDivWidth = ((NO_OF_NOTES / 1.5) - ((guitarstrings[i][0] * NOTES_PER_OCTAVE) + NOTE_NAMES.indexOf(guitarstrings[i][1]))) * 0.1;
      const guitarstringDivCenter = ((guitarstringSpace / 2) - (guitarstringDivWidth / 2));
      guitarstringDiv.style['right'] = null;
      guitarstringDiv.style['top'] = `${guitarstringDivCenter + (i * guitarstringSpace)}px`;
      guitarstringDiv.style['left'] = '0';
      guitarstringDiv.style['height'] = `${guitarstringDivWidth}px`;
      guitarstringDiv.style['width'] = `${(fretWidth * (noOfFrets - 1)) + fretBarWidth}px`;
    });

    noteDivs.forEach((noteDivI, i) => {
      noteDivI.forEach((noteDiv, j) => {
        noteDiv.style['bottom'] = null;
        noteDiv.style['top'] = `${((guitarstringSpace / 2) - (noteDivSize / 2)) + (i * guitarstringSpace)}px`;
        if (j === 0) {
          noteDiv.style['left'] = null;
          noteDiv.style['right'] = `${fretWidth * (noOfFrets - 1)}px`;
        }
        else {
          noteDiv.style['right'] = null;
          noteDiv.style['left'] = `${(fretWidth * (j - 1)) + ((fretWidth / 2) - (noteDivSize / 2))}px`;
        }
      });
    });

    muteDivPairs.forEach((muteDivPair, i) => {
      muteDivPair.forEach((muteDiv) => {
        muteDiv.style['bottom'] = null;
        muteDiv.style['top'] = `${((guitarstringSpace / 2) - (noteDivSize / 2)) + (i * guitarstringSpace)}px`;
        muteDiv.style['left'] = null;
        muteDiv.style['right'] = `${fretWidth * (noOfFrets - 1) + (noteDivSize / 2) - (muteNoteDivSize / 2)}px`;
      });
    });
  };

  const loadHorizontalLeftHanded = () => {
    fretboardDiv.style['height'] = `${guitarstringSpace * guitarstrings.length}px`;
    fretboardDiv.style['width'] = `${fretWidth * (noOfFrets - 1)}px`;

    chordNameDiv.style['right'] = `calc(50% - ${chordNameDivSize/2}px)`;
    chordNameDiv.style['left'] = null;
    chordNameDiv.style['top'] = `${neckWidth + (fretboardBorderSize * 1.5)}px`;
    chordNameDiv.style['text-align'] = 'center';

    fretBarDivs.forEach((fretBarDiv, i) => {
      if (i === 0) {
        return;
      }
      fretBarDiv.style['left'] = null;
      fretBarDiv.style['right'] = `${i * fretWidth}px`;
      fretBarDiv.style['top'] = '0';
      fretBarDiv.style['width'] = `${fretBarWidth}px`;
      fretBarDiv.style['height'] = `${guitarstringSpace * guitarstrings.length}px`;
    });

    fretMarkerDivs.forEach((fretMarkerDiv, i) => {
      if ((i + 1) % fretMarkers.length === 0) {
        const [fretMarkerDivTop, fretMarkerDivBottom] = fretMarkerDiv;
        fretMarkerDivTop.style['left'] = null;
        fretMarkerDivTop.style['top'] = null;
        const fretMarkerDivTopRightPx = (12 * Math.trunc((i + 1) / fretMarkers.length) * fretWidth) +
                                       (fretMarkers[(i + 1) % fretMarkers.length] * fretWidth) - (fretWidth / 2) - (fretMarkerDivSize / 2);
        fretMarkerDivTop.style['right'] = `${fretMarkerDivTopRightPx}px`;
        fretMarkerDivTop.style['bottom'] = `${guitarstringSpace - (fretMarkerDivSize / 2)}px`;

        fretMarkerDivBottom.style['left'] = null;
        fretMarkerDivBottom.style['bottom'] = null;
        const fretMarkerDivBottomRightPx = (12 * Math.trunc((i + 1) / fretMarkers.length) * fretWidth) +
                                          (fretMarkers[(i + 1) % fretMarkers.length] * fretWidth) - (fretWidth / 2) - (fretMarkerDivSize / 2)
        fretMarkerDivBottom.style['right'] = `${fretMarkerDivBottomRightPx}px`;
        fretMarkerDivBottom.style['top'] = `${guitarstringSpace - (fretMarkerDivSize / 2)}px`;
      }
      else {
        fretMarkerDiv.style['left'] = null;
        fretMarkerDiv.style['bottom'] = null;
        const fretMarkerDivRightPx = (12 * Math.trunc((i + 1) / fretMarkers.length) * fretWidth) +
                                    (fretMarkers[(i + 1) % fretMarkers.length] * fretWidth) - (fretWidth / 2) - (fretMarkerDivSize / 2);
        fretMarkerDiv.style['right'] = `${fretMarkerDivRightPx}px`;
        fretMarkerDiv.style['top'] = `${((guitarstringSpace * guitarstrings.length) / 2) - (fretMarkerDivSize / 2)}px`;
      }
    });

    guitarstringDivs.forEach((guitarstringDiv, i) => {
      const guitarstringDivWidth = ((NO_OF_NOTES / 1.5) - ((guitarstrings[i][0] * NOTES_PER_OCTAVE) + NOTE_NAMES.indexOf(guitarstrings[i][1]))) * 0.1;
      const guitarstringDivCenter = ((guitarstringSpace / 2) - (guitarstringDivWidth / 2));
      guitarstringDiv.style['left'] = null;
      guitarstringDiv.style['top'] = `${guitarstringDivCenter + (i * guitarstringSpace)}px`;
      guitarstringDiv.style['right'] = '0';
      guitarstringDiv.style['height'] = `${guitarstringDivWidth}px`;
      guitarstringDiv.style['width'] = `${(fretWidth * (noOfFrets - 1)) + fretBarWidth}px`;
    });

    noteDivs.forEach((noteDivI, i) => {
      noteDivI.forEach((noteDiv, j) => {
        noteDiv.style['bottom'] = null;
        noteDiv.style['top'] = `${((guitarstringSpace / 2) - (noteDivSize / 2)) + (i * guitarstringSpace)}px`;

        if (j === 0) {
          noteDiv.style['right'] = null;
          noteDiv.style['left'] = `${fretWidth * (noOfFrets - 1)}px`;
        }
        else {
          noteDiv.style['left'] = null;
          noteDiv.style['right'] = `${(fretWidth * (j - 1)) + ((fretWidth / 2) - (noteDivSize / 2))}px`;
        }
      });
    });

    muteDivPairs.forEach((muteDivPair, i) => {
      muteDivPair.forEach((muteDiv) => {
        muteDiv.style['bottom'] = null;
        muteDiv.style['top'] = `${((guitarstringSpace / 2) - (noteDivSize / 2)) + (i * guitarstringSpace)}px`;
        muteDiv.style['right'] = null;
        muteDiv.style['left'] = `${fretWidth * (noOfFrets - 1) + (noteDivSize / 2) - (muteNoteDivSize / 2)}px`;
      });
    });
  };

  return {
    loadVerticalRightHanded,
    loadVerticalLeftHanded,
    loadHorizontalRightHanded,
    loadHorizontalLeftHanded
  }
};


export default FretboardLayoutManager;

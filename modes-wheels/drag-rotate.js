const radToDeg = (radians) => radians * (180 / Math.PI);
const degToRad = (degrees) => degrees * (Math.PI / 180);


const dragRotatableElem = (elem, dragRotateCallback, modesWheelDiv) => {
  let rotation = 0;
  let angle = rotation;
  let isDragging = false;
  let mouseDownAngle = angle;
  const center = [0, 0];

  const startMove = (e) => {
    e.preventDefault();
    e.target.setPointerCapture(e.pointerId);
    const clientRect = elem.getBoundingClientRect();
    center[0] = clientRect.left + (clientRect.width / 2);
    center[1] = clientRect.top + (clientRect.height / 2);

    isDragging = true;
    elem.addEventListener('pointermove', move);

    const x = e.clientX - center[0];
    const y = e.clientY - center[1];
    mouseDownAngle = radToDeg(Math.atan2(y, x));

  };

  const move = (e) => {
    if (isDragging) {
      const x = e.clientX - center[0];
      const y = e.clientY - center[1];
      rotation = radToDeg(Math.atan2(y, x)) - mouseDownAngle;
      dragRotateCallback(angle + rotation);
    }
  };

  const endMove = (e) => {
    e.target.releasePointerCapture(e.pointerId);
    if (isDragging) {
      angle += rotation;
      isDragging = false;

    }
    elem.removeEventListener('pointermove', move);
  };

  elem.addEventListener('pointerdown', startMove);
  // elem.addEventListener('pointermove', move);
  elem.addEventListener('pointerup', endMove);
  elem.addEventListener('pointercancel', endMove);

  return {
    setAngleRotation: (_rotation) => {
      console.log(`_rotation=${_rotation},Math.tan(_rotation)`);
      rotation = radToDeg(Math.tan(_rotation));
      angle += radToDeg(Math.tan(_rotation));
    }
  };
};

export {dragRotatableElem, radToDeg, degToRad};

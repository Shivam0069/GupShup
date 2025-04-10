import React from "react";
import ReactDOM from "react-dom";
function PhotoPicker({ onChange }) {
  const component = (
    <input type="file" onChange={onChange} hidden id="photo_picker" />
  );
  return ReactDOM.createPortal(
    component,
    document.getElementById("photo_picker_element")
  );
}

export default PhotoPicker;

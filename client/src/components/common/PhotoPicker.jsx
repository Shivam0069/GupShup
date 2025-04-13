import React from "react";
import ReactDOM from "react-dom";
function PhotoPicker({ onChange }) {
  const fileChangeHandler = (e) => {
    onChange(e);
  };
  const component = (
    <input
      type="file"
      onChange={(e) => fileChangeHandler(e)}
      hidden
      id="photo_picker"
    />
  );
  return ReactDOM.createPortal(
    component,
    document.getElementById("photo_picker_element")
  );
}

export default PhotoPicker;

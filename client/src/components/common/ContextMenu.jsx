import React, { useEffect, useRef } from "react";

function ContextMenu({ options, coordinates, contextMenu, setContextMenu }) {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.id !== "context_opener") {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(event.target)
        ) {
          setContextMenu(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClick = (e, callback) => {
    e.stopPropagation();
    setContextMenu(false);
    callback();
  };
  return (
    <div
      className={`bg-dropdown-background fixed  z-[100]  shadow-xl `}
      ref={contextMenuRef}
      style={{
        top: coordinates.y,
        left: coordinates.x,
      }}
    >
      <ul>
        {options.map(({ name, callback }) => (
          <li
            key={name}
            className="px-5 py-2 hover:bg-background-default-hover cursor-pointer "
            onClick={(e) => {
              handleClick(e, callback);
            }}
          >
            <span className="text-white ">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;

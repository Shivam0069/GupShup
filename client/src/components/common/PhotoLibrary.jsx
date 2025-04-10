import Image from "next/image";
import React from "react";
import { IoClose } from "react-icons/io5";
function PhotoLibrary({ setImage, hidePhotoLibrary }) {
  const images = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
    "/avatars/6.png",
    "/avatars/7.png",
    "/avatars/8.png",
    "/avatars/9.png",
  ];
  return (
    <div className="fixed top-0 left-0 max-h-[100vh] max-w-[100vw] h-full  w-full flex items-center justify-center ">
      <div className="h-max w-max bg-gray-900 gap-6 rounded-lg p-4">
        <div className="flex items-centers justify-between w-full ">
          <div className="text-3xl font-semibold flex-1 text-center">
            Choose From Library
          </div>
          <div className=" ">
            <IoClose
              onClick={() => hidePhotoLibrary(false)}
              className="h-10 w-10 cursor-pointer"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 justify-center items-center gap-16 p-20 py-10 w-full">
          {images.map((image, index) => (
            <div
              onClick={() => {
                setImage(images[index]);
                hidePhotoLibrary(false);
              }}
              key={index}
            >
              <div className="h-24 w-24 cursor-pointer relative hover:scale-110 transition-all duration-200 ease-in-out">
                <Image src={image} alt="avatar" fill />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotoLibrary;

import React, { useState } from "react";
import EmblaCarousel from "./Carousel";
import { useStore } from "@nanostores/react";
import { isColorGalleryAtom } from "@/store";


function ImageGallery({ slides }: any) {
  const isColorGallery = useStore(isColorGalleryAtom)

  return (
    <>
      <div className="bg-cerise h-3 w-full fixed top-0 left-0 z-[99]"></div>
    <div className="bg-dark background_noise_dark_firefox absolute z-[999] right-0 top-6   tablet:w-[92%] tablet:animate-grow-92 laptop:w-[90%] laptop:animate-grow-90 desktop:animate-grow-91 desktop:w-[91%]  fullhd:mx-auto flex w-[95%] animate-grow-95">
      <div style={isColorGallery ? { backgroundColor: isColorGallery + '99' } : {}} className={`absolute z-50 transition-color  top-0 left-0 w-full h-full duration-1000 ${!isColorGallery ? 'bg-raisinblack' : ''} `}>
        <div>
          <div className=" flex flex-row mt-7 py-2  justify-start items-center px-8 ">
            <div 
              className="flex items-center justify-center cursor-pointer  h-[5rem]  w-[5rem] transition duration-300 ease-in-out hover:brightness-125"
              onClick={() => window.history.back()}
              > 
              <span className="font-chrono text-[8rem] antialiased text-ocre translate-y-2" style={{lineHeight:0}}>{`<`}</span>
            </div> 
            <h1 className="not-prose text-[1.4rem] tablet:text-[1.5rem] desktop:text-[2.7rem] tablet:tracking-wide font-tommyMedium text-platinum  laptop:tracking-normal  cursor-default ">
              Macro Photography
            </h1>
          </div>
          <div className="flex justify-center">
          <p className="prose text-platinum text-center !mt-3">
          This gallery highlights my macro shots of bugs, focusing on capturing their character and connection with their environment. I patiently wait for the perfect moment when the insect blends naturally with its surroundings.
            </p>
            </div>
        </div>

        <EmblaCarousel slides={slides} />
      </div>
    </div>
              </>
  );
}

export default ImageGallery;

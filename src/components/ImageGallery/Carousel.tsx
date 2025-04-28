import React, { useEffect, useState } from 'react'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './ArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import { extractColors } from "extract-colors";

type PropType = {
  slides: string[],
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides } = props
  const [emblaRef, emblaApi] = useEmblaCarousel({})
  const [colors, setColors] = useState<string[]>([])
  

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
    imagesData, 
    setImagesData
  } = usePrevNextButtons(emblaApi)

  useEffect(() => {
    if (slides) {
      let imgs: { src: string, color: string }[] = []
      const promises = slides.map((element) =>
        extractColors(element, {
            pixels:200,
            saturationDistance:0.9,
            lightnessDistance:0.9
        })
          .then((col) => {
            imgs.push({
              src: element,
              color: col[1].hex,
            })
          })
          .catch(console.error)
      )
  
      Promise.all(promises).then(() => {
        console.log(imgs)
        setImagesData(imgs)
      })
    }
  }, [slides])

  return (
    <section className="m-auto max-w-[95vw] not-prose ">
      <div className="embla__viewport overflow-hidden h-[39rem] max-h-[40svh] tablet:max-h-[52svh] laptop:max-h-[55svh] desktop:max-h-[56svh]" ref={emblaRef}>
        <div className="embla__container flex  touch-pan-y touch-pinch-zoom ml-[-1rem] ">
          {imagesData && imagesData.map((photoURL) => (
            <div className="embla__slide flex grow-0 shrink-0 basis-[100%] items-center justify-center pl-[1rem] rounded-xl" key={photoURL.src}>
              <img src={photoURL.src} alt="" className='rounded-xl border-[1px] border-raisinblack shadow-dark border-opacity-20 flex items-center justify-center max-h-[40svh] tablet:max-h-[52svh] laptop:max-h-[55svh] desktop:max-h-[56svh] select-none object-cover'/>
            </div>
          ))}
        </div>
      </div>


        <div className="w-full flex justify-center gap-32 mt-10 desktop:mt-12">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
    </section>
  )
}

export default EmblaCarousel

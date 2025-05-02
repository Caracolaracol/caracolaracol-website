import React, { useRef } from "react";
import logo from "@/assets/logo.png";
function Navbar({ pathname }: any) {
  const refLinks = useRef<HTMLDivElement | any>(null);
  const handlerMouseLinks = (event: any) => {
    // BG ANIMATED OF FOOTER LINKS
    const { left, top, width, height }: any =
      event.target.getBoundingClientRect();
    refLinks.current.style.opacity = "1";
    refLinks.current.style.visibility = "visible";
    refLinks.current?.style.setProperty("--left", `${left}px`);
    refLinks.current?.style.setProperty("--top", `${top + 28}px`);
    refLinks.current?.style.setProperty("--width", `${width}px`);
    refLinks.current?.style.setProperty("--height", `${height - 22}px`);
  };

  const handlerLeaveLinks = () => {
    // Leave mouse of the footer links
    refLinks.current.style.opacity = "0";
    refLinks.current.style.visibility = "hidden";
  };
  return (
    <div>
      <ul className="flex justify-between w-[17rem] mx-auto  font-tommyMedium text-xl text-platinum items-center">
        <a href="/" className=" ml-4 z-50 tablet:mr-4 cursor-pointer">
          <img
            src={logo.src}
            className="w-16 scale-125 translate-x-6 tablet:translate-x-0 tablet:scale-100 translate-y-[1.1rem] tablet:translate-y-0 tablet:w-[3.9rem] drop-shadow-md transition-opacity-1 z-50"
            alt="caracol"
          />
        </a>
        <a
          href="/blog"
          className={`${
            pathname.includes("/blog") ? "bg-violetl" :"bg-violetl/20"
          }  hidden tablet:block cursor-pointer p-2 rounded-t-md rounded-bl-md`}
        >
          <li
            className=""
            onMouseEnter={handlerMouseLinks}
            onMouseLeave={handlerLeaveLinks}
          >
            Blog
          </li>
        </a>
        <a
          href="/portfolio"
          className={`${
            pathname.includes("/portfolio") ?
            "bg-cerise cursor-pointer transition-colors" : "bg-cerise/20 cursor-pointer transition-colors"
          } p-2 mr-4 tablet:mr-2 laptop:mr-0 rounded-t-md rounded-br-md`}
        >
          <li
            className=""
            onMouseEnter={handlerMouseLinks}
            onMouseLeave={handlerLeaveLinks}
          >
            Portfolio
          </li>
        </a>
      </ul>
      <div className="flex tablet:hidden justify-end w-[16rem] ">

      <a
          href="/blog"
          className={`${
              pathname.includes("/blog") ? "bg-violetl" :"bg-violetl/20"
            } tablet:hidden block cursor-pointer p-2 rounded-t-md rounded-br-md`}
            >
          <li
            className="list-none font-tommyMedium text-xl text-end"
            onMouseEnter={handlerMouseLinks}
            onMouseLeave={handlerLeaveLinks}
            >
            Blog
          </li>
        </a>
              </div>
      <div
        ref={refLinks}
        className={`bg-cerise absolute left-[var(--left)] top-[var(--top)] z-50 h-[var(--height)] w-[var(--width)] rounded-md opacity-25 backdrop-blur-lg transition-all duration-300 ease-in-out`}
      ></div>
    </div>
  );
}

export default Navbar;

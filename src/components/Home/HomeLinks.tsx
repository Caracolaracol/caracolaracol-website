import { useRef } from "react";

function HomeLinks() {
    const refLinks = useRef<HTMLDivElement | any>(null);
    const styles = "font-tommyLight text-base tablet:text-lg laptop:text-xl p-2";

    const handlerMouseLinks = (event: any) => {
        // BG ANIMATED OF FOOTER LINKS
        const { left, top, width, height }: any =
            event.target.getBoundingClientRect();
        refLinks.current.style.opacity = "1";
        refLinks.current.style.visibility = "visible";
        refLinks.current?.style.setProperty("--left", `${left}px`);
        refLinks.current?.style.setProperty("--top", `${top + 35}px`);
        refLinks.current?.style.setProperty("--width", `${width}px`);
        refLinks.current?.style.setProperty("--height", `${height - 40}px`);
    };

    const handlerLeaveLinks = () => {
        // Leave mouse of the footer links
        refLinks.current.style.opacity = "0";
        refLinks.current.style.visibility = "hidden";
    };
    
    return (
        <>
            <ul className="flex shrink gap-2 ">
                <li
                    className=""
                    onMouseEnter={handlerMouseLinks}
                    onMouseLeave={handlerLeaveLinks}
                >
                    <a
                        className={styles}
                        href="https://github.com/Caracolaracol"
                        target="_blank"
                    >
                        Github
                    </a>
                </li>
                <li onMouseEnter={handlerMouseLinks} onMouseLeave={handlerLeaveLinks}>
                    <a
                        className={styles}
                        href="https://www.linkedin.com/in/agustin-rojas-c4r4c01/"
                        target="_blank"
                    >
                        Linkedin
                    </a>
                </li>
                <li onMouseEnter={handlerMouseLinks} onMouseLeave={handlerLeaveLinks}>
                    <a
                        className={styles}
                        href="https://www.instagram.com/caracolaracol/"
                        target="_blank"
                    >
                        Instagram
                    </a>
                </li>
                <li onMouseEnter={handlerMouseLinks} onMouseLeave={handlerLeaveLinks}>
                    <a className={styles} href="/youtube">
                        Youtube
                    </a>
                </li>
            </ul>
            <div
                ref={refLinks}
                className={`bg-cerise/20 absolute left-[var(--left)] top-[var(--top)] -z-10 h-[var(--height)] w-[var(--width)] rounded-md opacity-0 backdrop-blur-lg transition-all duration-300 ease-in-out`}
            ></div>
        </>
    );
}

export default HomeLinks;

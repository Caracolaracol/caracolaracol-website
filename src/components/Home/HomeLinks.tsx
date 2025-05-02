import { useRef } from "react";

function HomeLinks() {
    const refLinks = useRef<HTMLDivElement>(null);
    const styles = "font-tommyLight text-base tablet:text-lg laptop:text-xl p-2";

    const handlerMouseLinks = (event: React.MouseEvent<HTMLLIElement>) => {
        const target = event.currentTarget;
        const { left, top, width, height } = target.getBoundingClientRect();
        if (refLinks.current) {
            refLinks.current.style.opacity = "1";
            refLinks.current.style.visibility = "visible";
            refLinks.current.style.setProperty("--left", `${left}px`);
            refLinks.current.style.setProperty("--top", `${top + 30}px`);
            refLinks.current.style.setProperty("--width", `${width}px`);
            refLinks.current.style.setProperty("--height", `${height - 24}px`);
        }
    };

    const handlerLeaveLinks = () => {
        if (refLinks.current) {
            refLinks.current.style.opacity = "0";
            refLinks.current.style.visibility = "hidden";
        }
    };
    
    return (
        <>
            <ul className="flex shrink gap-2 z-50 select-auto pointer-events-auto">
                <li
                    className="relative"
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
                <li 
                    className="relative"
                    onMouseEnter={handlerMouseLinks} 
                    onMouseLeave={handlerLeaveLinks}
                >
                    <a
                        className={styles}
                        href="https://www.linkedin.com/in/agustin-rojas-c4r4c01/"
                        target="_blank"
                    >
                        Linkedin
                    </a>
                </li>
                <li 
                    className="relative"
                    onMouseEnter={handlerMouseLinks} 
                    onMouseLeave={handlerLeaveLinks}
                >
                    <a
                        className={styles}
                        href="https://www.instagram.com/caracolaracol/"
                        target="_blank"
                    >
                        Instagram
                    </a>
                </li>
                <li 
                    className="relative"
                    onMouseEnter={handlerMouseLinks} 
                    onMouseLeave={handlerLeaveLinks}
                >
                    <a className={styles} href="/youtube">
                        Youtube
                    </a>
                </li>
            </ul>
            <div
                ref={refLinks}
                className="bg-cerise/20 absolute select-auto pointer-events-none left-[var(--left)] top-[var(--top)] -z-10 h-[var(--height)] w-[var(--width)] rounded-md opacity-0 backdrop-blur-lg transition-all duration-300 ease-in-out"
            ></div>
        </>
    );
}

export default HomeLinks;

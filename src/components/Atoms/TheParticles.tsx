import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
// import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
//import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.
import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.

const TheParticles = () => {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      await loadFull(engine);
      //await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      fpsLimit: 60,
      background: {
        opacity: 0,
      },
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          resize: { enable: true },
        },
        modes: {
          push: { quantity: 0.2 },
        },
      },

      particles: {
        color: { value: "#D94A6D"},
        move: {
          direction: "none",
          enable: true,
          outModes: "out",
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 1000,
          },
          value: 20,
        },
        shadow: {
          blur: 8,
          color: {
            value: {
              r: 227,
              g: 119,
              b: 25,
            },
          },
          enable: true,
        },
        opacity: {
          animation: {
            enable: true,
            speed: 0.05,
            sync: true,
            startValue: "max",
            count: 1,
            destroy: "min",
          },
          value: {
            min: 0,
            max: 0.8,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 0.01, max: 5 },
        },
      },
    }),
    []
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
    );
  }

  return <></>;
};

export default TheParticles;

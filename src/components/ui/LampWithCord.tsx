import { useEffect, useRef } from "react";

interface LampWithCordProps {
  onToggle: (isOn: boolean) => void;
  isOn: boolean;
}

export const LampWithCord = ({ onToggle, isOn }: LampWithCordProps) => {
  const lampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lampRef.current) return;

    // Wait for GSAP to be available
    const checkGSAP = setInterval(() => {
      if (window.gsap && window.MorphSVGPlugin && window.Draggable) {
        clearInterval(checkGSAP);
        initializeLamp();
      }
    }, 100);

    const initializeLamp = () => {
      const { gsap } = window;
      const { registerPlugin, set, to, timeline } = gsap;
      
      registerPlugin(window.MorphSVGPlugin);

      const CORDS = gsap.utils.toArray(".cords path");
      const CORD_DURATION = 0.1;
      const HIT = lampRef.current?.querySelector(".lamp__hit") as SVGElement;
      const DUMMY_CORD = lampRef.current?.querySelector(".cord--dummy") as SVGElement;
      const ENDX = DUMMY_CORD?.getAttribute("x2") || "124";
      const ENDY = DUMMY_CORD?.getAttribute("y2") || "348";
      
      let startX: number;
      let startY: number;

      const PROXY = document.createElement("div");

      const RESET = () => {
        set(PROXY, {
          x: ENDX,
          y: ENDY,
        });
      };
      RESET();

      gsap.set([".cords", HIT], {
        x: -10,
      });

      gsap.set(".lamp__eye", {
        rotate: isOn ? 0 : 180,
        transformOrigin: "50% 50%",
        yPercent: 50,
      });

      const CORD_TL = timeline({
        paused: true,
        onStart: () => {
          const newState = !isOn;
          const hue = gsap.utils.random(0, 359);
          
          set(lampRef.current, { 
            "--on": newState ? 1 : 0,
            "--shade-hue": hue,
            "--glow-color": `hsl(${hue}, 40%, 45%)`,
            "--glow-color-dark": `hsl(${hue}, 40%, 35%)`
          });

          set(".lamp__eye", {
            rotate: newState ? 0 : 180,
          });

          set([DUMMY_CORD, HIT], { display: "none" });
          set(CORDS[0], { display: "block" });
          
          onToggle(newState);
        },
        onComplete: () => {
          set([DUMMY_CORD, HIT], { display: "block" });
          set(CORDS[0], { display: "none" });
          RESET();
        },
      });

      for (let i = 1; i < CORDS.length; i++) {
        CORD_TL.add(
          to(CORDS[0], {
            morphSVG: CORDS[i],
            duration: CORD_DURATION,
            repeat: 1,
            yoyo: true,
          })
        );
      }

      window.Draggable.create(PROXY, {
        trigger: HIT,
        type: "x,y",
        onPress: (e: any) => {
          startX = e.x;
          startY = e.y;
        },
        onDrag: function (this: any) {
          set(DUMMY_CORD, {
            attr: {
              x2: this.x,
              y2: Math.max(400, this.y),
            },
          });
        },
        onRelease: function (this: any, e: any) {
          const DISTX = Math.abs(e.x - startX);
          const DISTY = Math.abs(e.y - startY);
          const TRAVELLED = Math.sqrt(DISTX * DISTX + DISTY * DISTY);
          to(DUMMY_CORD, {
            attr: { x2: ENDX, y2: ENDY },
            duration: CORD_DURATION,
            onComplete: () => {
              if (TRAVELLED > 50) {
                CORD_TL.restart();
              } else {
                RESET();
              }
            },
          });
        },
      });
    };

    return () => {
      clearInterval(checkGSAP);
    };
  }, [isOn, onToggle]);

  return (
    <div ref={lampRef} style={{ 
      "--on": isOn ? 1 : 0,
      "--cord": "hsl(210, 0%, calc((40 + (var(--on, 0) * 50)) * 1%))",
      "--opening": "hsl(50, calc((10 + (var(--on, 0) * 80)) * 1%), calc((20 + (var(--on, 0) * 70)) * 1%))",
      "--feature": "#0a0a0a",
      "--accent": "210",
      "--tongue": "#e06952",
      "--base-top": "hsl(var(--accent), 0%, calc((40 + (var(--on, 0) * 40)) * 1%))",
      "--base-side": "hsl(var(--accent), 0%, calc((20 + (var(--on, 0) * 40)) * 1%))",
      "--post": "hsl(var(--accent), 0%, calc((20 + (var(--on, 0) * 40)) * 1%))",
      "--b-1": "hsla(45, calc((0 + (var(--on, 0) * 0)) * 1%), calc((50 + (var(--on, 0) * 50)) * 1%), 0.85)",
      "--b-2": "hsla(45, calc((0 + (var(--on, 0) * 0)) * 1%), calc((20 + (var(--on, 0) * 30)) * 1%), 0.25)",
      "--b-3": "hsla(45, calc((0 + (var(--on, 0) * 0)) * 1%), calc((20 + (var(--on, 0) * 30)) * 1%), 0.5)",
      "--b-4": "hsla(45, calc((0 + (var(--on, 0) * 0)) * 1%), calc((20 + (var(--on, 0) * 30)) * 1%), 0.25)",
      "--l-1": "hsla(45, calc((0 + (var(--on, 0) * 20)) * 1%), calc((50 + (var(--on, 0) * 50)) * 1%), 0.85)",
      "--l-2": "hsla(45, calc((0 + (var(--on, 0) * 20)) * 1%), calc((50 + (var(--on, 0) * 50)) * 1%), 0.85)",
      "--shade-hue": "320",
      "--t-1": "hsl(var(--shade-hue), calc((0 + (var(--on, 0) * 20)) * 1%), calc((30 + (var(--on, 0) * 60)) * 1%))",
      "--t-2": "hsl(var(--shade-hue), calc((0 + (var(--on, 0) * 20)) * 1%), calc((20 + (var(--on, 0) * 35)) * 1%))",
      "--t-3": "hsl(var(--shade-hue), calc((0 + (var(--on, 0) * 20)) * 1%), calc((10 + (var(--on, 0) * 20)) * 1%))",
      "--glow-color": "hsl(320, 40%, 45%)",
      "--glow-color-dark": "hsl(320, 40%, 35%)"
    } as React.CSSProperties}>
      <svg
        className="lamp-svg"
        style={{ height: "40vmin", maxHeight: "400px", overflow: "visible" }}
        viewBox="0 0 333 484"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="lamp__shade shade">
          <ellipse
            style={{ fill: "var(--opening)" }}
            cx="165"
            cy="220"
            rx="130"
            ry="20"
          />
          <ellipse
            style={{ opacity: `calc(1 - var(--on, 0))` }}
            cx="165"
            cy="220"
            rx="130"
            ry="20"
            fill="url(#opening-shade)"
          />
        </g>
        <g className="lamp__base base">
          <path
            style={{ fill: "var(--base-side)" }}
            d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z"
          />
          <path
            d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z"
            fill="url(#side-shading)"
          />
          <ellipse
            style={{ fill: "var(--base-top)" }}
            cx="165"
            cy="430"
            rx="80"
            ry="20"
          />
          <ellipse
            cx="165"
            cy="430"
            rx="80"
            ry="20"
            fill="url(#base-shading)"
          />
        </g>
        <g className="lamp__post post">
          <path
            style={{ fill: "var(--post)" }}
            d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z"
          />
          <path
            d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z"
            fill="url(#post-shading)"
          />
        </g>
        <g className="lamp__cords cords">
          <path
            style={{ stroke: "var(--cord)", display: "none" }}
            className="cord cord--rig"
            d="M124 187.033V347"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            style={{ stroke: "var(--cord)", display: "none" }}
            className="cord cord--rig"
            d="M124 187.023s17.007 21.921 17.007 34.846c0 12.925-11.338 23.231-17.007 34.846-5.669 11.615-17.007 21.921-17.007 34.846 0 12.925 17.007 34.846 17.007 34.846"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            style={{ stroke: "var(--cord)", display: "none" }}
            className="cord cord--rig"
            d="M124 187.017s-21.259 17.932-21.259 30.26c0 12.327 14.173 20.173 21.259 30.26 7.086 10.086 21.259 17.933 21.259 30.26 0 12.327-21.259 30.26-21.259 30.26"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            style={{ stroke: "var(--cord)", display: "none" }}
            className="cord cord--rig"
            d="M124 187s29.763 8.644 29.763 20.735-19.842 13.823-29.763 20.734c-9.921 6.912-29.763 8.644-29.763 20.735S124 269.939 124 269.939"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            style={{ stroke: "var(--cord)", display: "none" }}
            className="cord cord--rig"
            d="M124 187.029s-10.63 26.199-10.63 39.992c0 13.794 7.087 26.661 10.63 39.992 3.543 13.331 10.63 26.198 10.63 39.992 0 13.793-10.63 39.992-10.63 39.992"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            style={{ stroke: "var(--cord)" }}
            className="cord cord--dummy"
            x1="124"
            y2="348"
            x2="124"
            y1="190"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
        <path
          style={{ opacity: `var(--on, 0)` }}
          className="lamp__light"
          d="M290.5 193H39L0 463.5c0 11.046 75.478 20 165.5 20s167-11.954 167-23l-42-267.5z"
          fill="url(#light)"
        />
        <g className="lamp__top top">
          <path
            style={{ fill: "var(--t-3)" }}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z"
            fill="url(#top-shading)"
          />
        </g>
        <g className="lamp__face face">
          <g style={{ opacity: `var(--on, 0)` }} className="lamp__mouth">
            <path
              d="M165 178c19.882 0 36-16.118 36-36h-72c0 19.882 16.118 36 36 36z"
              fill="#141414"
            />
            <clipPath id="mouth">
              <path
                d="M165 178c19.882 0 36-16.118 36-36h-72c0 19.882 16.118 36 36 36z"
                fill="#141414"
              />
            </clipPath>
            <g clipPath="url(#mouth)">
              <circle
                style={{ fill: "var(--tongue)" }}
                cx="179.4"
                cy="172.6"
                r="18"
              />
            </g>
          </g>
          <g className="lamp__eyes">
            <path
              style={{ stroke: "var(--feature)" }}
              className="lamp__eye"
              d="M115 135c0-5.523-5.82-10-13-10s-13 4.477-13 10"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              style={{ stroke: "var(--feature)" }}
              className="lamp__eye"
              d="M241 135c0-5.523-5.82-10-13-10s-13 4.477-13 10"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <defs>
          <linearGradient
            id="opening-shade"
            x1="35"
            y1="220"
            x2="295"
            y2="220"
            gradientUnits="userSpaceOnUse"
          >
            <stop />
            <stop offset="1" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="base-shading"
            x1="85"
            y1="444"
            x2="245"
            y2="444"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--b-1)" />
            <stop offset="0.8" stopColor="var(--b-2)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="side-shading"
            x1="119"
            y1="430"
            x2="245"
            y2="430"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--b-3)" />
            <stop offset="1" stopColor="var(--b-4)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="post-shading"
            x1="150"
            y1="288"
            x2="180"
            y2="288"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--b-1)" />
            <stop offset="1" stopColor="var(--b-2)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="light"
            x1="165.5"
            y1="218.5"
            x2="165.5"
            y2="483.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--l-1)" stopOpacity=".2" />
            <stop offset="1" stopColor="var(--l-2)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="top-shading"
            x1="56"
            y1="110"
            x2="295"
            y2="110"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--t-1)" stopOpacity=".8" />
            <stop offset="1" stopColor="var(--t-2)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          className="lamp__hit"
          cx="124"
          cy="347"
          r="66"
          fill="#C4C4C4"
          fillOpacity=".1"
          style={{ cursor: "pointer" }}
        />
      </svg>
      <p className="text-center text-sm text-muted-foreground mt-4 font-medium">
        {isOn ? "✨ Pull the cord to turn off" : "💡 Pull the cord to start"}
      </p>
    </div>
  );
};

declare global {
  interface Window {
    gsap: any;
    MorphSVGPlugin: any;
    Draggable: any;
  }
}

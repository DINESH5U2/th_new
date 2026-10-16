import { useLayoutEffect, useRef } from "react";
import { Box } from "@mui/material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// gsap.matchMedia only sets up when one of these matches, so the breakpoints
// cover every width
const MEDIA = {
  mobile: "(max-width: 639px)",
  tablet: "(min-width: 640px) and (max-width: 1024px)",
  desktop: "(min-width: 1025px)",
  reduce: "(prefers-reduced-motion: reduce)"
};

// Per breakpoint: vertical drift per card away from the middle (vh), and the
// rotateY a card enters and leaves with (degrees)
const MOTION = {
  mobile: { step: 2, rotateIn: -60, rotateOut: 50 },
  tablet: { step: 6, rotateIn: -80, rotateOut: 65 },
  desktop: { step: 10, rotateIn: -100, rotateOut: 80 }
};
// Cards far from the middle of a long list would otherwise fly in from
// well off screen
const MAX_DRIFT_STEPS = 2;
const ROTATE_X = 5;

// Reduced motion keeps the pass but flattens it: far less rotation, a much
// deeper perspective and no scrub lag
const REDUCED_ROTATION = 0.15;
const REDUCED_PERSPECTIVE = 4800;

// How far the track pans: its overflow past the stage
const travelOf = (track, stage) =>
  Math.max(0, track.offsetWidth - stage.clientWidth);

/**
 * A row of cards pinned to the viewport and panned horizontally by vertical
 * scroll. Each card rotates in from one side, settles flat in the middle and
 * tilts out the other way.
 *
 * Card size comes from the `--card-w` and `--card-h` CSS variables, set on
 * the slider through `sx`. With `getRatio` (width / height of an item) each
 * card instead takes its own shape: `--card-h` tall, no wider than
 * `--card-max-w`. `stageSx` styles the pinned stage. `children` are
 * laid over the stage, above the cards, and `onProgress` receives the pan
 * progress (0 to 1) on every scroll.
 */
export default function CardsRotateSlider({
  items,
  getKey,
  getRatio,
  renderCard,
  rotationAmount = 1,
  verticalDrift = 1,
  scrollSmoothing = 1,
  perspective = 1200,
  onProgress,
  sx,
  stageSx,
  children
}) {
  const outerRef = useRef(null);
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const trackRef = useRef(null);
  const wrappersRef = useRef([]);
  const cardsRef = useRef([]);
  const onProgressRef = useRef(onProgress);

  useLayoutEffect(() => {
    onProgressRef.current = onProgress;
  });

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    const travel = () => travelOf(track, stage);

    // The stage stays pinned (sticky) for exactly the horizontal travel
    const size = () => {
      outer.style.height = `${travel() + stage.offsetHeight}px`;
    };
    size();

    const mm = gsap.matchMedia();
    mm.add(MEDIA, context => {
      const { mobile, tablet, reduce } = context.conditions;
      const motion = MOTION[mobile ? "mobile" : tablet ? "tablet" : "desktop"];
      const rotation = (reduce ? REDUCED_ROTATION : 1) * rotationAmount;

      gsap.set(sceneRef.current, {
        perspective: reduce ? REDUCED_PERSPECTIVE : perspective
      });

      const pan = gsap.to(track, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: () => `+=${travel()}`,
          scrub: reduce ? true : scrollSmoothing,
          invalidateOnRefresh: true,
          onUpdate: self => onProgressRef.current?.(self.progress)
        }
      });

      const mid = Math.floor(cardsRef.current.length / 2);
      const step = motion.step * verticalDrift;
      cardsRef.current.forEach((card, index) => {
        const wrapper = wrappersRef.current[index];
        if (!card || !wrapper) return;

        const steps = index < mid ? index - mid : index - mid + 1;
        const offset =
          Math.max(-MAX_DRIFT_STEPS, Math.min(MAX_DRIFT_STEPS, steps)) * step;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: wrapper,
              containerAnimation: pan,
              start: "left 100%",
              end: "right 0%",
              scrub: true
            }
          })
          .fromTo(
            card,
            {
              rotateY: motion.rotateIn * rotation,
              rotateX: (offset < 0 ? ROTATE_X : -ROTATE_X) * rotation,
              opacity: 0.8,
              y: `${offset}vh`
            },
            { rotateY: 0, rotateX: 0, opacity: 1, y: 0, ease: "none" }
          )
          .to(card, {
            rotateY: motion.rotateOut * rotation,
            opacity: 0.9,
            y: `${-offset}vh`,
            ease: "none"
          });
      });
    });

    const resizeObserver = new ResizeObserver(() => {
      size();
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(track);
    resizeObserver.observe(stage);

    return () => {
      resizeObserver.disconnect();
      mm.revert();
    };
  }, [items, rotationAmount, verticalDrift, scrollSmoothing, perspective]);

  const cardWidth = item =>
    getRatio
      ? `min(var(--card-h) * ${getRatio(item)}, var(--card-max-w, 100vw))`
      : "var(--card-w)";
  const cardHeight = item =>
    getRatio ? `calc(${cardWidth(item)} / ${getRatio(item)})` : "var(--card-h)";

  // A card reached with the keyboard may be panned off screen: scroll the
  // page to where that card sits in the middle
  const revealCard = (event, index) => {
    if (!event.target.matches(":focus-visible")) return;
    const wrapper = wrappersRef.current[index];
    const center =
      wrapper.offsetLeft +
      wrapper.offsetWidth / 2 -
      stageRef.current.clientWidth / 2;
    const top =
      outerRef.current.getBoundingClientRect().top +
      window.scrollY +
      Math.max(
        0,
        Math.min(travelOf(trackRef.current, stageRef.current), center)
      );
    window.scrollTo({ top });
  };

  return (
    <Box ref={outerRef} sx={{ position: "relative", overflowX: "clip", ...sx }}>
      <Box
        ref={stageRef}
        sx={{
          position: "sticky",
          top: 0,
          height: "100vh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          // clip, not hidden: focusing a card must not scroll the stage
          overflow: "clip",
          ...stageSx
        }}>
        {/* The 3D cards get their own stacking context, under `children` */}
        <Box
          ref={sceneRef}
          sx={{
            position: "relative",
            zIndex: 0,
            flex: 1,
            minHeight: 0,
            display: "flex",
            alignItems: "center"
          }}>
          <Box
            ref={trackRef}
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              width: "max-content",
              height: "100%",
              gap: { xs: "12vw", sm: "8vw", lg: "5vw" },
              // the first and last card rest in the middle of the stage
              pl: `calc(50% - ${cardWidth(items[0])} / 2)`,
              pr: `calc(50% - ${cardWidth(items.at(-1))} / 2)`,
              transformStyle: "preserve-3d",
              willChange: "transform",
              // tilted cards dip behind the track's plane; only cards take clicks
              pointerEvents: "none"
            }}>
            {items.map((item, index) => (
              <Box
                key={getKey(item)}
                ref={element => {
                  wrappersRef.current[index] = element;
                }}
                onFocus={event => revealCard(event, index)}
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  width: cardWidth(item),
                  height: cardHeight(item),
                  transformStyle: "preserve-3d"
                }}>
                <Box
                  ref={element => {
                    cardsRef.current[index] = element;
                  }}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    transformOrigin: "right center",
                    transformStyle: "preserve-3d",
                    zIndex: items.length - index,
                    pointerEvents: "auto"
                  }}>
                  {renderCard(item, index)}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        {children}
      </Box>
    </Box>
  );
}

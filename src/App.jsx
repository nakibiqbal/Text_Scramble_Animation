import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./App.css";

const ScrambleText = () => {
  const textRefs = useRef([]); // References for each text container
  const phrases = [
    "System Error",
    "System Error",
    "System Error",
    "System Error",
    "System Error",
  ]; // The texts
  const chars = "$\u00A0[\u00A0$\u00A0*\u00A0$\u00A0#\u00A0$\u00A0!\u00A0$\u00A0<\u00A00\u00A0/\u00A00\u00A0>\u00A0$\u00A0!\u00A0$\u00A0#\u00A0$\u00A0*\u00A0$\u00A0]\u00A0$"; // Scramble characters

  const startAnimation = (index) => {
    const textRef = textRefs.current[index]; // Get reference for the specific text
    const phrase = phrases[index]; // Get the corresponding text
    const letters = phrase.split(""); // Split the text into individual characters

    // Reset the text container before starting the animation
    textRef.innerHTML = "";
    letters.forEach((letter) => {
      const span = document.createElement("span");
      span.classList.add("letter", "hidden");
      span.textContent = letter === " " ? "\u00A0" : letter; // Handle spaces
      textRef.appendChild(span);
    });

    // Step 1: Letter-by-letter appearance
    const showText = () => {
      letters.forEach((_, idx) => {
        const span = textRef.children[idx];
        setTimeout(() => {
          span.classList.remove("hidden");
          span.classList.add("visible");
        }, idx * 20); // Reduced delay for faster appearance
      });
    };

    // Step 2: Scrambling
    const scrambleText = () => {
      const indices = [...Array(letters.length).keys()].sort(
        () => Math.random() - 0.5
      ); // Randomized indices
      let scrambledCount = 0;

      return new Promise((resolve) => {
        const scrambleInterval = setInterval(() => {
          if (scrambledCount < indices.length) {
            const idx = indices[scrambledCount];
            const scrambledLetter =
              chars[Math.floor(Math.random() * chars.length)];
            textRef.children[idx].textContent = scrambledLetter;
            scrambledCount++;
          } else {
            clearInterval(scrambleInterval);
            resolve(); // Resolve when scrambling is complete
          }
        }, 50); // Use the passed duration for interval timing of scrambleText
      });
    };

    // Step 3: Hiding
    const hideText = () => {
      const indices = [...Array(letters.length).keys()].sort(
        () => Math.random() - 0.5
      ); // Randomized indices
      let hiddenCount = 0;

      return new Promise((resolve) => {
        const hideInterval = setInterval(() => {
          if (hiddenCount < indices.length) {
            const idx = indices[hiddenCount];
            textRef.children[idx].textContent = "\u00A0"; // Make invisible
            hiddenCount++;
          } else {
            clearInterval(hideInterval);
            resolve(); // Resolve when hiding is complete
          }
        }, 50); // Reduced interval for faster hiding
      });
    };

    // Sequential execution of animations
    const runSequence = async () => {
      showText();
      await new Promise((res) => setTimeout(res, letters.length * 20 + 100)); // Reduced wait for showing
      await scrambleText();
      await hideText();
    };

    runSequence();
  };

  useEffect(() => {
    const tl = gsap.timeline({
      repeat: -1, // Infinite repeat
      repeatDelay: 2, // Reduced delay between cycles
    });

    phrases.forEach((_, index) => {
      tl.add(() => startAnimation(index), index * 0.25); // Slightly overlapping animations
    });
  }, []);

  return (
    <div className="scramble-container">
      {/* Create 5 instances of the same animation */}
      {[...Array(5)].map((_, index) => (
        <h1
          key={index}
          ref={(el) => (textRefs.current[index] = el)}
          className="scramble-text"
        ></h1>
      ))}
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <ScrambleText />
    </div>
  );
};

export default App;

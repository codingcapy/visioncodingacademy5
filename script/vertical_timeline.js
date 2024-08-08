gsap.registerPlugin(ScrollTrigger);

function initTimeline() {
  let parent_container = document.getElementById("section-timeline");
  //   if (!parent_container) {
  //     console.error("Element with ID 'section-timeline' not found");
  //     return;
  //   }
  let timeline_container = parent_container.querySelector(
    ".timeline-container"
  );
  //   if (!timeline_container) {
  //     console.error(
  //       "Element with class 'timeline-container' not found inside 'section-timeline'"
  //     );
  //     return;
  //   }
  let sections = timeline_container.querySelectorAll(".year");
  //   if (sections.length === 0) {
  //     console.error(
  //       "No elements with class 'year' found inside 'timeline-container'"
  //     );
  //     return;
  //   }

  const vh = (coef) => window.innerHeight * (coef / 100);

  let parentST = ScrollTrigger.create({
    id: "parent-timeline",
    trigger: parent_container,
    start: "top top",
    toggleClass: "started",
    pin: true,
    markers: false,
    end: () => "+=" + (sections.length - 1) * vh(80),
  });

  let currentSection;

  function goto(section, i) {
    if (currentSection !== section) {
      // if the section is the currentSection, skip
      // move the container
      gsap.to(timeline_container, {
        y: -48 * i,
        duration: 0.6,
        overwrite: true,
      });
      let tl = gsap.timeline({ defaults: { overwrite: true } });
      // animate OUT the current section (if there is one)
      if (currentSection) {
        tl.to(currentSection.querySelector("h2"), {
          fontSize: "2rem",
        });
        tl.to(
          currentSection,
          {
            maxHeight: "3rem",
          },
          0
        );
        tl.to(
          currentSection.querySelectorAll("p"),
          {
            opacity: 0,
            duration: 0.25,
            maxHeight: "0%",
          },
          0
        );
      }
      currentSection = section;
      // animate IN the new section (if there is one)
      if (section) {
        tl.to(
          section.querySelector("h2"),
          {
            fontSize: "7rem",
          },
          0
        );
        tl.to(
          section,
          {
            maxHeight: "80vh",
          },
          0
        );
        tl.fromTo(
          section.querySelectorAll("p"),
          { maxHeight: "0%" },
          {
            opacity: 1,
            maxHeight: "100%",
          }
        );
      }
    }
  }

  sections.forEach((sct, i) => {
    let sct_index = sct.getAttribute("data-count");
    if (i === 0) {
      goto(sct, sct_index);
    }
    ScrollTrigger.create({
      start: () => parentST.start + i * window.innerHeight * 0.4,
      end: () => "+=" + window.innerHeight * 0.4,
      markers: false,
      //onLeaveBack: () => i || goto(null, 0),
      onToggle: (self) => self.isActive && goto(sct, sct_index),
    });
  });
}
document.addEventListener("DOMContentLoaded", function () {
  initTimeline();
});

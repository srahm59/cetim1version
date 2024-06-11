import { gsap, snap } from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

export class Slider {
  constructor(container) {
    this.sliderContainer = container;
    this.slider = container.querySelector(".slider");
    if (this.slider) {
      this.sliderItems = this.slider.querySelectorAll(".slider-item");
      this.sliderWidth = this.sliderItems[0].offsetWidth;
      this.sliderNext = container.querySelector(".slider-next");
      this.sliderPrev = container.querySelector(".slider-prev");
      this.sliderTL = null;
      this.dragSlider = null;
      this.dots = container.querySelector(".pagination");
      this.itemsToShow = null;
      this.itemsToScroll = null;

      this.sliderNext &&
        ((this.sliderNext.direction = "next"),
        this.sliderNext.addEventListener(
          "click",
          this.sliderNav.bind(this, this.sliderNext.direction, this)
        ));
      this.sliderPrev &&
        ((this.sliderPrev.direction = "prev"),
        this.sliderPrev.addEventListener(
          "click",
          this.sliderNav.bind(this, this.sliderPrev.direction, this)
        ));

      if (this.sliderContainer.classList.contains("historique__section")) {
        this.historiqueSliderMobileAdaptation();
      }

      this.dots && this.initPagination();

      this.resizeEvent = () => {
        this.reInit();
      };
      this.initSlider();
    }
  }

  sliderNav(direction, slider, event) {
    event.preventDefault();
    const snapValue = 1 / (this.sliderItems.length - this.getSlideVisibles());
    gsap.to(this.sliderTL, {
      progress: gsap.utils.snap(
        snapValue,
        "next" === direction
          ? this.sliderTL.progress() + snapValue
          : this.sliderTL.progress() - snapValue
      ),
      duration: 0.7,
      // ease: "elastic.out(1, 1)",
    });
    if (this.sliderTL.progress() <= snapValue + 0.1 && "next" !== direction) {
      const timeline = gsap.timeline();
      timeline.to(this.slider, {
        x: 100,
        duration: 0.5,
        ease: "power2.out",
      });
      timeline.to(this.slider, {
        x: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else if (
      this.sliderTL.progress() >= 1 - snapValue - 0.1 &&
      "next" === direction
    ) {
      const timeline = gsap.timeline();
      timeline.to(this.slider, {
        x: -100,
        duration: 0.5,
        ease: "power2.out",
      });
      timeline.to(this.slider, {
        x: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    this.dots && this.trackDot();
  }

  getSlideVisibles() {
    let visibleSlides = 0;
    let totalWidth = 0;
    const sliderWidth = this.slider.offsetWidth;

    Array.from(this.sliderItems).forEach((element, index) => {
      totalWidth += element.offsetWidth;

      if (totalWidth - 1 <= sliderWidth) {
        visibleSlides++;
      }
    });

    return visibleSlides;
  }

  initSlider(start) {
    this.sliderTL = null;
    this.dragSlider = null;

    let startValue = start || 0;
    let totalOffset = 0;

    this.sliderTL = gsap.timeline({
      paused: true,
    });

    Array.from(this.sliderItems).forEach((element, index) => {
      if (index < this.sliderItems.length - this.getSlideVisibles()) {
        this.sliderTL.addLabel("step-" + index);
        totalOffset += element.offsetWidth;
        this.sliderTL.to(
          this.sliderItems,
          {
            x: -totalOffset,
            ease: "none",
            duration: 2,
            immediateRender: false,
          },
          "step" + index
        );
      }
    });

    if (startValue) {
      console.log("valuetosnap", 1 / (this.sliderItems.length - 3), startValue);
      startValue = gsap.utils.snap(
        1 / (this.sliderItems.length - this.getSlideVisibles()),
        startValue
      );
      this.sliderTL.progress(startValue);
    }

    let startDragX = null;
    let endDragX = null;

    this.dragSlider = Draggable.create(
      this.slider.querySelector(".drag-proxy"),
      {
        type: "x",
        trigger: this.slider,
        allowContextMenu: true,
        cursor:
          this.sliderItems.length <= this.getSlideVisibles()
            ? "default"
            : "grab",
        activeCursor:
          this.sliderItems.length <= this.getSlideVisibles()
            ? "default"
            : "grabbing",
        onPress: () => {
          console.log("pressed");
          startDragX = null;
          endDragX = null;
          this.startOffset = this.sliderTL.progress();
          gsap.killTweensOf(this.slider);
          gsap.killTweensOf(this.sliderTL);
        },
        onDrag: (event) => {
          if (!(this.sliderItems.length <= this.getSlideVisibles())) {
            const offsetX = this.dragSlider[0].x - this.dragSlider[0].startX;
            this.sliderTL.progress(this.startOffset - 0.002 * offsetX);

            if (
              this.sliderTL.progress() === 0 &&
              gsap.getProperty(this.slider, "x") < this.sliderWidth
            ) {
              startDragX =
                startDragX === null ? this.dragSlider[0].x : startDragX;

              gsap.set(this.slider, {
                x:
                  gsap.getProperty(this.slider, "x") < this.sliderWidth
                    ? this.dragSlider[0].x - startDragX
                    : gsap.getProperty(this.slider, "x"),
              });
            } else if (
              this.sliderTL.progress() === 1 &&
              gsap.getProperty(this.slider, "x") > -this.sliderWidth
            ) {
              endDragX = endDragX === null ? this.dragSlider[0].x : endDragX;

              gsap.set(this.slider, {
                x:
                  gsap.getProperty(this.slider, "x") > -this.sliderWidth
                    ? this.dragSlider[0].x - endDragX
                    : gsap.getProperty(this.slider, "x"),
              });
            }
          }
        },
        onDragEnd: (event) => {
          console.log("onDragEnd");
          const direction =
            this.dragSlider[0].x - this.dragSlider[0].startX >= 0 ? 1 : -1;
          const snapValue =
            1 / (this.sliderItems.length - this.getSlideVisibles());
          this.dots && this.trackDot();
          gsap.to(this.slider, {
            x: 0,
            duration: 0.7,
            // ease: "elastic.out(1, 1)",
          });
          gsap.to(this.sliderTL, {
            progress: () =>
              gsap.utils.snap(
                snapValue,
                this.sliderTL.progress() + (-direction * snapValue) / 2
              ),
            duration: 1,
            // ease: "elastic.out(1, 1)",
          });
        },
      }
    );
    this.sliderTL.progress(start);
    window.addEventListener("resize", this.resizeEvent);
  }

  reInit() {
    const currentProgress = this.sliderTL.progress();
    this.kill();
    if (this.sliderContainer.classList.contains("historique__section")) {
      this.historiqueSliderMobileAdaptation();
      this.dots && this.initPagination();
    }
    this.initSlider(currentProgress);
  }

  kill() {
    window.removeEventListener("resize", this.resizeEvent);
    this.sliderTL.progress(0);

    if (this.sliderTL !== null) {
      this.sliderTL.kill();
      this.sliderTL = null;
    }

    if (this.dragSlider !== null) {
      this.dragSlider[0].kill();
      this.dragSlider[0] = null;
    }

    gsap.killTweensOf(this.sliderItems);
    gsap.killTweensOf(this.slider);

    this.slider.removeAttribute("style");
    this.slider.querySelector(".drag-proxy").removeAttribute("style");

    Array.from(this.sliderItems).forEach((element) => {
      element.removeAttribute("style");
    });
  }

  initPagination() {
    const pages = Math.ceil(this.sliderItems.length / this.getSlideVisibles());
    for (let index = 0; index < pages + 1; index++) {
      const dot = document.createElement("a");
      dot.classList.add("dot");
      dot.addEventListener("click", () => {
        const snapValue = (1 / pages) * index;
        gsap.to(this.sliderTL, {
          progress: gsap.utils.snap(snapValue, snapValue),
          duration: 0.7,
        });
        const activeDots = this.dots.querySelectorAll(".dot.active");
        activeDots.forEach((element) => {
          element.classList.remove("active");
        });
        dot.classList.add("active");
      });
      this.dots.appendChild(dot);
    }
  }

  trackDot() {
    const dots = this.dots.querySelectorAll(".dot");
    console.log(1 / dots.length);
    let index = Math.floor(this.sliderTL.progress() * dots.length);
    index = index === 0 ? index : index - 1;
    const activeDots = this.dots.querySelectorAll(".dot.active");
    activeDots.forEach((element) => {
      element.classList.remove("active");
    });
    dots[index].classList.add("active");
  }

  historiqueSliderMobileAdaptation() {
    if (window.matchMedia("(max-width: 991px)").matches) {
      if (this.sliderContainer.querySelector(".historique-timeline")) {
        const timeline = this.sliderContainer.querySelector(".slider");
        const slider = this.sliderContainer.querySelector(".historique-items");
        const sliderHeading = slider.querySelector(".historique-heading");
        const timelineChildren = new Array();
        for (const child of timeline.children) {
          timelineChildren.push(child);
        }
        for (const child of timelineChildren) {
          if (child.classList.contains("drag-proxy")) {
            slider.prepend(child);
          } else {
            slider.appendChild(child);
          }
        }
        if (timeline) {
          timeline.remove();
        }
        if (sliderHeading.querySelector(".btn-group")) {
          sliderHeading.querySelector(".btn-group").remove();
        }

        const pagination = document.createElement("div");
        pagination.classList.add("pagination");
        this.dots = pagination;

        this.sliderContainer.appendChild(pagination);
        sliderHeading.classList.add("slider-item");
        slider.classList.add("slider");
        this.slider = slider;
        this.sliderItems = this.slider.querySelectorAll(".slider-item");
        this.sliderNext = null;
        this.sliderPrev = null;
      }
    } else {
      if (!this.sliderContainer.querySelector(".historique-timeline")) {
        const timeline = document.createElement("div");
        timeline.classList.add("historique-timeline", "slider");
        const slider = this.sliderContainer.querySelector(".historique-items");
        const sliderHeading = slider.querySelector(".historique-heading");
        sliderHeading.classList.remove("slider-item");
        sliderHeading.removeAttribute("style");
        const timelineChildren = new Array();
        for (const child of slider.children) {
          timelineChildren.push(child);
        }
        for (const child of timelineChildren) {
          if (!child.classList.contains("historique-heading")) {
            timeline.appendChild(child);
          }
        }
        slider.classList.remove("slider");
        slider.appendChild(timeline);

        // Navigation buttons
        const buttonsGroup = document.createElement("div");
        buttonsGroup.classList.add("btn-group");
        const prevButton = document.createElement("button");
        prevButton.classList.add("slider-prev");
        prevButton.innerHTML = `<img src="imgs/arrow-left.svg" alt="arrow left">`;

        const nextButton = document.createElement("button");
        nextButton.classList.add("slider-next");
        nextButton.innerHTML = `<img src="imgs/arrow-right.svg" alt="arrow right">`;

        buttonsGroup.appendChild(prevButton);
        buttonsGroup.appendChild(nextButton);

        sliderHeading.appendChild(buttonsGroup);

        if (this.dots) {
          this.dots.remove();
        }

        this.dots = null;

        // Reset Slider
        this.slider = timeline;
        this.sliderItems = this.slider.querySelectorAll(".slider-item");
        this.sliderNext = nextButton;
        this.sliderPrev = prevButton;

        this.sliderNext &&
          ((this.sliderNext.direction = "next"),
          this.sliderNext.addEventListener(
            "click",
            this.sliderNav.bind(this, this.sliderNext.direction, this)
          ));
        this.sliderPrev &&
          ((this.sliderPrev.direction = "prev"),
          this.sliderPrev.addEventListener(
            "click",
            this.sliderNav.bind(this, this.sliderPrev.direction, this)
          ));
      }
    }
  }
}

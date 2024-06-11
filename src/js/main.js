import "../scss/styles.scss";
import { Slider } from "./Slider";
import './form';

document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".slider-container");
  sliders.forEach((slider) => {
    new Slider(slider);
  });
});


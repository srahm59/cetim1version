import '../scss/styles.scss'
import $ from 'jquery'
import 'slick-carousel'
window.jQuery = window.$ = $;

document.addEventListener("DOMContentLoaded",() => {
    if(document.querySelector('.they-trust-us-items')) {
        $('.they-trust-us-items').slick({
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: false,
            speed: 300,
            dots: false,
        });
    }
    if(document.querySelector('.actualites-items')) {

        $('.actualites-items').slick({
            infinite: true,
            slidesToShow: 3,
            arrows: false,
            speed: 300,
            dots: false,
            responsive: [
                {
                  breakpoint: 992,
                  settings: {
                    arrows: false,
                    slidesToShow: 2,
                  }
                },
            ]
        });
    }
   
})
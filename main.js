document.addEventListener("DOMContentLoaded", function() {
  let header = document.querySelector("header");
  header.style.height = window.innerHeight + "px";

  const mainGrey = "#333",
        mainBlue = '#004D4F',
        mainOrange = "#6A4400",
        mainPurple = "#321E3E";

  const headerArrow = document.querySelector("#header-down-arrow"),
        sliderContainer = document.querySelector(".slider-container");

  /* ANIMATES HEADER ARROW */
  const headerArrowTL = gsap.timeline({ repeat: -1 });

  headerArrowTL.to(headerArrow, 1.5, { scaleX: 1.1, scaleY: 1.2, y: -7 });
  headerArrowTL.to(headerArrow, 1, { scale: 1, y: 0 });

  const svg = document.getElementById("generic-icon"),
        locLine1 = document.querySelector(".loc-line-1"),
        locLine2 = document.querySelector(".loc-line-2"),
        locTop = document.querySelector('.loc-top'),
        locCircle = document.querySelector(".loc-circle");

  const mailOuter = document.querySelector(".mail-outer"),
        mailFinalLine = document.querySelector(".mail-final-line");

  let tl1 = gsap.timeline({ repeat: -1, repeatDelay: .75 });

  // tl1.pause();

  // Location Icon bounces
  tl1.to(svg, .5, { scaleX: 0.5, y: -25 });
  tl1.to(svg, .25, {scaleY: 0.5 }, '-=0.25');
  tl1.to(svg, .25, {y: 25 });
  tl1.to(svg, .25, {y: 0 });
  tl1.to(svg, .33, { scaleX: 1 });
  tl1.to(svg, .25, { scaleY: 1 }, '-=.25');

  // Location icon turns into hamburger
  tl1.to(locLine1, .25, {attr: { points: "200,300 800,300" }}, '+=.33');
  // tl1.to(svg, .5, { stroke: mainOrange }, '-=.5');
  tl1.to(locLine2, .25, {attr: { points: "200,500 800,500" }}, '-=.25');
  tl1.to(locTop, .25, {attr: { d: "M200,700 H800"}}, '-=.25');
  tl1.to(locCircle, .1, { opacity: 0 }, '-=.25');

  // Hamburger turns into X
  tl1.to(locLine2, .25, { rotate: 360-45, transformOrigin: "50%, 50%" }, '+=.33');
  // tl1.to(svg, .5, { stroke: mainOrange }, '-=.25');
  tl1.to(locLine1, .1, { y: 200 }, '-=.25');
  tl1.to(locTop, .1, { y: -200, opacity: 0 }, '-=.25');
  tl1.to(locLine1, .15, { rotate: -180+45, transformOrigin: "50%, 50%" }, '-=.15');

  // X back to burger
  tl1.to(locLine2, .25, { rotate: 0, transformOrigin: "50%, 50%" }, '+=.5');
  // tl1.to(svg, .5, { stroke: mainBlue }, '-=.25')
  tl1.to(locLine1, .15, { rotate: 0, transformOrigin: "50%, 50%" }, '-=.15');
  tl1.to(locLine1, .1, { y: 0 }, '-=.1');
  tl1.to(locTop, .1, { y: 0, opacity: 1 }, '-=.1');

  // burger into mail
  tl1.to(locLine1, .5, { attr: { points: "500.29,555 846.71,355" }}, '+=.5');
  // tl1.to(svg, .5, { stroke: mainPurple }, '-=.5')
  tl1.to(locLine2, .5, { attr: { points: "499.71,555 153.29,355" }}, '-=.5');
  tl1.to(locTop, .5, { attr: { d: "M846.71,645 L595.56,500"}}, '-=.5');
  tl1.to(mailFinalLine, .25, { opacity: 1 }, '-=.25');
  tl1.to(mailOuter, .25, { opacity: 1 }, '-=.25');

  // Mail to location
  tl1.to(locTop, .25, { opacity: 0 }, '+=.75');
  tl1.to(locLine1, .25, { opacity: 0 }, '-=.25');
  tl1.to(locLine2, .25, { opacity: 0 }, '-=.25');
  tl1.to(locCircle, .25, { opacity: 0 }, '-=.25');
  tl1.to(mailOuter, .25, { opacity: 0 }, '-=.25');
  tl1.to(mailFinalLine, .25, { opacity: 0 }, '-=.25');

  tl1.to(locTop, .001, { attr: { d: "M700.65,389.68h0a187.17,187.17,0,0,0,5.23-44C705.88,237.59,613.71,150,500,150S294.12,237.59,294.12,345.65a187.17,187.17,0,0,0,5.23,44h0" }});
  tl1.to(locLine1, .001, { attr: { points: "700.65 389.67 700.65 389.68 674.69 449.23 674.67 449.27 500 850" }}, '-=.001');
  tl1.to(locLine2, .001, { attr: { points: "299.35 389.67 299.35 389.68 325.31 449.23 325.33 449.27 500 850" }}, '-=.001');

  tl1.to(locTop, .25, { opacity: 1 });
  tl1.to(locLine1, .25, { opacity: 1 }, '-=.25');
  tl1.to(locLine2, .25, { opacity: 1 }, '-=.25');
  tl1.to(locCircle, .25, { opacity: 1 }, '-=.25');
  

  /* PHONE/TABLET/PC ANIMATION */
  const phoneOuter = document.querySelector(".phone-outer"),
        phoneScreen = document.querySelector(".phone-screen"),
        homeButton = document.querySelector(".home-button"),
        speaker = document.querySelector(".phone-speaker"),
        camera = document.querySelector(".camera"),
        pcStand = document.querySelectorAll('.pc-stand');

  const tl2 = gsap.timeline({ repeat: -1, repeatDelay: .5 });

  tl2.pause();

  // Phone turns into tablet
  tl2.to(phoneOuter, .5, { x: -113, y: -50, width: 583, height: 750 }, '+=.33');
  tl2.to(phoneScreen, .5, { x: -115.75, y: -50, width: 535.71, height: 654.76 }, "-=.5");
  tl2.to(camera, .5, { x: 72.5, y: -45, r: 10 }, '-=.5')
  tl2.to(speaker, .01, { opacity: 0 }, '-=.5');
  tl2.to(homeButton, .5, { y: 50 }, '-=.5');

  // Tablet to PC
  tl2.to(phoneOuter, 1, { x: -297.72, y: -50, width: 950, height: 600, attr: { rx: 5 } }, '+=.33');
  tl2.to(phoneScreen, 1, { x: -323.25, y: 450, height: 1, width: 950 }, '-=1');
  tl2.to(camera, .01, { opacity: 0 }, '-=1');
  tl2.to(homeButton, .01, { opacity: 0 }, '-=1');
  tl2.to(pcStand, .4, { opacity: 1 }, '-=.4');

  // PC to Phone
  tl2.to(phoneOuter, 1, { x: 0, y: 0, width: 354.55, height: 650, attr: { rx: 51.13 }}, '+=.66');
  tl2.to(phoneScreen, 1, { x: 0, y: 0, width: 303.49, height: 541.67 }, '-=1')
  tl2.to(homeButton, .5, { opacity: 1, x: 0, y: 0 }, '-=.5');
  tl2.to(speaker, .5, { opacity: 1, x: 0, y: 0 }, '-=.5');
  tl2.to(camera, .5, { opacity: 1, x: 0, y: 0, r: 5 }, '-=.5');
  tl2.to(pcStand, .5, { opacity: 0 }, '-=1');


  // const tl4 = gsap.timeline({repeat: 0}),
  //       paletteRect1 = document.querySelector(".palette-rect-1"),
  //       paletteRect2 = document.querySelector(".palette-rect-2"),
  //       paletteRect3 = document.querySelector(".palette-rect-3");

  // // tl4.pause()

  // tl4.to(paletteRect1, .5, { fill: "#1EB4C3"});
  // tl4.to(paletteRect2, .5, { fill: "#384069"});
  // tl4.to(paletteRect3, .5, { fill: "#863A20"});
  // tl4.to(paletteRect1, .5, { fill: "#377428"});
  // tl4.to(paletteRect3, .5, { fill: "#BDA69F"});


  /* SHIFTS BETWEEN GENERIC ICON ANIMATION AND RESPONSIVE ANIMATION */
  const tl3 = gsap.timeline({repeat: -1}),
        genericAnim = document.querySelector(".generic-anim"),
        responsiveAnim = document.querySelector(".responsive-anim"),
        sliderTextChange = document.querySelector(".slider-text-change"),
        // genericIcon = document.querySelector("#generic-icon"),
        // responsiveIcon = document.querySelector("#responsive-icon"),
        tlArr = [tl1, tl2];

  let tlTracker = 0;


  tl1.pause();
  tl2.pause();
  tl3.pause();

  tl3.to(genericAnim, .5, { opacity: 0, onComplete: setActiveTimeline }, '+=6');
  // tl3.to(genericAnim, .5, { left: '-100vw', onComplete: setActiveTimeline }, '+=5');
  tl3.to(genericAnim, .001, { display: 'none' });
  tl3.to(responsiveAnim, .001, { display: 'flex' });
  tl3.to(responsiveAnim, .498, { opacity: 1 });
  tl3.to(sliderTextChange, .5, { opacity: 0, onComplete: changeSliderText, onCompleteParams: [1] }, '-=.5');
  tl3.to(sliderTextChange, .5, { opacity: 1 });

  tl3.to(responsiveAnim, .5, { opacity: 0, onComplete: setActiveTimeline }, "+=6");
  tl3.to(responsiveAnim, .001, { display: 'none' });
  tl3.to(genericAnim, .001, { display: 'flex' });
  tl3.to(genericAnim, .5, { opacity: 1 });
  tl3.to(sliderTextChange, .5, { opacity: 0, onComplete: changeSliderText }, '-=.5');
  tl3.to(sliderTextChange, .5, { opacity: 1 });
  // tl3.fromTo(".responsive-anim", .5, { left: 0, width: "100%" }, { left: "0", onComplete: function() { genericAnim.style.display = 'none'; } }, '-=.5');

  function changeSliderText(textSelect=0) {
    if (textSelect == 1) {
      sliderTextChange.innerText = "are:";
    } else {
      sliderTextChange.innerText = "include:";
    }    
  }


  function setActiveTimeline() {
    if (tlTracker + 1 > 1) {
      tlTracker = 0;
    } else {
      tlTracker += 1;
    }

    for (var i = 0; i < tlArr.length; i++) {
      if (i == tlTracker) {
        tlArr[i].resume();
      } else {
        tlArr[i].pause();
      }
    }
  }



  // SECTION FOR CHANGING PAGES
  // scrollTracker maintains state concerning currently selected page.
  // changeTracker is toggled to ensure pages can't be scrolled through too quickly.
  let scrollTracker = 0,
      changeTracker = 1,
      completeTracker = 1,
      pageArr = [showHeader, showInfo1, showAnim, showContact],
      x0 = null;

  let infoContainer1 = document.querySelector(".info-container-1"),
      contactContainer = document.querySelector(".contact-container");

  document.addEventListener("touchstart", touchLock);
  document.addEventListener("touchend", touchMove);
  document.addEventListener("wheel", wheelMove);

  incDecScrollTracker(0);

  function touchLock(e) {
    x0 = e.changedTouches[0].clientY;
  };

  function touchMove(e) {
    // if moveDir is negative user is scrolling up.
    if (x0 || x0 === 0) {
      let moveDir = Math.sign(x0 - e.changedTouches[0].clientY);
      incDecScrollTracker(moveDir);
    }
  }

  function wheelMove(e) {
    // if deltaY is < 0 then user is scrolling up. -1 will result in scroll to
    // previous page and 1 to next page.
    if (e.deltaY < 0) {
      incDecScrollTracker(-1);
    } else if (e.deltaY > 0) {
      incDecScrollTracker(1);
    }
  }

  function incDecScrollTracker(scrollDir) {
    if (scrollDir + scrollTracker >= 0 && scrollDir + scrollTracker <= 3 && changeTracker ) {
      scrollTracker += scrollDir;
      changeTracker = 0;

      pageArr[scrollTracker](scrollDir);

      setTimeout(function() {
        changeTracker = 1;
      }, 150)
    }
  }

  function showHeader(scrollDir) {
    header.style.display = "flex";
    gsap.to(infoContainer1, .5, { top: "100vh", onComplete: function() {
      // infoContainer1.style.display = "none";
    }});
    gsap.to(header, .5, { opacity: 1 });
  }

  function showInfo1(scrollDir) {
    infoContainer1.style.display = "flex";

    if (scrollDir > 0) {  
      gsap.to(infoContainer1, .5, { top: 0 });
      gsap.to(header, .33, {opacity: 0, onComplete: function() {
        // header.style.display = "none";
      }})
      
    }
    else {
      gsap.to(sliderContainer, .5, { top: "100vh", onComplete: function() {
        // sliderContainer.style.display = "none";
      }});
      gsap.to(infoContainer1, .5, { opacity: 1 }, '-=.5');
    }
    tl1.pause();
    tl2.pause();
    tl3.pause();
  }

  function showAnim(scrollDir) {
    sliderContainer.style.display = "flex"
    if (scrollDir > 0) {
      gsap.to(sliderContainer, .5, { top: 0 });
      gsap.to(infoContainer1, .3, { opacity: 0, onComplete: function() {
        // infoContainer1.style.display = "none";
      }}, "-=.5");
    } else {
      gsap.to(sliderContainer, .5, { opacity: 1 })
      gsap.to(contactContainer, .5, { top: "100vh", opacity: 0, onComplete: function() {
        // contactContainer.style.display = "none";
      } }, '-=.5');
    }
    tl1.resume();
    tl2.resume();
    tl3.resume();
  }

  function showContact(scrollDir) {
    contactContainer.style.display = "flex";
    gsap.to(contactContainer, .5, { top: 0, opacity: 1 });
    gsap.to(sliderContainer, .33, { opacity: 0, onComplete: function() {
      // sliderContainer.style.display = "none";
    }});
  }


  // CONTACT BUTTON FUNCTIONALITY
  let contactButton = document.querySelector(".contact-container button"),
      contactH2 = document.querySelector(".contact-container h2"),
      contactP = document.querySelector(".contact-container p"),
      buttonAlert = document.querySelector(".button-alert");
      
  contactButton.addEventListener("click", function() {
    let emailEl = document.querySelector(".email-el");
    emailEl.select()
    emailEl.setSelectionRange(0, 99999);
    document.execCommand('copy');

    buttonAlert.style.display = "flex";
    contactH2.style.display = "none";
    contactP.style.display = "none";
    contactButton.style.display = "none";
    gsap.to(buttonAlert, .25, { opacity: 1 });

    setTimeout(function() {
      gsap.to(buttonAlert, .5, { opacity: 0, onComplete: function() {
        buttonAlert.style.display = "none";
        contactH2.style.display = "flex";
        contactP.style.display = "flex";
        contactButton.style.display = "flex";
      }});
    }, 2000);
  })
})
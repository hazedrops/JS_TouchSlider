const slider = document.querySelector('.slider-container'),
  slides = Array.from(document.querySelectorAll('.slide'))

let isDragging = false,
  startPos = 0, // Position of slide wherever we start the clicking to drag, or touch screen to drag
  currentTranslate = 0,
  prevTranslate = 0,
  animationID = 0,
  currentIndex = 0

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector('img')
  slideImage.addEventListener('dragstart', (e) => e.preventDefault()) // Prevent an image floating(which is a default behavior) when it is dragged

  // Touch events
  slide.addEventListener('touchstart', touchStart(index))
  slide.addEventListener('touchend', touchEnd)
  slide.addEventListener('touchmove', touchMove)

  // Mouse events
  slide.addEventListener('mousedown', touchStart(index))
  slide.addEventListener('mouseup', touchEnd)
  slide.addEventListener('mouseleave', touchEnd)
  slide.addEventListener('mousemove', touchMove) // Fired wven when the mouse is not clicked - so needs 'isDragging' for this function to be fired only when the mouse is clicked

})

// Disable the context menu
window.oncontextmenu = function (event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}

function touchStart(index) {
  return function(event) {
    currentIndex = index
    startPosistion = getPositionX(event)
    isDragging= true

    animationID = requestAnimationFrame(animation)

    slider.classList.add('grabbing')
  }
}

function touchEnd() {
  isDragging= false
  cancelAnimationFrame(animationID)

  const movedBy = currentTranslate - prevTranslate
  
  if(movedBy < -100 && currentIndex < slides.length -1) {
    currentIndex += 1
  }

  if(movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1
  }

  setPositionByIndex()

  slider.classList.remove('grabbing')

}

function touchMove(event) {
  if(isDragging) {
    const currentPosition = getPositionX(event)
    currentTranslate = prevTranslate + currentPosition - startPosistion
  }
}

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

function animation() {
  setSliderPosition()
  
  if(isDragging) requestAnimationFrame(animation)
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -(window.innerWidth)
  prevTranslate = currentTranslate
  setSliderPosition()
}
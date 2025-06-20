const input = document.getElementById('expression');
  const cursor = document.getElementById('fake-cursor');

  function updateCursorPositionByClick(event) {
    const rect = input.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    // Clamp click within input box width
    const paddingLeft = parseFloat(getComputedStyle(input).paddingLeft);
    const paddingRight = parseFloat(getComputedStyle(input).paddingRight);
    const maxX = input.offsetWidth - paddingRight;
    const clampedX = Math.max(paddingLeft, Math.min(clickX, maxX));

    // Position the fake cursor centered on the mouse click
    cursor.style.left = `${input.offsetLeft + clampedX - -2}px`; // -0.5 to center it (since width is 1px)
  }

  input.addEventListener('click', updateCursorPositionByClick);
  input.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    updateCursorPositionByClick({ clientX: touch.clientX });
  }
});


  // Initial position (end of text)
  window.addEventListener('load', () => {
    const rect = input.getBoundingClientRect();
    const paddingLeft = parseFloat(getComputedStyle(input).paddingLeft);
    const textWidth = input.scrollWidth - parseFloat(getComputedStyle(input).paddingRight);
    cursor.style.left = `${input.offsetLeft + textWidth - -2}px`;
  });
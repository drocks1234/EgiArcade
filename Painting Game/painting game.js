window.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('paintCanvas');
  const ctx = canvas.getContext('2d');
  const brushSize = document.getElementById('brushSize');
  const colorPicker = document.getElementById('colorPicker');
  const brushType = document.getElementById('brushType');
  const clearCanvas = document.getElementById('clearCanvas');
  const saveCanvas = document.getElementById('saveCanvas');
  const undoCanvas = document.getElementById('undoCanvas');
  const eraser = document.getElementById('eraser');
  const importImage = document.getElementById('importImage');
  const opacitySlider = document.getElementById('opacitySlider');

  let painting = false;
  let eraserEnabled = false;
  let savedStates = [];
  let importedImage = null;
  let imageOpacity = 1;
  let imagePosition = { x: 0, y: 0 };
  let draggingImage = false;
  let dragStart = { x: 0, y: 0 };


  function startPosition(e) {
    painting = true;
    saveState();
    draw(e);
  }

  function setInitialCanvasBackground() {
    ctx.fillStyle = '#f0f0f0'; // Set the canvas background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000'; // Reset the fillStyle to the default color
  }


  function finishedPosition() {
    painting = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!painting) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = brushType.value;
    ctx.strokeStyle = eraserEnabled ? '#FFFFFF' : colorPicker.value; 
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }


  function clearCanvasArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setInitialCanvasBackground();
  }
  

  function saveState() {
    savedStates.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }

  function undo() {
    if (savedStates.length < 1) return;
    savedStates.pop();
    const previousState = savedStates[savedStates.length - 1];
    ctx.putImageData(previousState, 0, 0);
  }

  function saveAsImage() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'my_painting.png';
    link.click();
  }

  function importImageHandler(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        importedImage = img;
        drawImportedImage();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function drawImportedImage() {
    if (!importedImage) return;
    ctx.globalAlpha = imageOpacity;
    ctx.drawImage(importedImage, imagePosition.x, imagePosition.y);
    ctx.globalAlpha = 1; // Reset the opacity for other drawings
  }

  function updateImageOpacity(e) {
    imageOpacity = e.target.value / 100;
    drawAll();
  }

  function startDraggingImage(e) {
    if (!importedImage) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x > imagePosition.x && x < imagePosition.x + importedImage.width &&
        y > imagePosition.y && y < imagePosition.y + importedImage.height) {
      draggingImage = true;
      dragStart = { x, y };
    }
  }

  function stopDraggingImage() {
    draggingImage = false;
  }

  function moveImage(e) {
    if (!draggingImage || !importedImage) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    imagePosition.x += dx;
    imagePosition.y += dy;
    dragStart = { x, y };
    drawAll();
  }

  function drawAll() {
    clearCanvasArea();
    drawImportedImage();
    if (savedStates.length > 0) {
      ctx.putImageData(savedStates[savedStates.length - 1], 0, 0);
    }
  }

  function toggleEraser() {
    eraserEnabled = !eraserEnabled;
    eraser.textContent = eraserEnabled ? 'Brush' : 'Eraser';
  }

  function updateBrushType() {
    ctx.lineCap = brushType.value;
  }

  importImage.addEventListener('change', importImageHandler);
  opacitySlider.addEventListener('input', updateImageOpacity);

  brushType.addEventListener('change', updateBrushType);
  clearCanvas.addEventListener('click', clearCanvasArea);
  saveCanvas.addEventListener('click', saveAsImage);
  undoCanvas.addEventListener('click', undo);
  eraser.addEventListener('click', toggleEraser);
  canvas.addEventListener('mousedown', startPosition);
  canvas.addEventListener('mouseup', finishedPosition);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mousedown', startDraggingImage);
  canvas.addEventListener('mouseup', stopDraggingImage);
  canvas.addEventListener('mousemove', moveImage);  
  setInitialCanvasBackground();

  saveState();
});
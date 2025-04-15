window.onload = () => {
  console.log('ocrAPI 존재 여부:', window.ocrAPI);
  
  const canvas = document.getElementById('dragCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const MM_PER_PIXEL = 25.4 / 96; // 1px = 약 0.2646mm

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  const rectangles = [];

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.offsetX;
    startY = e.offsetY;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
      currentX = e.offsetX;
      currentY = e.offsetY;
      drawAll();
    }
  });

  canvas.addEventListener('mouseup', async (e) => {
    if (isDragging) {
      const endX = e.offsetX;
      const endY = e.offsetY;
      const rect = {
        x: startX,
        y: startY,
        width: endX - startX,
        height: endY - startY,
      };
      rectangles.push(rect);
      isDragging = false;
      drawAll();

      // OCR 수행
      const dataURL = getCroppedImageData(rect.x, rect.y, rect.width, rect.height);
          
      try {
        const text = await window.ocrAPI.recognizeText(dataURL);
        alert(`🔍 인식된 텍스트:\n${text}`);
      } catch (err) {
        alert('OCR 오류 발생: ' + err.message);
      }
    }
  });

  function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rectangles.forEach(rect => {
      drawRect(rect.x, rect.y, rect.width, rect.height);
    });

    if (isDragging) {
      const width = currentX - startX;
      const height = currentY - startY;
      drawRect(startX, startY, width, height);
    }
  }

  function drawRect(x, y, width, height) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = 'black';
    ctx.font = '14px sans-serif';

    // px → mm 변환
    const mmX = (x * MM_PER_PIXEL).toFixed(1);
    const mmY = (y * MM_PER_PIXEL).toFixed(1);
    const mmW = (Math.abs(width) * MM_PER_PIXEL).toFixed(1);
    const mmH = (Math.abs(height) * MM_PER_PIXEL).toFixed(1);

    const infoText = `(${mmX}mm, ${mmY}mm)  ${mmW}mm × ${mmH}mm`;
    const textX = x + 5;
    const textY = y - 8 < 10 ? y + 15 : y - 8;

    ctx.fillText(infoText, textX, textY);
  }

  function getCroppedImageData(x, y, width, height) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = Math.abs(width);
    tempCanvas.height = Math.abs(height);
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.drawImage(
      canvas,
      width < 0 ? x + width : x,
      height < 0 ? y + height : y,
      Math.abs(width),
      Math.abs(height),
      0,
      0,
      Math.abs(width),
      Math.abs(height)
    );

    return tempCanvas.toDataURL();
  }
};

const container = document.getElementById('container');
const coordsDiv = document.getElementById('coords');

const A4_WIDTH_PX = 1123;
const A4_HEIGHT_PX = 794;
const A4_WIDTH_MM = 297;
const A4_HEIGHT_MM = 210;

let firstPoint = null;  // 첫 번째 점 저장
let secondPoint = null; // 두 번째 점 저장
let currentInfoBox = null; // 이번 클릭 쌍에서 사용할 info-box만 따로 보관

function pxToMm(x, y) {
  const mmX = (x / A4_WIDTH_PX) * A4_WIDTH_MM;
  const mmY = (y / A4_HEIGHT_PX) * A4_HEIGHT_MM;
  return [mmX, mmY];
}

container.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const [mmX, mmY] = pxToMm(x, y);
  coordsDiv.textContent = `X: ${mmX.toFixed(1)}mm, Y: ${mmY.toFixed(1)}mm`;
});

container.addEventListener('click', (e) => {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const [mmX, mmY] = pxToMm(x, y);

  if (!firstPoint) {
    // 첫 번째 점 저장
    firstPoint = { x, y, mmX, mmY };

    const dot = document.createElement('div');
    dot.className = 'pointer-dot red';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    container.appendChild(dot);

    // 새로운 info-box 생성
    currentInfoBox = document.createElement('div');
    currentInfoBox.className = 'info-box';
    currentInfoBox.style.left = `${x + 10}px`;
    currentInfoBox.style.top = `${y + 10}px`;
    currentInfoBox.innerHTML = `
      top: ${mmY.toFixed(1)}mm<br>
      left: ${mmX.toFixed(1)}mm<br>
      width: --<br>
      height: --
    `;
    // container.appendChild(currentInfoBox);

  } else if (firstPoint && !secondPoint) {
    // 두 번째 점 저장
    secondPoint = { x, y };

    const dot = document.createElement('div');
    dot.className = 'pointer-dot cyan';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    container.appendChild(dot);

    const width = secondPoint.x - firstPoint.x;
    const height = secondPoint.y - firstPoint.y;
    const [mmWidth, mmHeight] = pxToMm(Math.abs(width), Math.abs(height));

    const rectElement = document.createElement('div');
    rectElement.className = 'rectangle';
    // rectElement.style.left = `${Math.min(firstPoint.x, secondPoint.x)}px`;
    // rectElement.style.top = `${Math.min(firstPoint.y, secondPoint.y)}px`;
    // rectElement.style.width = `${Math.abs(width)}px`;
    // rectElement.style.height = `${Math.abs(height)}px`;
    container.appendChild(rectElement);

    // 첫 점 좌표 기준 info-box 내용 업데이트
    currentInfoBox.innerHTML = `
      top: ${firstPoint.mmY.toFixed(1)}mm<br>
      left: ${firstPoint.mmX.toFixed(1)}mm<br>
      width: ${mmWidth.toFixed(1)}mm<br>
      height: ${mmHeight.toFixed(1)}mm
    `;

    // ✅ JSX 코드 자동 복사
    const jsxSnippet = `<ViewBox title="" style={{ top: "${firstPoint.mmY.toFixed(1)}mm", left: "${firstPoint.mmX.toFixed(1)}mm", width: "${mmWidth.toFixed(1)}mm", height: "${mmHeight.toFixed(1)}mm" }}></ViewBox>`;

    navigator.clipboard.writeText(jsxSnippet).then(() => {
      coordsDiv.textContent = `${jsxSnippet}`;
      coordsDiv.classList.add('copied');
      setTimeout(() => coordsDiv.classList.remove('copied'), 3000);
    }).catch(err => {
      coordsDiv.textContent = `❌ 복사 실패: ${err}`;
    });

    // 포인트 초기화 (다음 클릭을 위해)
    firstPoint = null;
    secondPoint = null;
    currentInfoBox = null;
  }
});

document.addEventListener("DOMContentLoaded", () => {

const options = [
  // group1：成就與資源取向
  "穩定的收入",  "持續的現金流",   "一夜致富的可能",   "購置房產",   "理想的交通工具",   "高品質生活",   "名望與榮譽",   "時尚或個性化穿著",   "享受奢侈品",   "工作環境舒適、設備完善",   "自由選擇工作地點",   "興趣或嗜好",   "長期規劃或夢想",   "多元收入來源",   "穩定的職涯成長路徑",   "建立個人品牌",   "持續學習與自我成長",   "發揮專業能力與技術", 
  // group2：意義與品格取向
  "內在的平靜",   "精神層面的滿足",   "生活有意義感",   "發揮正義感",   "維護秩序與規範",   "誠信與正直",   "發揮創造力",   "保有赤子之心",   "鼓勵他人心理成長",   "能實際幫助他人",   "能提升社會貢獻",   "培養自律與責任感",   "培養耐心與包容心",   "充滿冒險與探索精神",   "能保持自由與自主性", 
  // group3：人際關係與影響
  "和同事合作無礙",  "與上司、下屬保持良好關係",   "建立互相信任的團隊",   "與團隊一起完成目標",   "親近的好友",   "穩定的人際關係",   "談戀愛與培養情感連結",   "給予與接受情感支持",   "與不同背景的人互動",   "建立人脈與社會網絡",   "感受到被尊重與理解", 
  // group4：家庭與責任取向
  "陪伴家人",  "孝順父母",   "美滿的婚姻",   "生養與陪伴子女",   "不辜負家人期待",  
  // group5：自主與生活節奏
  "工作與生活平衡",  "保持自己的步調",   "健康的身體",   "活力與精力",   "運動健身",   "良好的作息與睡眠",   "休息、放鬆與什麼事都不做",   "做喜歡的事情",   "平凡單純的生活",   "旅行與探索世界",   "欣賞藝術與自然",   "生活充滿趣味與刺激" 
];

let stage = 1;
let orderA = [], orderB = [];
let compareMap = {};

// ================= Stage 1 =================
function renderStage1() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h2>我的生涯價值偏好</h2>
    <div id="container">
      <div id="left-area" class="area">
        <h3>價值選項</h3>
        <p>這裡列出各種可能影響你人生或職涯的重要價值。<br>請從中挑選你認為最重要的 10 個，拖曳到右側排序區。</p>
        <div id="left-list" class="list"></div>
      </div>
      <div id="right-area" class="area">
        <h3>我的優先價值</h3>
        <p>拖曳調整順序，<br>排出你最優先的價值</p>
        <div id="right-list" class="list"></div>
        <button id="confirmBtn">確認排序</button>
      </div>
    </div>
    <div id="compare-area"></div>
  `;

  const leftList = document.getElementById("left-list");
  const rightList = document.getElementById("right-list");
  const confirmBtn = document.getElementById("confirmBtn");

  options.forEach((label, idx) => {
    const div = document.createElement("div");
    div.className = "block";
    if (idx < 18) div.classList.add("group1");
    else if (idx < 33) div.classList.add("group2");
    else if (idx < 44) div.classList.add("group3");
    else if (idx < 49) div.classList.add("group4");
    else if (idx < 62) div.classList.add("group5");
    div.innerText = label;
    div.dataset.id = idx;
    leftList.appendChild(div);
  });

  new Sortable(leftList, { 
  group: { name: 'blocks', pull: true, put: true }, 
  sort: false, 
  animation: 150,
  fallbackOnBody: true,   // 手機拖曳 fallback
  touchStartThreshold: 0, // 立即開始拖曳
  });

  new Sortable(rightList, {
    group: { name: 'blocks', pull: true, put: true },
    animation: 150,
    fallbackOnBody: true,   // 手機拖曳 fallback
    touchStartThreshold: 0, // 立即開始拖曳
    onAdd: evt => {
      const id = evt.item.dataset.id;
      const exists = Array.from(rightList.children).filter(el => el !== evt.item)
        .some(el => el.dataset.id === id);
      if (exists || rightList.children.length > 10) {
        evt.item.remove();
        alert("最多只能選 10 個，且不能重複");
        return;
      }
      const leftItem = leftList.querySelector(`[data-id="${id}"]`);
      if (leftItem) leftItem.classList.add("disabled");
    },
    onRemove: evt => {
      const id = evt.item.dataset.id;
      const leftItem = leftList.querySelector(`[data-id="${id}"]`);
      if (leftItem) leftItem.classList.remove("disabled");
    }
  });


  confirmBtn.onclick = () => {
    if (rightList.children.length !== 10) { alert("請選滿 10 個"); return; }
    orderA = Array.from(rightList.children).map(el => ({ id: el.dataset.id, label: el.innerText }));
    stage = 2;
    renderStage2();
  };
}


// ================= Stage 2 =================
function renderStage2() {
  const app = document.getElementById("app");
  app.innerHTML = `<div id="compare-area"></div>`;
  const compareArea = document.getElementById("compare-area");
  compareArea.innerHTML = "<h2>請用直覺選擇比較重要的項目</h2>";

  mergeSortWithUser([...orderA], sorted => {
    orderB = sorted;
    stage = 3;
    renderStage3();
  });
}

// ================= Merge Sort with User =================
function merge(left, right, callback) {
  const result = [];
  function step() {
    if (left.length === 0) return callback(result.concat(right));
    if (right.length === 0) return callback(result.concat(left));


    // 隨機決定先比左或右
    const chooseLeftFirst = Math.random() < 0.5;
    const first = chooseLeftFirst ? left[0] : right[0];
    const second = chooseLeftFirst ? right[0] : left[0];

    try {
      compareWithMemory(first, second, () => {
        const key = first.id < second.id
          ? `${first.id}-${second.id}`
          : `${second.id}-${first.id}`;
        const winnerId = compareMap[key];

        if (winnerId === left[0].id) result.push(left.shift());
        else result.push(right.shift());

        step();
      });
    } catch (e) { 
      if (e !== "WAIT_USER") throw e; 
    }
  }
  step();
}

function mergeSortWithUser(list, callback) {
  if (list.length <= 1) return callback(list);
  const mid = Math.floor(list.length / 2);
  const left = list.slice(0, mid);
  const right = list.slice(mid);
  mergeSortWithUser(left, sortedLeft => {
    mergeSortWithUser(right, sortedRight => {
      merge(sortedLeft, sortedRight, sorted => callback(sorted));
    });
  });
}

function getGroupClass(idx) {
  if (idx < 18) return "group1";
  if (idx < 33) return "group2";
  if (idx < 44) return "group3";
  if (idx < 49) return "group4";
  return "group5";
}

function askUser(a, b, onChoose) {
  const compareArea = document.getElementById("compare-area");

  compareArea.innerHTML = `
    <h2>哪一個對你來說比較重要？</h2>
    <div class="compare-cards">
      <div class="compare-card ${getGroupClass(a.id)}" id="cardA">
        ${a.label}
      </div>
      <div class="compare-card ${getGroupClass(b.id)}" id="cardB">
        ${b.label}
      </div>
    </div>
  `;

  document.getElementById("cardA").onclick = () => onChoose(a);
  document.getElementById("cardB").onclick = () => onChoose(b);
}
function compareWithMemory(a, b, callback) {
  const key = a.id < b.id ? `${a.id}-${b.id}` : `${b.id}-${a.id}`;
  if (compareMap[key]) return callback();
  askUser(a, b, winner => { compareMap[key] = winner.id; callback(); });
  throw "WAIT_USER";
}

// ================= Stage 3 =================
function renderStage3() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div id="export-area" style="display:inline-block;">
      <h2>排序完成！</h2>

      <!-- 主結果表格 -->
      <table id="result-table" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>認知偏好排序</th>
            <th>行為偏好排序</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>

      <p>一致率：<span id="greenRatio"></span></p>
      <div id="comment-container"></div>

      <!-- 分布表格 -->
      <h3>重要價值觀偏好取向</h3>
      <table id="group-table" style="border-collapse: collapse; width: 100%;">
        <tbody>
          <tr><td class="group1">成就與資源取向</td><td id="group1-perc">0%</td></tr>
          <tr><td class="group2">意義與品格取向</td><td id="group2-perc">0%</td></tr>
          <tr><td class="group3">人際關係取向</td><td id="group3-perc">0%</td></tr>
          <tr><td class="group4">家庭與責任取向</td><td id="group4-perc">0%</td></tr>
          <tr><td class="group5">自主與生活取向</td><td id="group5-perc">0%</td></tr>
        </tbody>
      </table>
    </div>

    <div class="bottom-btns" style="margin-top: 10px;">
      <button id="downloadBtn">結果表格下載成圖片</button>
      <button id="restartBtn">再來一次</button>
    </div>
  `;

  // 加上表格換行 CSS
const style = document.createElement("style");
style.textContent = `
  /* 表格換行 */
  #result-table td, #group-table td {
    white-space: normal !important;
    word-break: break-word !important;
    padding: 6px 8px;
    border: 1px solid #999;
  }

  /* 表格置中 */
  #group-table, #result-table {
    margin: 0 auto;
    border-collapse: collapse;
  }

  #group-table td, #result-table th, #result-table td {
    text-align: center;  /* 置中表格文字，可依需求調整 */
  }

  /* comment 自動換行 */
  #comment {
    white-space: normal;
    word-break: break-word;
    max-width: 100%;
  }
`;
document.head.appendChild(style);

  // 渲染排序結果
  showResultTable(orderA, orderB);
  showGroupDistribution(orderB);

  // 按鈕事件
  document.getElementById("restartBtn").onclick = () => {
    compareMap = {};
    orderA = [];
    orderB = [];
    stage = 1;
    renderStage1();
  };

  document.getElementById("downloadBtn").onclick = () => {
    const container = document.getElementById("export-area");
    html2canvas(container, { scale: 2, useCORS: true }).then(canvas => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "排序結果.png";
      link.click();
    });
  };
}

// ===== 顯示排序結果表格 =====
function showResultTable(orderA, orderB) {
  const tbody = document.querySelector("#result-table tbody");
  const greenRatioEl = document.getElementById("greenRatio");
  const commentEl = document.getElementById("comment");
  tbody.innerHTML = "";

  const n = orderA.length;
  let totalScore = 0;

  // 計算每個元素的顏色與分數
  const colorMap = {}; // {id: {color, score}}
  orderA.forEach((itemA, i) => {
    const posAinB = orderB.findIndex(x => x.id === itemA.id);
    const diff = Math.abs(i - posAinB);


    let color = "";
    let score = 0;
    if (diff === 0) { color = "#c8e6c9"; score = 1; }       // 綠色
    else if (diff === 1) { color = "#f8bbd0"; score = 0.5; } // 粉紅色
    else { color = "#c9515d"; score = 0; }                   // 深紅色

    colorMap[itemA.id] = { color, score };
    totalScore += score;
  });

  // 渲染表格
  for (let i = 0; i < n; i++) {
    const tr = document.createElement("tr");
    const tdA = document.createElement("td");
    const tdB = document.createElement("td");

    const itemA = orderA[i];
    const itemB = orderB[i];

    tdA.textContent = itemA.label;
    tdB.textContent = itemB.label;

    // 使用元素本身的顏色
    tdA.style.backgroundColor = colorMap[itemA.id].color;
    tdB.style.backgroundColor = colorMap[itemB.id].color;

    tr.append(tdA, tdB);
    tbody.appendChild(tr);
  }

  // 一致性百分比
  const ratio = Math.round((totalScore / n) * 100);
  greenRatioEl.textContent = ratio + "%";

  // 評語
let comment = "";
if (ratio === 100) comment = "你的認知偏好與行為偏好完全一致，你對自己做價值選擇的理由有清楚的理解。"; 
else if (ratio >= 60) comment = "你的認知偏好與行為偏好幾乎一致，多數時候你能理解自己的選擇，但偶爾可以停下來想想是什麼因素影響了你的決定。"; 
else comment = "你的認知偏好與行為偏好之間存在較大落差，這表示你的選擇可能同時受到多種壓力影響，可以試著探索自己重要的價值是什麼。"; 

// 生成淺黃色圓角矩形包住 comment
const commentContainer = document.getElementById("comment-container");
commentContainer.textContent = comment;
commentContainer.style.backgroundColor = "#FFF9C4"; // 淺黃色
commentContainer.style.borderRadius = "8px";        // 圓角
commentContainer.style.border = "3px dashed #FFCC80"; // 3px 粗的淺橘色邊框
commentContainer.style.padding = "12px";            // 內邊距
commentContainer.style.maxWidth = "600px";          // 可以和表格寬度差不多
commentContainer.style.margin = "10px auto";        // 上下間距 + 置中
commentContainer.style.whiteSpace = "normal";       // 自動換行
commentContainer.style.wordBreak = "break-word";    // 避免長單字超出
}

// ===== 顯示 group 分布百分比 =====
function showGroupDistribution(sortedList) {
  const groupCounts = [0,0,0,0,0]; // group1~group5
  sortedList.forEach(item => {
    if (item.id < 18) groupCounts[0]++;
    else if (item.id < 33) groupCounts[1]++;
    else if (item.id < 44) groupCounts[2]++;
    else if (item.id < 49) groupCounts[3]++;
    else groupCounts[4]++;
  });

  const total = sortedList.length;
  for (let i=0;i<5;i++) {
    const perc = Math.round((groupCounts[i]/total)*100) + "%";
    document.getElementById(`group${i+1}-perc`).textContent = perc;
  }
}

// ================== 開始 ==================
renderStage1();

});

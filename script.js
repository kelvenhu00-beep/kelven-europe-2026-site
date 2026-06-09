const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".day-card");
const summaries = document.querySelectorAll(".day-card__summary");
const currentPhase = document.querySelector("#current-phase");
const nextStep = document.querySelector("#next-step");
const criticalReminder = document.querySelector("#critical-reminder");
const quickJumpText = document.querySelector("#quick-jump-text");

const tripStages = [
  {
    from: "2026-06-22",
    to: "2026-06-22",
    phase: "6/22 广州 → 上海",
    next: "CA1866 20:55 广州 T3 起飞，23:20 抵达 PVG T2。",
    reminder: "当晚住上海浦东机场假日酒店，不按 T1 候机过夜处理。",
    jump: "展开 6/22 卡片，重点看住宿和抵达后的处理。"
  },
  {
    from: "2026-06-23",
    to: "2026-06-23",
    phase: "6/23 PVG → AMS",
    next: "KL896 11:15 从 PVG T1 起飞，19:10 抵达 AMS。",
    reminder: "晚上住 citizenM Schiphol，目标 21:30 简餐后早睡。",
    jump: "展开 6/23 卡片，重点看 AMS 入住和 6/24 早起。"
  },
  {
    from: "2026-06-24",
    to: "2026-06-26",
    phase: "CGF 维也纳峰会",
    next: "优先看当天会议卡片顶部的今日主轴和必到场次。",
    reminder: "6/24 晚 L'Oréal Gala 需要 Black Tie；6/25 10:50 聚焦中国；6/26 12:15 ACV 门口集合参加中国考察团参访。",
    jump: "筛选 CGF，展开当天会议卡片。"
  },
  {
    from: "2026-06-27",
    to: "2026-06-28",
    phase: "团队大巴游",
    next: "按团队时间上车、退房、领票，避免新天鹅堡定时入场延误。",
    reminder: "6/28 手提护照、充电器、防晒和外套，行李锁大巴。",
    jump: "筛选景点或交通，查看 Salzburg 和新天鹅堡。"
  },
  {
    from: "2026-06-29",
    to: "2026-06-29",
    phase: "Allgäu 徒步准备日",
    next: "Westin 大堂 Sixt 取奥迪 A5，13:30 到 World of Outdoor Sonthofen。",
    reminder: "到 Prinz-Luitpold-Bad 后预约 Detox Massage、06:50 出租车、05:30 打包早餐。",
    jump: "展开 6/29 卡片，逐项勾选装备清单。"
  },
  {
    from: "2026-06-30",
    to: "2026-06-30",
    phase: "Schrecksee 徒步主战日",
    next: "05:15 查 bergfex.com 天气，06:50 酒店出租车去 Hinterstein。",
    reminder: "09:15 未到 Untere Älpele 就取消返回；雷声或积雨云立即下撤。",
    jump: "展开 6/30 卡片，优先看安全开关和公交末班。"
  },
  {
    from: "2026-07-01",
    to: "2026-07-01",
    phase: "Tegernsee → MUC → AMS",
    next: "13:00 Tegernsee Bräustüberl 午餐，17:30 MUC Sixt 还车。",
    reminder: "18:00 KLM check-in，行李挂 AMS，不挂 PVG；晚间住 AMS 机场 Hilton。",
    jump: "展开 7/1 卡片，重点看返程节奏和行李策略。"
  },
  {
    from: "2026-07-02",
    to: "2026-07-03",
    phase: "AMS → PVG 返程",
    next: "7/2 10:00 KLM Counter 9 check-in，10:30 办欧盟退税。",
    reminder: "退税只在 AMS Schiphol 办，先 Customs 盖章，再 Premier Tax Free / Global Blue。",
    jump: "展开 7/2 卡片，重点看退税和登机。"
  }
];

const toLocalDate = (value) => new Date(`${value}T00:00:00`);

const updateCurrentStage = () => {
  if (!currentPhase || !nextStep || !criticalReminder || !quickJumpText) {
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activeStage = tripStages.find((stage) => {
    const from = toLocalDate(stage.from);
    const to = toLocalDate(stage.to);
    return today >= from && today <= to;
  });

  const upcomingStage = tripStages.find((stage) => today < toLocalDate(stage.from));
  const stage = activeStage || upcomingStage;

  if (!stage) {
    currentPhase.textContent = "行程已结束";
    nextStep.textContent = "09:25 抵达 PVG 后回家。";
    criticalReminder.textContent = "保留票据、退税单和关键联系方式。";
    quickJumpText.textContent = "如需复盘，查看会议日和徒步日卡片。";
    return;
  }

  currentPhase.textContent = activeStage ? stage.phase : "出发前准备";
  nextStep.textContent = activeStage ? stage.next : `下一关键节点：${stage.phase}。${stage.next}`;
  criticalReminder.textContent = stage.reminder;
  quickJumpText.textContent = stage.jump;
};

updateCurrentStage();

summaries.forEach((button) => {
  button.addEventListener("click", () => {
    const body = button.parentElement.querySelector(".day-card__body");
    const expanded = button.getAttribute("aria-expanded") === "true";

    if (!expanded) {
      summaries.forEach((otherButton) => {
        if (otherButton === button) {
          return;
        }

        const otherBody = otherButton.parentElement.querySelector(".day-card__body");
        otherButton.setAttribute("aria-expanded", "false");
        otherBody.hidden = true;
      });
    }

    button.setAttribute("aria-expanded", String(!expanded));
    body.hidden = expanded;
  });
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("is-active", item === button));

    cards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

document.querySelectorAll(".checklist").forEach((list) => {
  const key = `kelven-europe-2026-${list.dataset.checklist}`;
  const saved = JSON.parse(localStorage.getItem(key) || "[]");
  const inputs = list.querySelectorAll("input[type='checkbox']");

  inputs.forEach((input, index) => {
    input.checked = Boolean(saved[index]);
    input.addEventListener("change", () => {
      const state = Array.from(inputs).map((item) => item.checked);
      localStorage.setItem(key, JSON.stringify(state));
    });
  });
});

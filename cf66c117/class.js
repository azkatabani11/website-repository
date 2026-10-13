// HEAL guided class player: choose duration -> follow along with timed exercises

(function () {
  "use strict";

  var CLASSES = {
    yoga: {
      title: "Morning Glow Yoga",
      coach: "Coach Tala Noor · Mindful awakening",
      desc: "A gentle flow to wake the spine, open the hips and set a calm rhythm for the day. No experience needed — breathe and move at your own pace.",
      hero: "assets/class-yoga.jpg",
      exercises: [
        { name: "Sun Salutation Flow", img: "assets/yoga-sun-salutation.jpg", focus: "Warm-up · Breath", steps: ["Inhale, sweep the arms overhead", "Exhale, hinge at the hips and fold forward", "Soften the knees, lengthen the spine and roll up tall"] },
        { name: "Warrior II", img: "assets/yoga-warrior.jpg", focus: "Strength · Grounding", steps: ["Step the feet wide, front knee stacked over the ankle", "Open the arms parallel to the floor", "Gaze softly over the front fingertips"] },
        { name: "Child's Pose Breath", img: "assets/yoga-child-stretch.jpg", focus: "Recovery · Calm", steps: ["Knees wide, big toes touching", "Sit the hips back toward the heels", "Lengthen the arms forward and breathe into the back body"] },
        { name: "Standing Forward Fold", img: "assets/yoga-sun-salutation.jpg", focus: "Hamstrings · Release", steps: ["Feet hip-width, knees generous", "Let the head hang heavy", "Micro-bend and sway to release the lower back"] },
        { name: "Reverse Warrior", img: "assets/yoga-warrior.jpg", focus: "Side body · Open", steps: ["From Warrior II, stack the arms by the ears", "Lean the torso back over the front leg", "Long through the waist, breathe steadily"] },
        { name: "Slow Breath Reset", img: "assets/yoga-child-stretch.jpg", focus: "Nervous system · Ease", steps: ["Rest in child's pose or seated", "Inhale for 4 counts, exhale for 6", "Let the shoulders melt away from the ears"] }
      ]
    },
    pilates: {
      title: "Core Reformer Pilates",
      coach: "Coach Daniel Vance · Precision form",
      desc: "Controlled core work for posture and a strong, stable midline. Quality over quantity — keep every movement precise and steady.",
      hero: "assets/class-pilates.jpg",
      exercises: [
        { name: "The Hundred", img: "assets/pilates-hundred.jpg", focus: "Core · Endurance", steps: ["Lie on your back, legs in tabletop", "Lift head and shoulders, arms pulsing", "Inhale for 5 pulses, exhale for 5"] },
        { name: "Side Leg Lift", img: "assets/pilates-leg-lift.jpg", focus: "Hips · Glutes", steps: ["Lie on your side, body in one long line", "Lift the top leg to hip height", "Lower slowly with control, then switch sides"] },
        { name: "Cat-Camel Flow", img: "assets/pilates-cat-camel.jpg", focus: "Spine · Mobility", steps: ["All fours, hands under shoulders", "Round the spine out on the exhale", "Arc gently back down on the inhale"] },
        { name: "Hundred Marches", img: "assets/pilates-hundred.jpg", focus: "Deep core · Control", steps: ["Hold the hundred position", "Tap one foot down at a time", "Keep the pelvis completely still"] },
        { name: "Side Kick Series", img: "assets/pilates-leg-lift.jpg", focus: "Balance · Hips", steps: ["From side-lying, lift the top leg", "Kick forward and pulse back", "Rotate the heel to press the knee down"] },
        { name: "Spine Twist Reset", img: "assets/pilates-cat-camel.jpg", focus: "Mobility · Finisher", steps: ["Seated tall, knees bent", "Inhale to lengthen the spine", "Exhale and twist from the waist, not the shoulders"] }
      ]
    },
    hiit: {
      title: "Dopamine HIIT Reset",
      coach: "Coach Maya Lin · Heart rate lift",
      desc: "Short, energetic bursts to lift the heart rate and clear the mind. Land softly, keep good form, and rest fully between rounds.",
      hero: "assets/class-hiit.jpg",
      exercises: [
        { name: "Jumping Jacks", img: "assets/hiit-jumping-jacks.jpg", focus: "Full body · Warm-up", steps: ["Arms and legs open together", "Return to standing with control", "Keep a light, springy rhythm"] },
        { name: "High Knees", img: "assets/hiit-high-knees.jpg", focus: "Cardio · Legs", steps: ["Drive one knee to hip height", "Pump the arms in rhythm", "Stay tall, land on the balls of the feet"] },
        { name: "Squat Bursts", img: "assets/hiit-squat-burst.jpg", focus: "Legs · Power", steps: ["Squat hips to parallel, chest up", "Press up onto the toes", "Sink back down immediately and repeat"] },
        { name: "Star Jumps", img: "assets/hiit-jumping-jacks.jpg", focus: "Full body · Explosive", steps: ["Tuck down like a star", "Jump wide and tall", "Absorb the landing softly"] },
        { name: "Fast Feet Run", img: "assets/hiit-high-knees.jpg", focus: "Cardio · Agility", steps: ["Run in place with quick, short steps", "Hands light and elbows bent", "Finish strong — no slowing the last 10 seconds"] },
        { name: "Jump Squats", img: "assets/hiit-squat-burst.jpg", focus: "Power · Finisher", steps: ["Squat, then hop upward", "Land soft, knees tracking over toes", "Go straight into the next rep"] }
      ]
    }
  };

  // work/rest seconds per chosen duration (minutes)
  var TEMPO = { 15: { work: 40, rest: 20 }, 30: { work: 45, rest: 15 }, 45: { work: 50, rest: 20 } };

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    setup: $("setup"), player: $("player"), done: $("done"),
    title: $("class-title"), desc: $("class-desc"), chip: $("setup-chip"),
    heroImg: $("class-hero-img"), form: $("setup-form"),
    playerTitle: $("player-title"), phase: $("player-phase"),
    stageImg: $("stage-img"), stageFocus: $("stage-focus"), stageName: $("stage-name"),
    stageSteps: $("stage-steps"), stageTimer: $("stage-timer"),
    fill: $("progress-fill"), elapsed: $("elapsed-label"), total: $("total-label"), index: $("index-label"),
    play: $("play-btn"), prev: $("prev-btn"), next: $("next-btn"),
    stop: $("stop-btn"), sound: $("sound-btn"), doneSummary: $("done-summary"), repeat: $("repeat-btn")
  };

  var yearEl = $("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var key = new URLSearchParams(location.search).get("class") || "yoga";
  var cls = CLASSES[key] || CLASSES.yoga;

  els.title.textContent = cls.title;
  els.desc.textContent = cls.desc;
  els.chip.textContent = "● " + cls.coach;
  els.heroImg.src = cls.hero;
  els.heroImg.alt = cls.title + " — class preview";

  var session = null; // { blocks, i, left, elapsed, total, timer }
  var soundOn = true;

  function buildBlocks(minutes) {
    var total = minutes * 60;
    var t = TEMPO[minutes];
    var blocks = [];
    var i = 0;
    var used = 0;
    while (used < total) {
      var ex = cls.exercises[i % cls.exercises.length];
      var remain = total - used;
      var work = Math.min(t.work, remain);
      blocks.push({ type: "work", seconds: work, ex: ex });
      used += work;
      if (used >= total) break;
      var rest = Math.min(t.rest, total - used);
      blocks.push({ type: "rest", seconds: rest, next: cls.exercises[(i + 1) % cls.exercises.length] });
      used += rest;
      i++;
    }
    return blocks;
  }

  function fmt(s) {
    return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
  }

  function speak(text) {
    if (!soundOn || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch (e) { /* voice guidance is optional */ }
  }

  function showBlock() {
    var b = session.blocks[session.i];
    var ex = b.type === "work" ? b.ex : b.next;
    els.stageImg.src = ex.img;
    els.stageImg.alt = ex.name + " — demonstration image";
    els.stageName.textContent = b.type === "work" ? ex.name : "Rest · Next up: " + ex.name;
    els.stageFocus.textContent = b.type === "work" ? ex.focus : "Breathe · recover";
    els.phase.textContent = (b.type === "work" ? "Exercise" : "Rest") + " — keep following the steps";
    els.stageSteps.innerHTML = "";
    if (b.type === "work") {
      ex.steps.forEach(function (s) {
        var li = document.createElement("li");
        li.textContent = s;
        els.stageSteps.appendChild(li);
      });
    }
    els.index.textContent = String(session.blocks.filter(function (x, n) { return x.type === "work" && n <= session.i; }).length);
    restartAnim();
    if (b.type === "work") {
      speak("Next up, " + ex.name + ". " + ex.steps[0] + ".");
    } else {
      speak("Rest. " + ex.name + " coming next.");
    }
    tick();
  }

  function tick() {
    var b = session.blocks[session.i];
    els.stageTimer.textContent = b.type === "rest" ? "" : String(session.left);
    var done = session.elapsed;
    els.elapsed.textContent = fmt(done);
    els.total.textContent = fmt(session.total);
    els.fill.style.width = (done / session.total * 100) + "%";
  }

  function restartAnim() {
    var stage = $("stage");
    stage.classList.remove("anim");
    void stage.offsetWidth;
    stage.classList.add("anim");
  }

  function advance() {
    session.i++;
    if (session.i >= session.blocks.length) { finish(); return; }
    session.left = session.blocks[session.i].seconds;
    showBlock();
  }

  function step() {
    session.left--;
    session.elapsed++;
    if (session.left <= 0) { advance(); return; }
    tick();
  }

  function start(minutes) {
    session = {
      blocks: buildBlocks(minutes),
      i: 0,
      left: 0,
      elapsed: 0,
      total: minutes * 60,
      timer: null
    };
    session.left = session.blocks[0].seconds;
    els.setup.hidden = true;
    els.done.hidden = true;
    els.player.hidden = false;
    els.playerTitle.textContent = cls.title + " · " + minutes + " min";
    window.scrollTo(0, 0);
    showBlock();
    setPlaying(true);
  }

  function setPlaying(on) {
    if (session && session.timer) { clearInterval(session.timer); session.timer = null; }
    if (on) {
      session.timer = setInterval(step, 1000);
      els.play.textContent = "⏸ Pause";
      els.play.setAttribute("aria-label", "Pause session");
    } else {
      els.play.textContent = "▶ Resume";
      els.play.setAttribute("aria-label", "Resume session");
    }
  }

  function finish() {
    if (session.timer) clearInterval(session.timer);
    els.player.hidden = true;
    els.done.hidden = false;
    var rounds = session.blocks.filter(function (b) { return b.type === "work"; }).length;
    els.doneSummary.textContent = "You completed " + cls.title + " — " + rounds + " guided exercises, " + fmt(session.total) + " of movement. Drink water and enjoy the glow.";
    speak("Session complete. Beautiful work.");
    window.scrollTo(0, 0);
  }

  function stopToSetup() {
    if (session && session.timer) clearInterval(session.timer);
    session = null;
    els.player.hidden = true;
    els.done.hidden = true;
    els.setup.hidden = false;
    window.scrollTo(0, 0);
  }

  els.form.addEventListener("submit", function (e) {
    e.preventDefault();
    start(Number(els.form.elements.duration.value));
  });

  els.play.addEventListener("click", function () {
    var running = session && session.timer;
    if (running) {
      clearInterval(session.timer);
      session.timer = null;
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  });

  els.next.addEventListener("click", function () { if (session) advance(); });
  els.prev.addEventListener("click", function () {
    if (!session) return;
    session.i = Math.max(0, session.i - 1);
    session.left = session.blocks[session.i].seconds;
    showBlock();
  });
  els.stop.addEventListener("click", stopToSetup);
  els.repeat.addEventListener("click", function () {
    var m = Number(els.form.elements.duration.value);
    els.done.hidden = true;
    start(m);
  });

  els.sound.addEventListener("click", function () {
    soundOn = !soundOn;
    els.sound.textContent = soundOn ? "🔊 Voice on" : "🔇 Voice off";
    els.sound.setAttribute("aria-pressed", soundOn ? "true" : "false");
    if (!soundOn && "speechSynthesis" in window) window.speechSynthesis.cancel();
  });
})();

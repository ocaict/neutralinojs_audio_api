/*OcaMedia*/
// Initialize Neutralino
Neutralino.init();
function onWindowClose() {
  Neutralino.app.exit();
}
// Register event listeners

Neutralino.events.on("windowClose", onWindowClose);

document.addEventListener("DOMContentLoaded", async (e) => {
  // Cache the DOM

  const minimizeBtn = document.querySelector(".btn-minimize");
  const closeBtn = document.querySelector(".btn-close");

  const mediaHeader = document.querySelector(".header");
  const mediaHeaderBtns = document.querySelector(".header-btn-group");
  const detailsContainer = document.querySelector(".details-container");

  const playPauseBtn = document.querySelector(".play-pause-btn");
  const stopBtn = document.querySelector(".stop-btn");
  const range = document.querySelector(".range");
  const fileInput = document.querySelector("#file");
  const streamInput = document.querySelector(".stream");
  const fileNameContainer = document.querySelector(".file-name");
  const toggleRepeatBtn = document.querySelector(".toggle-repeat-btn");

  // Global Variables
  let file = null;
  const defaultAudio = "../files/ad.mp3";
  const details = {
    fileName: "Oca Media Intro",
  };
  let repeat = false;

  // Audio Constructor
  const audio = new Audio(defaultAudio);

  const setPlayImage = () => {
    detailsContainer.style.background = `url(../images/wave2.gif) no-repeat center center`;
    detailsContainer.style.backgroundSize = "cover";
  };

  const setPauseImage = () => {
    detailsContainer.style.background = `url(../images/wavepause.png) no-repeat center center`;
    detailsContainer.style.backgroundSize = "cover";
  };

  const setStopImage = () => {
    detailsContainer.style.background = `url(../images/audio.jpeg) no-repeat center center`;
    detailsContainer.style.backgroundSize = "cover";
  };

  const playAudio = () => {
    audio.play();
    playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  };
  const pauseAudio = () => {
    playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    audio.pause();
    setPauseImage();
  };
  const stopAudio = () => {
    audio.currentTime = 0;
    audio.pause();
    streamInput.disabled = false;
    playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    setStopImage();
  };

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  });

  // Stop Event
  stopBtn.addEventListener("click", () => {
    stopAudio();
  });

  // Range Input control Volume
  const volumeValue = document.querySelector(".volume-value");
  const volumeIcon = document.querySelector(".volume-icon");
  range.addEventListener("input", (e) => {
    const rangeValue = e.target.value / 100;
    audio.volume = rangeValue;
    const rangePercent = Math.floor(rangeValue * 100);
    volumeValue.textContent = `${rangePercent}%`;
    if (rangePercent === 0) {
      volumeIcon.classList.remove("fa-volume-down");
      volumeIcon.classList.remove("fa-volume-up");
      volumeIcon.classList.add("fa-volume-mute");
    } else if (rangePercent <= 50) {
      volumeIcon.classList.add("fa-volume-down");
      volumeIcon.classList.remove("fa-volume-up");
      volumeIcon.classList.remove("fa-volume-mute");
    } else {
      volumeIcon.classList.remove("fa-volume-down");
      volumeIcon.classList.add("fa-volume-up");
      volumeIcon.classList.remove("fa-volume-mute");
    }
  });

  // Helper Function to get file details
  const fileDetails = (file) => {
    const size = (file.size / 1024 / 1024).toFixed(2);
    const fileName = file.name.split(".")[0];
    const ext = file.name.split(".")[1];
    const type = file.type;

    return { size, fileName, ext, type };
  };

  // File selection and Reading
  fileInput.addEventListener("change", (e) => {
    file = e.target.files[0];
    const { size, ext } = fileDetails(file);
    const acceptedExtensions = ["mp3", "wav", "amr", "wav"];

    if (!acceptedExtensions.includes(ext)) {
      alert("File Format Not Supported");
      return;
    }

    if (size > 40) {
      alert("File Too Large");
      return;
    }

    const fileReader = new FileReader();

    fileReader.onloadend = function () {
      playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
      fileNameContainer.innerHTML = "Click Play button";
      audio.src = this.result;
      audio.play();
      setPauseImage();
    };
    fileReader.readAsDataURL(file);
  });

  // Listen to Playing Event
  audio.addEventListener("playing", (e) => {
    console.log("Playing...");
    setPlayImage();

    streamInput.disabled = true;
    if (file) {
      details.fileName = fileDetails(file).fileName;
    }

    fileNameContainer.innerHTML = details.fileName;
    playPauseBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  });

  // Listen to End Event
  audio.addEventListener("ended", (e) => {
    if (repeat) return audio.play();
    console.log("Ended.....");
    playPauseBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    streamInput.disabled = false;
    setPauseImage();
    details.fileName = "OcaMedia";
    fileNameContainer.innerHTML = details.fileName;
  });

  // Error Handler
  audio.onerror = () => {
    alert("Something Went Wrong");
  };

  streamInput.addEventListener("change", (e) => {
    if (e.target.value) {
      audio.src = e.target.value;
      audio.play();
      details.fileName = "Streaming...";
    }
  });

  minimizeBtn.addEventListener("click", async () => {
    await Neutralino.window.minimize();
  });
  closeBtn.addEventListener("click", async () => {
    Neutralino.app.exit();
  });
  toggleRepeatBtn.addEventListener("click", async () => {
    if (repeat) {
      repeat = false;
      toggleRepeatBtn.classList.remove("active");
    } else {
      repeat = true;
      toggleRepeatBtn.classList.add("active");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.which === 32) {
      if (audio.paused) return playAudio();
      return pauseAudio();
    }
  });
  await Neutralino.window.setDraggableRegion(mediaHeader);
  await Neutralino.window.unsetDraggableRegion(mediaHeaderBtns);
});

window.addEventListener("contextmenu", (e) => e.preventDefault());

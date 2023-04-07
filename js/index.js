const audio = document.getElementById("myAudio");
const musicName = document.getElementById("name");
const singer = document.getElementById("singer");
const musicTime = document.getElementById("music-time");
const progressBarWrapper = document.getElementById("progressBarWrapper");
const progressBarFill = document.getElementById("progressBarFill");
const progressBuffer = document.getElementById("progressBuffer");
const volumeSlider = document.getElementById("volumeSlider");
const volumeSliderFill = document.getElementById("volumeSliderFill");
const volumeSliderThumb = document.getElementById("volumeSliderThumb");
const playBtn = document.getElementById("playBtn");
const playSvg = document.getElementById("play-svg");
const pauseSvg = document.getElementById("pause-svg");
const prvBtn = document.getElementById("prv-play");
const nextBtn = document.getElementById("next-play");
const ulEl = document.getElementById("track-wrapper");
const lis = document.querySelectorAll("#track-wrapper li");
const lisArr = Array.from(lis);
const lrcContainer = document.querySelector(".lrc-container");

const lrcWrapper = document.querySelector("#lrc_wrapper");

const volumeIcons = new Map([
  [
    {
      min: 0,
      max: 0,
    },
    document.getElementById("mute"),
  ],
  [
    {
      min: 0.00001,
      max: 0.5,
    },
    document.getElementById("medium-volume"),
  ],
  [
    {
      min: 0.50001,
      max: 1,
    },
    document.getElementById("big-volume"),
  ],
]);

// const musicPlaylist = [
//   {
//     title: "我们的歌",
//     artist: "王力宏",
//     url: "./王力宏 - 我们的歌.flac",
//   },
// ];

const musicPlaylist = [
  {
    title: "月半小夜曲",
    artist: "李克勤",
    url: "../李克勤 - 月半小夜曲.flac",
  },
];

// const lrc = `
//      [00:00.000] 作词 : 王力宏/陈信延\n[00:01.000] 作曲 : 王力宏\n[00:02.000] 编曲 :王力宏\n[00:03.000]\n[00:16.102]已经听了一百遍\n
//      [00:19.540]怎么听都不会倦\n
//      [00:22.907]从白天唱到黑夜\n
//      [00:26.185]你一直在身边\n[00:29.854]如果世界太危险\n[00:33.247]只有音乐最安全\n[00:36.692]带着我进梦里面\n[00:39.859]让歌词都实现\n
//      [00:42.909]无论是开心还是难过我的爱一直不变\n[00:46.746]不必担心时间流逝带走一切\n
//      [00:49.738]无论是Hip-Hop还是摇滚我的爱一直不变\n[00:53.574]所有美好回忆记录在里面\n[00:56.606]这种 Forever Love 那么深\n
//      [00:58.955]我们的歌那么真\n
//      [01:00.692]无国界跨时代\n
//      [01:02.377]再也不会叫我Kiss Goodbye\n
//      [01:03.909]要每一句能够动人心弦Yeah\n[01:10.972]情人总分分合合\n[01:13.926]可是我们却越爱越深\n
//      [01:17.807]认识你让我的幸福如此悦耳\n[01:24.663]能不能不要切歌\n[01:27.647]继续唱我们的歌​​\n[01:31.541]让感动一辈子都记得\n[01:36.312]\n[01:48.668]已经听了一百遍\n[01:52.103]怎么听都不会倦\n[01:55.549]从白天唱到黑夜\n[01:58.735]你一直在身边\n[02:02.376]如果世界太危险\n[02:05.799]只有音乐最安全\n[02:09.189]带着我进梦里面\n[02:12.391]让歌词都实现\n[02:15.445]无论是开心还是难过我的爱一直不变\n[02:19.283]不必担心时间流逝带走一切\n
//      [02:22.311]无论是Hip-Hop还是摇滚我的爱一直不变\n[02:26.120]所有美好回忆记录在里面\n[02:29.179]这种 Forever Love 那么深\n
//      [02:31.519]我们的歌那么真\n[02:33.244]无国界跨时代\n[02:34.959]再也不会叫我Kiss Goodbye\n
//      [02:36.420]要每一句能够动人心弦Yeah\n[02:43.511]情人总分分合合\n[02:46.474]可是我们却越爱越深\n
//      [02:50.374]认识你让我的幸福如此悦耳\n
//      [02:57.209]能不能不要切歌\n
//      [03:00.185]继续唱我们的歌​​\n[03:04.105]让感动一辈子都记得\n[03:08.830]\n[03:36.623]情人总分分合合\n[03:39.635]可是我们却越爱越深\n
//      [03:43.517]认识你让我的幸福如此悦耳\n
//      [03:50.367]能不能不要切歌\n[03:53.302]继续唱我们的歌​​\n[03:57.225]让感动一辈子都记得\n[04:03.825]电吉他/其他乐器：王力宏\n
//      [04:04.061]鼓手：EricFawcrtt\n[04:04.446]贝斯：John Mumson\n[04:04.644]录音师/录音室：王力宏/Homeboy Music Studios,Taipei\n
//      [04:04.824]OP：HIM Music Publishing Inc.\n[04:05.013]OP：Homeboy Music,Inc,Taiwan\n
//      [04:05.163]SP：Sony Music Publishing(Pre)Ltd.TaiwanBranch\n

//     `;

let lrc = ``;

let currentPlayIndex = 0;
let duration = "00:00";
let lyricData = [];
let lyricItems;
let prevLyricIndex = -1; //前一行歌词下标

fetch("李克勤 - 月半小夜曲.lrc")
  .then((response) => {
    if (response.status == 200) {
      return response.text();
    }
    return Promise.reject(response.statusText);
  })
  .then((data) => {
    lyricData = parseLyric(data);
    console.log(lyricData);
    // 创建歌词节点
    createLyricEl();
    console.log(lrc);
  })
  .catch((error) => {
    // 处理请求失败的情况
    console.log(error);
  });

function initMusicPlayer() {
  audio.volume = 0.5;
  audio.src = musicPlaylist[currentPlayIndex].url;
  updateMusicTitle();
  setCurrentPlayTruckBg();

  // 初始化音量条
  const volume = audio.volume;
  setVolumeSvg(volume);
  const percentage = volume * 100;
  volumeSliderFill.style.width = `${percentage}%`;
  volumeSliderThumb.style.left = `calc(${percentage}% - 6px)`;

  // 绑定事件处理函数
  playBtn.addEventListener("click", togglePlay);
  prvBtn.addEventListener("click", prvPlay);
  nextBtn.addEventListener("click", nextPlay);
  volumeSlider.addEventListener("mousedown", startVolumeSlide);
  progressBarWrapper.addEventListener("mousedown", startProgressSlide);
  progressBarWrapper.addEventListener("mousedown", startProgressSlide);
  ulEl.addEventListener("click", playTrackList);
  audio.addEventListener("play", handleAudioPlayback);
  audio.addEventListener("pause", handleAudioPlayback);
  audio.addEventListener("progress", updateBufferedProgress);
  audio.addEventListener("timeupdate", updatePlayProgress);
  audio.addEventListener("loadedmetadata", onLoadedmetadata);
  audio.addEventListener("ended", onEnded);
}
// 音频元数据下载完毕后 更新时间
function onLoadedmetadata() {
  duration = formatSongsTime(audio.duration);
  updateMusicTime();
}
// 媒体文件播放结束或者没有更多可用的数据而停止时被触发
function onEnded() {
  audio.currentTime = 0;
  scrollLyric(1);
  console.log("达到了媒体的未尾");
}
//更新音乐时间
function updateMusicTime() {
  musicTime.innerHTML = `${formatSongsTime(audio.currentTime)} / ${duration}`;
}
// 格式化时间
function formatSongsTime(duration) {
  let minute = Math.floor(duration / 60)
    .toString()
    .padStart(2, "0");
  let second = Math.floor(duration % 60)
    .toString()
    .padStart(2, "0");
  return `${minute}:${second}`;
}
// 更新歌曲标题
function updateMusicTitle(duration) {
  musicName.innerHTML = musicPlaylist[currentPlayIndex].title;
  singer.innerHTML = musicPlaylist[currentPlayIndex].artist;
}
// 设置音量图标
function setVolumeSvg(volume) {
  for (const [range, icon] of volumeIcons.entries()) {
    if (volume >= range.min && volume <= range.max) {
      icon.style.display = "block";
    } else {
      icon.style.display = "none";
    }
  }
}
// 设置当前播放歌曲的背景色
function setCurrentPlayTruckBg() {
  lisArr.forEach((item) => (item.style.background = ""));
  lisArr[currentPlayIndex].style.background = "#f8f8f8";
}
// 切换播放状态
function togglePlay() {
  audio.paused ? audio.play() : audio.pause();
}
// 上一首
function prvPlay() {
  currentPlayIndex =
    (currentPlayIndex - 1 + musicPlaylist.length) % musicPlaylist.length;
  switchMusic();
}
// 下一首
function nextPlay() {
  currentPlayIndex = (currentPlayIndex + 1) % musicPlaylist.length;
  switchMusic();
}
// 切换音乐
function switchMusic() {
  updateMusicTitle();
  progressBarFill.style.width = 0;
  progressBuffer.style.width = 0;
  audio.src = musicPlaylist[currentPlayIndex].url;
  audio.play();
}
// 点击播放列表中某一首音乐时触发
function playTrackList(e) {
  const { index } = e.target.dataset;
  if (index !== undefined) {
    currentPlayIndex = +index;
    switchMusic();
  }
}
// 音频加载错误
audio.onerror = () => {
  alert("当前音乐文件加载出错,请刷新重试！");
};
// 处理播放/暂停事件
function handleAudioPlayback() {
  audio.paused
    ? ((pauseSvg.style.display = "none"), (playSvg.style.display = "block"))
    : ((playSvg.style.display = "none"), (pauseSvg.style.display = "block"));
  setCurrentPlayTruckBg();
}
// 开始调节音量
function startVolumeSlide(event) {
  event.preventDefault();
  slideVolume(event);
  document.addEventListener("mousemove", slideVolume);
  document.addEventListener("mouseup", stopVolumeSlide);
}
// 调节音量
function slideVolume(event) {
  const rect = volumeSlider.getBoundingClientRect();
  const position = event.clientX - rect.left;
  const percentage = Math.max(0, Math.min(position / rect.width, 1));
  setVolume(percentage);
  volumeSliderFill.style.width = `${percentage * 100}%`;
  volumeSliderThumb.style.left = `calc(${percentage * 100}% - 6px)`;
}
// 停止调节音量
function stopVolumeSlide() {
  document.removeEventListener("mousemove", slideVolume);
  document.removeEventListener("mouseup", stopVolumeSlide);
}
// 设置音量
function setVolume(percentage) {
  const volume = Math.pow(percentage, 2);
  audio.volume = volume;
  setVolumeSvg(volume);
}
// 开始调节进度条
function startProgressSlide(event) {
  event.preventDefault();
  slideProgress(event);
  document.addEventListener("mousemove", slideProgress);
  document.addEventListener("mouseup", stopProgressSlide);
}
// 调节进度条
function slideProgress(event) {
  const rect = progressBarWrapper.getBoundingClientRect();
  const position = event.clientX - rect.left;
  const percentage = Math.max(0, Math.min(position / rect.width, 1));
  progressBarFill.style.width = `${percentage * 100}%`;
  audio.currentTime = audio.duration * percentage;
  lyricData.length && updateCurrentLyric();
}
// 停止调节进度条
function stopProgressSlide() {
  document.removeEventListener("mousemove", slideProgress);
  document.removeEventListener("mouseup", stopProgressSlide);
}
// 更新音频缓存进度
function updateBufferedProgress() {
  if (audio.buffered.length > 0) {
    const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
    const duration = audio.duration;
    const bufferedPercentage = bufferedEnd / duration;
    progressBuffer.style.width = `${bufferedPercentage * 100}%`;
  }
}
// 实时更新播放进度和时间
function updatePlayProgress() {
  const progressPercentage = audio.currentTime / audio.duration;
  progressBarFill.style.width = `${progressPercentage * 100}%`;
  updateMusicTime();
  lyricData.length && updateCurrentLyric();
}

// 解析歌词信息
function parseLyric(lyric) {
  const lines = lyric.split("\n");
  const result = [];
  const timeExp = /\[(\d{2}):(\d{2})\.(\d+)\]/;

  for (let line of lines) {
    const matches = timeExp.exec(line);
    if (!matches) continue;
    const minutes = parseInt(matches[1]);
    const seconds = parseInt(matches[2]);
    const milliseconds = parseInt(matches[3]);
    // audio currentTime返回秒 而歌词数据是: 分 秒 毫秒，这里统一转换成秒
    const time = minutes * 60 + seconds + milliseconds / 1000;
    const text = line.replace(timeExp, "").trim();
    if (text) {
      result.push({
        time,
        text,
      });
    }
  }
  return result;
}
//  根据解析后的歌词数据 创建歌词节点
function createLyricEl() {
  for (let lyric of lyricData) {
    const item = document.createElement("li");
    item.innerText = lyric.text.split("\\n").join("");
    lrcWrapper.appendChild(item);
  }
  lyricItems = lrcWrapper.querySelectorAll("li");
}
// 获取当前播放时间对应的歌词索引
function getCurrentLyricIndex(time) {
  for (let i = 0; i < lyricData.length; i++) {
    if (time < lyricData[i].time) return i - 1;
  }
  return lyricData.length - 1;
}
// 滚动至当前歌词
function scrollLyric(currentLyricIndex) {
  lrcWrapper.style.transform = `translateY(-${(currentLyricIndex - 1) * 50}px)`;
}
//更新当前歌词
function updateCurrentLyric() {
  const currentLyricIndex = getCurrentLyricIndex(audio.currentTime);
  if (currentLyricIndex !== prevLyricIndex) {
    const lyric = lyricItems[currentLyricIndex];
    const activeLyric = lrcWrapper.querySelector(".active");
    activeLyric && activeLyric.classList.remove("active");
    lyric.classList.add("active");
    prevLyricIndex = currentLyricIndex;
    currentLyricIndex > 1 && scrollLyric(currentLyricIndex);
  }
}
initMusicPlayer();

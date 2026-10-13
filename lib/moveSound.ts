const SOUND_URLS = {
  move: "https://lichess1.org/assets/sound/standard/Move.mp3",
  capture: "https://lichess1.org/assets/sound/standard/Capture.mp3",
  check: "https://lichess1.org/assets/sound/standard/Check.mp3",
} as const

type SoundKind = keyof typeof SOUND_URLS

const clips = new Map<SoundKind, HTMLAudioElement>()

function clip(kind: SoundKind) {
  let audio = clips.get(kind)
  if (!audio) {
    audio = new Audio(SOUND_URLS[kind])
    audio.preload = "auto"
    clips.set(kind, audio)
  }
  return audio
}

/** Browsers block sound until a click or keypress has started playback once. */
export function unlockMoveSounds() {
  if (typeof window === "undefined") return
  for (const kind of Object.keys(SOUND_URLS) as SoundKind[]) {
    const audio = clip(kind)
    if (audio.dataset.unlocked === "1") continue
    const previous = audio.volume
    audio.volume = 0
    void audio
      .play()
      .then(() => {
        audio.pause()
        audio.currentTime = 0
        audio.volume = previous || 1
        audio.dataset.unlocked = "1"
      })
      .catch(() => {
        audio.volume = previous || 1
      })
  }
}

export function playMoveSound(move: {
  san: string
  isCapture(): boolean
}) {
  if (typeof window === "undefined") return
  const kind: SoundKind =
    move.san.includes("+") || move.san.includes("#")
      ? "check"
      : move.isCapture()
        ? "capture"
        : "move"
  const audio = clip(kind)
  audio.currentTime = 0
  void audio.play().catch(() => {})
}

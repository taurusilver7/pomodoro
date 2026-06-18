import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

interface Preset {
	name: string;
	minutes: number;
	color: string;
}

const BUILT_IN_PRESETS: Preset[] = [
	{ name: "Pomodoro", minutes: 25, color: "#ef4444" },
	{ name: "Short Break", minutes: 5, color: "#3b82f6" },
	{ name: "Long Break", minutes: 15, color: "#8b5cf6" },
];

/**
 * Focus music files placed in the public/ directory.
 * Replace the placeholder names below with your actual audio filenames.
 * (e.g. "music/rain.mp3", "music/ocean.wav", "music/lofi.ogg")
 * Supported formats: .mp3, .wav, .ogg, .m4a
 */
const MUSIC_FILES: string[] = [
	"music/focus.mp3",
	"music/focus.mp3",
	// "music/track-3.mp3",
];

function App() {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [selectedPreset, setSelectedPreset] = useState<number>(0);
	const [timeLeft, setTimeLeft] = useState<number>(
		BUILT_IN_PRESETS[0].minutes * 60,
	);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// ---- Custom Preset ----
	const [customMinutes, setCustomMinutes] = useState<number>(30);

	const allPresets: Preset[] =
		customMinutes > 0
			? [
					...BUILT_IN_PRESETS,
					{
						name: `Custom ${customMinutes}`,
						minutes: customMinutes,
						color: "#10b981",
					},
				]
			: BUILT_IN_PRESETS;

	// Adjust selectedPreset if the list shrinks
	const safePresetIndex = Math.min(selectedPreset, allPresets.length - 1);

	// ---- Music System ----
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const volumeRef = useRef<number>(0.4);
	const [musicEnabled, setMusicEnabled] = useState<boolean>(false);
	const [musicVolume, setMusicVolume] = useState<number>(0.4);

	// Start music (pick a random track)
	const startMusic = useCallback(() => {
		const prev = audioRef.current;
		if (prev) {
			prev.pause();
			prev.src = "";
		}

		const randomIndex = Math.floor(Math.random() * MUSIC_FILES.length);
		const src = MUSIC_FILES[randomIndex];
		const audio = new Audio(src);
		audio.volume = volumeRef.current;
		audio.loop = true;
		audio.play().catch(() => {});
		audioRef.current = audio;
	}, []);

	// Pause music
	const pauseMusic = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.pause();
		}
	}, []);

	// Stop & clean up
	const stopMusic = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.src = "";
			audioRef.current = null;
		}
	}, []);

	// Sync music with timer
	useEffect(() => {
		if (musicEnabled && isRunning && timeLeft > 0) {
			startMusic();
		} else if (!isRunning || timeLeft === 0) {
			pauseMusic();
		}

		// Stop entirely when timer finishes
		if (timeLeft === 0 && musicEnabled) {
			stopMusic();
		}
	}, [musicEnabled, isRunning, timeLeft, startMusic, pauseMusic, stopMusic]);

	// Clean up on unmount
	useEffect(() => {
		return () => {
			stopMusic();
		};
	}, [stopMusic]);

	// Update audio volume when slider changes
	useEffect(() => {
		volumeRef.current = musicVolume;
		if (audioRef.current) {
			audioRef.current.volume = musicVolume;
		}
	}, [musicVolume]);

	// ---- Timer Logic ----
	useEffect(() => {
		if (isRunning && timeLeft > 0) {
			intervalRef.current = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isRunning, timeLeft]);

	const handlePresetChange = (index: number): void => {
		if (isRunning) {
			// Stop timer
			setIsRunning(false);
		}
		setSelectedPreset(index);
		setTimeLeft(allPresets[index].minutes * 60);
	};

	const toggleTimer = (): void => {
		setIsRunning((prev) => !prev);
	};

	const resetTimer = (): void => {
		setIsRunning(false);
		setTimeLeft(allPresets[safePresetIndex].minutes * 60);
	};

	const toggleMusic = (): void => {
		if (musicEnabled) {
			stopMusic();
		}
		setMusicEnabled((prev) => !prev);
	};

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const progress: number =
		(timeLeft / (allPresets[safePresetIndex].minutes * 60)) * 100;
	const currentPreset: Preset = allPresets[safePresetIndex];

	return (
		<div className={isDarkMode ? "dark" : ""}>
			<div className="app">
				{/* Floating Action Button */}
				<button
					className="fab"
					onClick={() => setIsDialogOpen(true)}
					aria-label="Open Pomodoro Timer"
				>
					<svg
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>
					{isRunning && <span className="fab-indicator" />}
				</button>

				{/* Dialog Overlay */}
				{isDialogOpen && (
					<>
						<div
							className="dialog-overlay"
							onClick={() => setIsDialogOpen(false)}
						/>
						<div className="dialog">
							{/* Close Button */}
							<button
								className="dialog-close"
								onClick={() => setIsDialogOpen(false)}
								aria-label="Close dialog"
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>

							{/* Theme Toggle */}
							<button
								className="theme-toggle"
								onClick={() => setIsDarkMode(!isDarkMode)}
								aria-label="Toggle theme"
							>
								{isDarkMode ? "☀️" : "🌙"}
							</button>

							<div className="dialog-content">
								{/* Header */}
								<header>
									<h1>Pomodoro Timer</h1>
									<p className="subtitle">
										Stay focused, stay productive
									</p>
								</header>

								{/* Preset Buttons */}
								<div className="presets">
									{allPresets.map((preset, index) => (
										<button
											key={index}
											className={`preset-btn ${safePresetIndex === index ? "active" : ""}`}
											onClick={() => handlePresetChange(index)}
											style={
												{
													"--preset-color": preset.color,
												} as React.CSSProperties
											}
										>
											{preset.name}
										</button>
									))}
								</div>

								{/* Custom Preset Input */}
								<div className="custom-preset-input">
									<label htmlFor="custom-minutes">
										Custom minutes:
									</label>
									<input
										id="custom-minutes"
										type="number"
										min={1}
										max={120}
										value={customMinutes}
										onChange={(e) => {
											const val = Math.max(
												1,
												Math.min(
													120,
													parseInt(e.target.value) || 1,
												),
											);
											setCustomMinutes(val);
										}}
									/>
								</div>

								{/* Timer Display */}
								<div
									className="timer-circle"
									style={
										{
											"--progress": `${progress}%`,
											"--preset-color": currentPreset.color,
										} as React.CSSProperties
									}
								>
									<svg className="progress-ring" viewBox="0 0 200 200">
										<circle
											className="progress-ring-bg"
											cx="100"
											cy="100"
											r="90"
										/>
										<circle
											className="progress-ring-progress"
											cx="100"
											cy="100"
											r="90"
											style={{
												strokeDasharray: `${2 * Math.PI * 90}`,
												strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`,
											}}
										/>
									</svg>
									<div className="timer-content">
										<div className="time-display">
											{formatTime(timeLeft)}
										</div>
										<div className="timer-label">
											{currentPreset.name}
										</div>
									</div>
								</div>

								{/* Controls */}
								<div className="controls">
									<button
										className="control-btn start-btn"
										onClick={toggleTimer}
										style={
											{
												"--preset-color": currentPreset.color,
											} as React.CSSProperties
										}
									>
										{isRunning ? (
											<>
												<svg
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<rect
														x="6"
														y="4"
														width="4"
														height="16"
														rx="1"
													/>
													<rect
														x="14"
														y="4"
														width="4"
														height="16"
														rx="1"
													/>
												</svg>
												Pause
											</>
										) : (
											<>
												<svg
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M8 5v14l11-7z" />
												</svg>
												Start
											</>
										)}
									</button>
									<button
										className="control-btn reset-btn"
										onClick={resetTimer}
									>
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
											<path d="M21 3v5h-5" />
										</svg>
										Reset
									</button>
								</div>

								{/* Music Controls */}
								<div className="music-controls">
									<div className="music-controls-header">
										<span className="music-icon">🎵</span>
										<span className="music-label">Focus Music</span>
									</div>
									<div className="music-controls-body">
										<button
											className={`music-btn ${musicEnabled ? "active" : ""}`}
											onClick={toggleMusic}
											disabled={!isRunning && timeLeft > 0}
											title={
												musicEnabled ? "Stop music" : "Start music"
											}
										>
											{musicEnabled ? (
												<svg
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<rect
														x="6"
														y="4"
														width="4"
														height="16"
														rx="1"
													/>
													<rect
														x="14"
														y="4"
														width="4"
														height="16"
														rx="1"
													/>
												</svg>
											) : (
												<svg
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M9 18V5l12-2v13" />
													<circle cx="6" cy="18" r="3" />
													<circle cx="18" cy="16" r="3" />
												</svg>
											)}
											{musicEnabled ? "Stop" : "Play"}
										</button>
										<div className="volume-control">
											<label htmlFor="volume-slider">
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
													<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
													<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
												</svg>
											</label>
											<input
												id="volume-slider"
												type="range"
												min={0}
												max={1}
												step={0.01}
												value={musicVolume}
												onChange={(e) =>
													setMusicVolume(
														parseFloat(e.target.value),
													)
												}
												className="volume-slider"
												aria-label="Music volume"
											/>
											<span className="volume-value">
												{Math.round(musicVolume * 100)}%
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				)}

				{/* Main content area */}
				<div className="main-content">
					<h1>Your App</h1>
					<p>Click the timer button in the bottom-right corner</p>
				</div>
			</div>
		</div>
	);
}

export default App;

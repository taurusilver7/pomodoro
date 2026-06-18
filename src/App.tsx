import { useState, useEffect, useRef } from "react";
import "./App.css";

interface Preset {
	name: string;
	minutes: number;
	color: string;
}

const PRESETS: Preset[] = [
	{ name: "Pomodoro", minutes: 25, color: "#ef4444" },
	{ name: "Short Break", minutes: 5, color: "#3b82f6" },
	{ name: "Long Break", minutes: 15, color: "#8b5cf6" },
	{ name: "Custom 10", minutes: 10, color: "#10b981" },
	
];

function App() {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [selectedPreset, setSelectedPreset] = useState<number>(0);
	const [timeLeft, setTimeLeft] = useState<number>(PRESETS[0].minutes * 60);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// Timer logic runs independently of dialog state
	useEffect(() => {
		if (isRunning && timeLeft > 0) {
			intervalRef.current = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			setIsRunning(false);
			// trigger a toast notification.
			// ring an alarm
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isRunning, timeLeft]);

	const handlePresetChange = (index: number): void => {
		setSelectedPreset(index);
		setTimeLeft(PRESETS[index].minutes * 60);
		setIsRunning(false);
	};

	const toggleTimer = (): void => {
		setIsRunning(!isRunning);
	};

	const resetTimer = (): void => {
		setIsRunning(false);
		setTimeLeft(PRESETS[selectedPreset].minutes * 60);
	};

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const progress: number =
		(timeLeft / (PRESETS[selectedPreset].minutes * 60)) * 100;
	const currentPreset: Preset = PRESETS[selectedPreset];

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
									{PRESETS.map((preset, index) => (
										<button
											key={index}
											className={`preset-btn ${selectedPreset === index ? "active" : ""}`}
											onClick={() => handlePresetChange(index)}
											style={{
												["--preset-color" as string]: preset.color,
											}}
										>
											{preset.name}
										</button>
									))}
								</div>

								{/* Timer Display */}
								<div
									className="timer-circle"
									style={{
										["--progress" as string]: `${progress}%`,
										["--preset-color" as string]: currentPreset.color,
									}}
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
										style={{
											["--preset-color" as string]:
												currentPreset.color,
										}}
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
							</div>
						</div>
					</>
				)}

				{/* Your main app content here */}
				<div className="main-content">
					<h1>Your App</h1>
					<p>Click the timer button in the bottom-right corner</p>
				</div>
			</div>
		</div>
	);
}

export default App;

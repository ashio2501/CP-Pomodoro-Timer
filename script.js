let timeLeft;
let workTime;
let breakTime;
let isWorkTime = true;
let timerId = null;
let savedTimeLeft;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const restButton = document.getElementById('rest');

// Prompt for work time
let workTimePrompt;
do {
    workTimePrompt = parseInt(prompt('Enter work time in minutes (1-60):'));
    if (workTimePrompt === null || isNaN(workTimePrompt)) {
        workTimePrompt = 25; // Default value
        break;
    }
    if (workTimePrompt <= 0 || workTimePrompt > 60) {
        alert('Please enter a value between 1 and 60 minutes');
    }
} while (workTimePrompt <= 0 || workTimePrompt > 60);

// Prompt for break time
let breakTimePrompt;
do {
    breakTimePrompt = parseInt(prompt('Enter break time in minutes (1-60):'));
    if (breakTimePrompt === null || isNaN(breakTimePrompt)) {
        breakTimePrompt = 5; // Default value
        break;
    }
    if (breakTimePrompt <= 0 || breakTimePrompt > 60) {
        alert('Please enter a value between 1 and 60 minutes');
    }
} while (breakTimePrompt <= 0 || breakTimePrompt > 60);

// Set initial values
workTime = workTimePrompt * 60;
breakTime = breakTimePrompt * 60;
workTimeInput.value = workTimePrompt;
breakTimeInput.value = breakTimePrompt;

// Add this after your variable declarations
console.log('Work time:', workTime);
console.log('Break time:', breakTime);
console.log('Initial timeLeft:', timeLeft);

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? workTime : breakTime;
    const newMode = isWorkTime ? 'Work Time' : 'Break Time';
    modeText.textContent = newMode;
    updateTabColor(newMode);
    updateDisplay();
    updateTitle(newMode);
    updateBackgroundColor(newMode);
}

function startTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        startButton.textContent = 'Start';
        startButton.classList.remove('active');
        timerId = null;
        return;
    }

    startButton.textContent = 'Pause';
    startButton.classList.add('active');
    updateTitle(modeText.textContent);
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        updateTitle(modeText.textContent);

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            startButton.textContent = 'Start';
            startButton.classList.remove('active');
            alert(isWorkTime ? 'Work time is over! Take a break!' : 'Break is over! Back to work!');
            switchMode();
        }
    }, 1000);
    updateBackgroundColor(modeText.textContent);
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = workTime; // This will now use the updated workTime
    startButton.textContent = 'Start';
    startButton.classList.remove('active');
    modeText.textContent = 'Work Time';
    updateTabColor('Work Time');
    updateDisplay();
    document.title = 'Pomodoro Timer';
    updateBackgroundColor('Work Time');
}

function takeRest() {
    if (timerId === null) {
        alert('Timer must be running to take a rest or return to work!');
        return;
    }

    if (modeText.textContent === 'Rest Time') {
        // Return to work
        clearInterval(timerId);
        timeLeft = savedTimeLeft;
        modeText.textContent = 'Work Time';
        updateTabColor('Work Time');
        restButton.textContent = 'Take a Rest';
        startButton.textContent = 'Pause';
        startButton.classList.add('active');
        updateDisplay();
        
        // Start the work timer automatically
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            updateTitle('Work Time');
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                startButton.textContent = 'Start';
                startButton.classList.remove('active');
                alert('Work time is over! Take a break!');
                switchMode();
            }
        }, 1000);
        updateTitle('Work Time');
        updateBackgroundColor('Work Time');
        return;
    }

    // Only allow rest during work time
    if (!isWorkTime) {
        alert('You can only take a rest during work time!');
        return;
    }

    let restDuration;
    do {
        restDuration = parseInt(prompt('How many minutes would you like to rest? (max 5 minutes)'));
        
        // Check if user clicked cancel or pressed escape
        if (restDuration === null || isNaN(restDuration)) {
            return;
        }
        
        // Validate input is positive
        if (restDuration <= 0) {
            alert('Please enter a positive number');
            continue;
        }
        
        // If more than 5 minutes
        if (restDuration > 5) {
            alert('Rest time cannot be more than 5 minutes. Please enter a smaller number.');
            continue;
        }
        
        break; // Valid input, exit loop
        
    } while (true);

    // Store current work time remaining
    savedTimeLeft = timeLeft;
    
    // Clear current timer
    clearInterval(timerId);
    
    // Set rest time
    timeLeft = restDuration * 60;
    modeText.textContent = 'Rest Time';
    updateTabColor('Rest Time');
    restButton.textContent = 'Return to Work';
    startButton.textContent = 'Pause';
    startButton.classList.add('active');
    updateDisplay();
    
    // Start rest timer immediately
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        updateTitle('Rest Time');
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            alert('Rest time is over! Back to work!');
            timeLeft = savedTimeLeft;
            modeText.textContent = 'Work Time';
            updateTabColor('Work Time');
            restButton.textContent = 'Take a Rest';
            startButton.textContent = 'Start';
            startButton.classList.remove('active');
            updateDisplay();
        }
    }, 1000);
    updateTitle('Rest Time');
    updateBackgroundColor('Rest Time');
}

// Initialize timeLeft
timeLeft = workTime;
updateDisplay();

// Initialize background color
updateBackgroundColor('Work Time');

// Event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
restButton.addEventListener('click', takeRest);

// Initialize title
//updateTitle('Work Time');

function updateTabColor(mode) {
    const favicon = document.getElementById('favicon');
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Set color based on mode
    let color;
    switch(mode) {
        case 'Work Time':
            color = '#4CAF50'; // Green
            break;
        case 'Rest Time':
            color = '#2196F3'; // Blue
            break;
        case 'Break Time':
            color = '#FF9800'; // Orange
            break;
        default:
            color = '#4CAF50';
    }
    
    // Draw colored square
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 32, 32);
    
    // Update favicon
    favicon.href = canvas.toDataURL();
}

function formatTimeForTitle(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateTitle(mode) {
    const timeString = formatTimeForTitle(timeLeft);
    document.title = `(${timeString}) ${mode} - Pomodoro Timer`;
    updateBackgroundColor(mode);
}

function updateBackgroundColor(mode) {
    const gradients = {
        'Work Time': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'Rest Time': 'linear-gradient(135deg, #48bb78 0%, #38b2ac 100%)',
        'Break Time': 'linear-gradient(135deg, #ed8936 0%, #ed64a6 100%)'
    };
    document.body.style.background = gradients[mode] || gradients['Work Time'];
}

// Add this function at the end of your file
function preventCaching() {
    if (typeof window.performance !== 'undefined' && 
        typeof window.performance.navigation !== 'undefined') {
        
        if (window.performance.navigation.type === 2) {
            location.reload(true);
        }
    }
    
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            location.reload(true);
        }
    });
}

// Call it immediately
preventCaching(); 
// Daily Yin Yoga App - Frontend JavaScript

class YinYogaApp {
  constructor() {
    this.currentRoutine = null;
    this.timer = null;
    this.currentPoseIndex = 0;
    this.timeRemaining = 0;
    this.isTimerRunning = false;
    
    this.init();
  }
  
  async init() {
    this.updateDate();
    await this.loadRoutine();
    this.setupEventListeners();
    this.registerServiceWorker();
  }
  
  updateDate() {
    const dateElement = document.getElementById('current-date');
    const today = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    dateElement.textContent = today.toLocaleDateString('en-US', options);
  }
  
  async loadRoutine() {
    try {
      console.log('Loading routine from data/daily-routine.json');
      const response = await fetch('data/daily-routine.json');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Routine not found: ${response.status}`);
      }
      
      this.currentRoutine = await response.json();
      console.log('Loaded routine:', this.currentRoutine);
      this.displayRoutine();
      this.setupTimer();
      
      // Load metadata
      try {
        const metaResponse = await fetch('data/meta.json');
        if (metaResponse.ok) {
          const meta = await metaResponse.json();
          this.updateLastGenerated(meta.lastGenerated);
        }
      } catch (e) {
        console.log('Meta data not available');
      }
      
    } catch (error) {
      console.error('Error loading routine:', error);
      console.error('Full error details:', error.message);
      this.displayFallbackRoutine();
    }
  }
  
  displayRoutine() {
    const summaryElement = document.getElementById('routine-summary');
    const posesContainer = document.getElementById('poses-container');
    
    if (!this.currentRoutine) return;
    
    // Update summary
    summaryElement.innerHTML = `
      <h3>${this.currentRoutine.theme}</h3>
      <p><strong>Duration:</strong> ${this.currentRoutine.actualDuration} minutes</p>
      <p><strong>Poses:</strong> ${this.currentRoutine.poseCount} peaceful postures</p>
      <p><em>Take your time with each pose, breathing deeply and honoring your body's limits.</em></p>
    `;
    
    // Display poses
    posesContainer.innerHTML = '';
    this.currentRoutine.poses.forEach((pose, index) => {
      const poseCard = this.createPoseCard(pose, index);
      posesContainer.appendChild(poseCard);
    });
  }
  
  createPoseCard(pose, index) {
    const card = document.createElement('div');
    card.className = 'pose-card';
    card.setAttribute('data-pose-index', index);
    
    card.innerHTML = `
      <div class="pose-image">
        <img src="${pose.image}" alt="${pose.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="pose-fallback" style="display: none; font-size: 4rem; color: #4A90A4;">${this.getPoseEmoji(pose.category)}</div>
      </div>
      <div class="pose-content">
        <div class="pose-title">
          ${pose.name}
          <span class="pose-duration">${pose.duration} min</span>
        </div>
        <div class="pose-sanskrit">${pose.sanskrit}</div>
        <div class="pose-description">${pose.description}</div>
        
        <div class="pose-benefits">
          <h4>Benefits</h4>
          <ul>
            ${pose.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
          </ul>
        </div>
        
        <div class="pose-instructions">
          <h4>How to Practice</h4>
          <p>${pose.instructions}</p>
        </div>
      </div>
    `;
    
    return card;
  }
  
  getPoseEmoji(category) {
    const emojiMap = {
      breathing: '🫁',
      hip_opener: '🦋',
      forward_fold: '🙇‍♀️',
      backbend: '🌙',  
      twist: '🌊',
      restorative: '🕯️'
    };
    
    return emojiMap[category] || '🧘‍♀️';
  }
  
  setupTimer() {
    if (!this.currentRoutine || this.currentRoutine.poses.length === 0) return;
    
    const timerSection = document.getElementById('timer-section');
    timerSection.style.display = 'block';
    
    // Set initial timer to first pose
    this.currentPoseIndex = 0;
    this.timeRemaining = this.currentRoutine.poses[0].duration * 60; // Convert to seconds
    this.updateTimerDisplay();
    this.updateCurrentPose();
  }
  
  setupEventListeners() {
    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    const resetBtn = document.getElementById('reset-timer');
    
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startTimer());
    }
    
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.pauseTimer());
    }
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetTimer());
    }
  }
  
  startTimer() {
    if (this.isTimerRunning) return;
    
    this.isTimerRunning = true;
    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      
      if (this.timeRemaining <= 0) {
        this.nextPose();
      }
    }, 1000);
    
    document.getElementById('start-timer').disabled = true;
    document.getElementById('pause-timer').disabled = false;
  }
  
  pauseTimer() {
    if (!this.isTimerRunning) return;
    
    this.isTimerRunning = false;
    clearInterval(this.timer);
    
    document.getElementById('start-timer').disabled = false;
    document.getElementById('pause-timer').disabled = true;
  }
  
  resetTimer() {
    this.pauseTimer();
    this.currentPoseIndex = 0;
    this.timeRemaining = this.currentRoutine.poses[0].duration * 60;
    this.updateTimerDisplay();
    this.updateCurrentPose();
  }
  
  nextPose() {
    this.currentPoseIndex++;
    
    if (this.currentPoseIndex >= this.currentRoutine.poses.length) {
      // Practice complete
      this.pauseTimer();
      this.showCompletionMessage();
      return;
    }
    
    this.timeRemaining = this.currentRoutine.poses[this.currentPoseIndex].duration * 60;
    this.updateCurrentPose();
  }
  
  updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timer-display').textContent = display;
  }
  
  updateCurrentPose() {
    if (!this.currentRoutine || this.currentPoseIndex >= this.currentRoutine.poses.length) return;
    
    const currentPose = this.currentRoutine.poses[this.currentPoseIndex];
    const poseNameElement = document.getElementById('current-pose-name');
    
    poseNameElement.textContent = `Current: ${currentPose.name} (${currentPose.duration} min)`;
    
    // Highlight current pose card
    document.querySelectorAll('.pose-card').forEach((card, index) => {
      card.style.border = index === this.currentPoseIndex ? '3px solid #4A90A4' : 'none';
    });
  }
  
  showCompletionMessage() {
    const poseNameElement = document.getElementById('current-pose-name');
    poseNameElement.innerHTML = '<strong>🎉 Practice Complete! Well done! 🧘‍♀️</strong>';
    
    setTimeout(() => {
      poseNameElement.textContent = 'Thank you for your mindful practice today.';
    }, 3000);
  }
  
  updateLastGenerated(timestamp) {
    const updateElement = document.getElementById('last-updated');
    if (updateElement && timestamp) {
      const date = new Date(timestamp);
      const timeString = date.toLocaleString();
      updateElement.textContent = `Last updated: ${timeString}`;
    }
  }
  
  displayFallbackRoutine() {
    const summaryElement = document.getElementById('routine-summary');
    const posesContainer = document.getElementById('poses-container');
    
    summaryElement.innerHTML = `
      <h3>Welcome to Your Yin Yoga Practice</h3>
      <p>Your personalized routine is being prepared. Here's a gentle starter sequence:</p>
    `;
    
    const fallbackPoses = [
      {
        name: "Centering Breath",
        sanskrit: "Pranayama", 
        duration: 3,
        category: "breathing",
        description: "Begin with mindful breathing to center yourself.",
        instructions: "Sit comfortably and take slow, deep breaths.",
        benefits: ["Calms the nervous system", "Increases focus"]
      },
      {
        name: "Child's Pose",
        sanskrit: "Balasana",
        duration: 5,
        category: "forward_fold", 
        description: "A restorative pose for grounding and introspection.",
        instructions: "Kneel and fold forward, arms extended or by your sides.",
        benefits: ["Releases back tension", "Calms the mind"]
      },
      {
        name: "Savasana", 
        sanskrit: "Savasana",
        duration: 5,
        category: "restorative",
        description: "Final relaxation to integrate your practice.",
        instructions: "Lie flat and breathe naturally, allowing complete relaxation.",
        benefits: ["Deep relaxation", "Integrates the practice"]
      }
    ];
    
    posesContainer.innerHTML = '';
    fallbackPoses.forEach((pose, index) => {
      const poseCard = this.createPoseCard(pose, index);
      posesContainer.appendChild(poseCard);
    });
  }
  
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new YinYogaApp();
});
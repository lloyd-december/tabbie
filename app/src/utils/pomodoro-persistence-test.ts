import { loadPomodoroState, savePomodoroState, clearPomodoroState, type PomodoroState } from './storage';

// Test function to verify pomodoro persistence
export const testPomodoroPersistence = () => {
  console.log('🧪 Testing Pomodoro Persistence...');
  
  // Test 1: Save and load pomodoro state
  const testState: PomodoroState = {
    isRunning: true,
    timeLeft: 1500, // 25 minutes in seconds
    currentSession: {
      id: 'test-session-1',
      taskId: 'test-task-1',
      started: new Date(),
      duration: 25,
      completed: false,
      type: 'work',
    },
    sessionType: 'work',
    justCompleted: false,
    currentTaskId: 'test-task-1',
    startedAt: Date.now(),
    pausedAt: null,
    totalPausedTime: 0,
    overtimeAutoPaused: null,
  };
  
  console.log('📝 Saving test state:', testState);
  savePomodoroState(testState);
  
  const loadedState = loadPomodoroState();
  console.log('📖 Loaded state:', loadedState);
  
  // Test 2: Clear state
  console.log('🗑️ Clearing state...');
  clearPomodoroState();
  
  const clearedState = loadPomodoroState();
  console.log('📖 State after clear:', clearedState);
  
  // Test 3: Test overdue session recovery
  const overdueState: PomodoroState = {
    isRunning: true,
    timeLeft: -300, // 5 minutes overdue
    currentSession: {
      id: 'test-session-2',
      taskId: 'test-task-2',
      started: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      duration: 25,
      completed: false,
      type: 'work',
    },
    sessionType: 'work',
    justCompleted: false,
    currentTaskId: 'test-task-2',
    startedAt: Date.now() - 30 * 60 * 1000,
    pausedAt: null,
    totalPausedTime: 0,
    overtimeAutoPaused: null,
  };
  
  console.log('⏰ Testing overdue session recovery...');
  savePomodoroState(overdueState);
  
  const recoveredState = loadPomodoroState();
  console.log('📖 Recovered overdue state:', recoveredState);
  
  // Clean up
  clearPomodoroState();
  console.log('✅ Pomodoro persistence test completed!');
};

// Test function to simulate page refresh scenario
export const testPageRefreshScenario = () => {
  console.log('🔄 Testing Page Refresh Scenario...');
  
  // Simulate starting a pomodoro session
  const startTime = Date.now();
  const session: PomodoroState = {
    isRunning: true,
    timeLeft: 1500, // 25 minutes
    currentSession: {
      id: 'refresh-test-session',
      taskId: 'refresh-test-task',
      started: new Date(startTime),
      duration: 25,
      completed: false,
      type: 'work',
    },
    sessionType: 'work',
    justCompleted: false,
    currentTaskId: 'refresh-test-task',
    startedAt: startTime,
    pausedAt: null,
    totalPausedTime: 0,
    overtimeAutoPaused: null,
  };
  
  console.log('📝 Starting session at:', new Date(startTime).toLocaleTimeString());
  savePomodoroState(session);
  
  // Simulate page refresh after 5 minutes
  setTimeout(() => {
    console.log('🔄 Simulating page refresh after 5 minutes...');
    const refreshedState = loadPomodoroState();
    console.log('📖 State after refresh:', refreshedState);
    
    if (refreshedState) {
      const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
      const expectedTimeLeft = Math.max(0, 1500 - (elapsedMinutes * 60));
      console.log(`⏱️ Expected time left: ${expectedTimeLeft}s, Actual: ${refreshedState.timeLeft}s`);
    }
    
    // Clean up
    clearPomodoroState();
    console.log('✅ Page refresh test completed!');
  }, 5000); // Wait 5 seconds to simulate time passing
}; 
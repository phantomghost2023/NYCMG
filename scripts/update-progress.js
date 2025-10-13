#!/usr/bin/env node

// Script to update progress summary based on completed tasks
const fs = require('fs');
const path = require('path');

// Read the current task list
const taskListPath = path.join(__dirname, '..', 'TASK_LIST.md');
const progressSummaryPath = path.join(__dirname, '..', 'PROGRESS_SUMMARY.md');

// Function to count completed tasks
function countCompletedTasks(content) {
  const completedTasks = (content.match(/- \[x\]/g) || []).length;
  const totalTasks = (content.match(/- \[.?\]/g) || []).length;
  return { completed: completedTasks, total: totalTasks };
}

// Function to calculate percentage
function calculatePercentage(completed, total) {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

// Read task list
fs.readFile(taskListPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading task list:', err);
    return;
  }

  const { completed, total } = countCompletedTasks(data);
  const percentage = calculatePercentage(completed, total);

  console.log(`Progress: ${completed}/${total} tasks completed (${percentage}%)`);

  // Read progress summary
  fs.readFile(progressSummaryPath, 'utf8', (err, progressData) => {
    if (err) {
      console.error('Error reading progress summary:', err);
      return;
    }

    // Update the progress percentage in the summary
    const updatedProgress = progressData.replace(
      /## Overall Progress: \d+% Complete/,
      `## Overall Progress: ${percentage}% Complete`
    );

    // Write updated progress summary
    fs.writeFile(progressSummaryPath, updatedProgress, 'utf8', (err) => {
      if (err) {
        console.error('Error writing progress summary:', err);
        return;
      }

      console.log('Progress summary updated successfully!');
    });
  });
});
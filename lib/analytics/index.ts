/**
 * Analytics Library Entry Point
 * Exports all analytics functionality for easy import
 */

// Re-export everything for convenience
export * from './events';
export * from './adapters';
export * from './factory';

// Default export for quick access
export { initializeAnalytics, getAnalytics, analytics } from './factory';
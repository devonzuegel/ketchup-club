import { requireNativeModule, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to NativeLocation.web.ts
// and on native platforms to NativeLocation.ts
import NativeLocationModule from './src/NativeLocationModule';
import { LocationUpdatePayload, AuthorizationPayload, LocationErrorPayload } from './src/NativeLocation.types';

export async function startMonitoring() {
  return await NativeLocationModule.startMonitoring();
}

export async function stopMonitoring() {
  return await NativeLocationModule.stopMonitoring();
}

export async function requestPermission() {
  return await NativeLocationModule.requestPermission();
}

const emitter = new EventEmitter(NativeLocationModule ?? requireNativeModule('NativeLocation'));

export function addLocationUpdateListener(listener: (event: LocationUpdatePayload) => void): Subscription {
  return emitter.addListener<LocationUpdatePayload>('onLocationUpdate', listener);
}

export function addAuthorizationChangeListener(listener: (event: AuthorizationPayload) => void): Subscription {
  return emitter.addListener<AuthorizationPayload>('onAuthorizationChange', listener);
}

export function addLocationErrorListener(listener: (event: LocationErrorPayload) => void): Subscription {
  return emitter.addListener<LocationErrorPayload>('onLocationError', listener);
}

export { LocationUpdatePayload, AuthorizationPayload, LocationErrorPayload };

import CoreLocation
import ExpoModulesCore

public class NativeLocationModule: Module {

  private var locationManager: CLLocationManager?
  private var locationDelegate: LocationDelegate?

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    Name("NativeLocation")

    OnCreate {
      // This block is called when the module is created. You can use it to perform any setup or initialization.
      // For example, you can start listening to events or set up any background services.
      // The block is called on the main thread.
      self.locationManager = CLLocationManager()
      self.locationDelegate = LocationDelegate(module: self)
    }

    OnStartObserving {
      self.locationManager?.delegate = self.locationDelegate
      self.locationManager?.desiredAccuracy = kCLLocationAccuracyBest
    }

    Events("onLocationUpdate", "onAuthorizationChange", "onLocationError")

    AsyncFunction("startMonitoring") {
      if self.locationManager != nil {
        print("starting location monitoring")
        self.locationManager!.startMonitoringSignificantLocationChanges()
      }
    }
    AsyncFunction("stopMonitoring") {
      if self.locationManager != nil {
        print("stopping location monitoring")
        self.locationManager!.stopMonitoringSignificantLocationChanges()
      }
    }
    AsyncFunction("requestPermission") {
      if self.locationManager != nil {
        print("requesting location permission")
        self.locationManager!.requestAlwaysAuthorization()
      }
    }
  }

  public func handleLocationUpdate(locations: [CLLocation]) {
    guard locations.last != nil else {
      return
    }
    let loc = locations.last!

    let expoLocationObject: [String: Any] = [
      "coords": [
        "latitude": loc.coordinate.latitude,
        "longitude": loc.coordinate.longitude,
        "altitude": loc.altitude,
        "accuracy": loc.horizontalAccuracy,
        "altitudeAccuracy": loc.verticalAccuracy,
        "heading": loc.course,
        "speed": loc.speed,
      ],
      "timestamp": loc.timestamp.timeIntervalSince1970,
    ]
    self.sendEvent(
      "onLocationUpdate",
      [
        "location": expoLocationObject
      ])
  }

  public func handleAuthorizationChange(status: CLAuthorizationStatus) {
    self.sendEvent(
      "onAuthorizationChange",
      [
        "status": status.rawValue
      ])
  }

  public func handleLocationError(error: Error) {
    self.sendEvent(
      "onLocationError",
      [
        "error": error.localizedDescription
      ])
  }
}

// Separate delegate class
class LocationDelegate: NSObject, CLLocationManagerDelegate {
  weak var module: NativeLocationModule?

  init(module: NativeLocationModule) {
    self.module = module
  }

  public func locationManager(
    _ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]
  ) {
    module?.handleLocationUpdate(locations: locations)
  }

  public func locationManager(
    _ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus
  ) {
    module?.handleAuthorizationChange(status: status)
  }

  public func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    module?.handleLocationError(error: error)
  }
}

import CoreLocation
import ExpoModulesCore

public class NativeLocationModule: Module, CLLocationManagerDelegate {
  static let shared = LocationManager()
  private let locationManager = CLLocationManager()

  public override init() {
    super.init()
    locationManager.delegate = self
    locationManager.desiredAccuracy = kCLLocationAccuracyBest
  }
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('NativeLocation')` in JavaScript.
    Name("NativeLocation")

    Events("onLocationUpdate", "onAuthorizationChange", "onLocationError")
    AsyncFunction(startMonitoring) {
      print("starting location monitoring")
      LocationManager.shared.locationManager.startMonitoringSignificantLocationChanges()
    }
    AsyncFunction(stopMonitoring) {
      print("stopping location monitoring")
      LocationManager.shared.locationManager.stopMonitoringSignificantLocationChanges()
    }
    AsyncFunction(requestPermission) {
      LocationManager.shared.locationManager.requestAlwaysAuthorization()
    }
  }

  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    // locations.last is the most recent location
    self.sendEvent(
      "onLocationUpdate",
      [
        "location": locations.last
      ])
  }

  func locationManager(
    _ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus
  ) {
    self.sendEvent(
      "onAuthorizationChange",
      [
        "status": status.rawValue
      ])
  }

  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    self.sendEvent(
      "onLocationError",
      [
        "error": error.localizedDescription
      ])
  }
}

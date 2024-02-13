import CoreLocation
import ExpoModulesCore

public class NativeLocationModule: Module {
  // static let shared = CoreLocation.LocationManager()
  // private let locationManager = CLLocationManager()

  private var locationManager: CLLocationManager?
  private var locationDelegate: LocationDelegate?

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('NativeLocation')` in JavaScript.
    Name("NativeLocation")

    OnCreate {
      // This block is called when the module is created. You can use it to perform any setup or initialization.
      // For example, you can start listening to events or set up any background services.
      // The block is called on the main thread.
      // self.locationManager.delegate = LocationDelegate(module: self)
      // self.locationManager.desiredAccuracy = kCLLocationAccuracyBest

      self.locationManager = CLLocationManager()
      self.locationDelegate = LocationDelegate(module: self)
      self.locationManager?.delegate = self.locationDelegate
      self.locationManager?.desiredAccuracy = kCLLocationAccuracyBest

    }

    Events("onLocationUpdate", "onAuthorizationChange", "onLocationError")

    AsyncFunction("startMonitoring") {
      print("starting location monitoring")
      self.locationManager!.startMonitoringSignificantLocationChanges()
    }
    AsyncFunction("stopMonitoring") {
      print("stopping location monitoring")
      self.locationManager!.stopMonitoringSignificantLocationChanges()
    }
    AsyncFunction("requestPermission") {
      self.locationManager!.requestAlwaysAuthorization()
    }
  }

  public func handleLocationUpdate(locations: [CLLocation]) {
    // locations.last is the most recent location
    self.sendEvent(
      "onLocationUpdate",
      [
        "location": locations.last
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

  // public func locationManager(
  //   _ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]
  // ) {
  //   // locations.last is the most recent location
  //   self.sendEvent(
  //     "onLocationUpdate",
  //     [
  //       "location": locations.last
  //     ])
  // }

  // public func locationManager(
  //   _ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus
  // ) {
  //   self.sendEvent(
  //     "onAuthorizationChange",
  //     [
  //       "status": status.rawValue
  //     ])
  // }

  // public func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
  //   self.sendEvent(
  //     "onLocationError",
  //     [
  //       "error": error.localizedDescription
  //     ])
  // }
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

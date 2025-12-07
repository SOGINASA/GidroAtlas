import SwiftUI
import MapKit

@main
struct GidroAtlasApp: App {
    @StateObject private var authManager = AuthManager()
    @StateObject private var sensorStore = SensorStore()
    @StateObject private var notificationStore = NotificationStore()
    @StateObject private var waterObjectStore = WaterObjectStore()   // ← вот он

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authManager)
                .environmentObject(sensorStore)
                .environmentObject(notificationStore)
                .environmentObject(waterObjectStore)                  // ← пробрасываем
        }
    }
}

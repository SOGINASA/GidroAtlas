import SwiftUI
import MapKit

@main
struct GidroAtlasApp: App {
    @StateObject private var authManager = AuthManager()
    @StateObject private var sensorStore = SensorStore()              // оставляем, чтобы не ломать старый код
    @StateObject private var notificationStore = NotificationStore()
    @StateObject private var waterObjectStore = WaterObjectStore()    // НОВЫЙ стор для GidroAtlas

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authManager)
                .environmentObject(sensorStore)
                .environmentObject(notificationStore)
                .environmentObject(waterObjectStore)   // даём доступ ко всем экранам
        }
    }
}

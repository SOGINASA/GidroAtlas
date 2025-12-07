import Foundation
import CoreLocation

enum WaterLevel: String {
    case safe = "Безопасно"
    case warning = "Предупреждение"
    case danger = "Опасность"
    case critical = "Критично"
    
    var color: String {
        switch self {
        case .safe: return "green"
        case .warning: return "yellow"
        case .danger: return "orange"
        case .critical: return "red"
        }
    }
}

struct Sensor: Identifiable {
    let id: UUID
    let name: String
    let location: CLLocationCoordinate2D
    var currentLevel: Double // в метрах
    var maxLevel: Double
    var status: WaterLevel
    var lastUpdate: Date
    
    var levelPercentage: Double {
        (currentLevel / maxLevel) * 100
    }
    
    // Тестовые датчики в Петропавловске
    static let testSensors = [
        Sensor(
            id: UUID(),
            name: "Датчик №1 - Центр",
            location: CLLocationCoordinate2D(latitude: 54.8656, longitude: 69.1395),
            currentLevel: 2.3,
            maxLevel: 4.5,
            status: .safe,
            lastUpdate: Date()
        ),
        Sensor(
            id: UUID(),
            name: "Датчик №2 - Северная часть",
            location: CLLocationCoordinate2D(latitude: 54.8756, longitude: 69.1495),
            currentLevel: 3.8,
            maxLevel: 4.5,
            status: .warning,
            lastUpdate: Date()
        ),
        Sensor(
            id: UUID(),
            name: "Датчик №3 - Южная часть",
            location: CLLocationCoordinate2D(latitude: 54.8556, longitude: 69.1295),
            currentLevel: 1.9,
            maxLevel: 4.5,
            status: .safe,
            lastUpdate: Date()
        )
    ]
}

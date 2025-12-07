import Foundation
import MapKit

// MARK: - Типы

enum WaterResourceCategory: String, CaseIterable, Identifiable {
    case lake = "Озеро"
    case reservoir = "Водохранилище"
    case canal = "Канал"

    var id: String { rawValue }
}

enum WaterKind: String, CaseIterable, Identifiable {
    case fresh = "Пресная"
    case nonFresh = "Непресная"

    var id: String { rawValue }
}

enum PriorityLevel: String {
    case high = "Высокий"
    case medium = "Средний"
    case low = "Низкий"

    var color: String {
        switch self {
        case .high: return "red"
        case .medium: return "orange"
        case .low: return "green"
        }
    }
}

// MARK: - Модель объекта

struct WaterObject: Identifiable {
    let id: UUID
    let name: String
    let region: String
    let resourceType: WaterResourceCategory
    let waterType: WaterKind
    let hasFauna: Bool
    let passportDate: Date
    let technicalCondition: Int
    let coordinate: CLLocationCoordinate2D
    let passportURL: URL?

    var priorityScore: Int {
        let years = Calendar.current.dateComponents([.year], from: passportDate, to: Date()).year ?? 0
        let clampedCondition = max(1, min(5, technicalCondition))
        return (6 - clampedCondition) * 3 + max(0, years)
    }

    var priorityLevel: PriorityLevel {
        switch priorityScore {
        case 12...:
            return .high
        case 6...11:
            return .medium
        default:
            return .low
        }
    }

    var formattedPassportDate: String {
        Self.passportFormatter.string(from: passportDate)
    }

    private static let passportFormatter: DateFormatter = {
        let df = DateFormatter()
        df.dateStyle = .medium
        df.locale = Locale(identifier: "ru_RU")
        return df
    }()
}


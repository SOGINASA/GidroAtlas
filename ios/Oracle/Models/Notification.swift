import Foundation

enum NotificationType {
    case info
    case warning
    case danger
    case evacuation
    
    var icon: String {
        switch self {
        case .info: return "info.circle.fill"
        case .warning: return "exclamationmark.triangle.fill"
        case .danger: return "exclamationmark.octagon.fill"
        case .evacuation: return "figure.run"
        }
    }
    
    var colorName: String {
            switch self {
            case .info: return "blue"
            case .warning: return "yellow"
            case .danger: return "orange"
            case .evacuation: return "red"
            }
        }
}

struct Notification: Identifiable {
    let id: UUID
    let title: String
    let message: String
    let type: NotificationType
    let timestamp: Date
    var isRead: Bool
    
    // Тестовые уведомления
    static let testNotifications = [
        Notification(
            id: UUID(),
            title: "Уровень воды повышен",
            message: "Датчик №2 зафиксировал повышение уровня воды до 3.8м",
            type: .warning,
            timestamp: Date().addingTimeInterval(-3600),
            isRead: false
        ),
        Notification(
            id: UUID(),
            title: "Система активна",
            message: "Все датчики работают в штатном режиме",
            type: .info,
            timestamp: Date().addingTimeInterval(-7200),
            isRead: true
        ),
        Notification(
            id: UUID(),
            title: "Прогноз погоды",
            message: "Ожидаются осадки в течение недели. Следите за обновлениями",
            type: .info,
            timestamp: Date().addingTimeInterval(-86400),
            isRead: true
        )
    ]
}

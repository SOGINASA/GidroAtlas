import Foundation
import CoreLocation

// MARK: - Resident (Житель в зоне риска)
struct Resident: Identifiable {
    let id: UUID
    let name: String
    let address: String
    let phone: String
    let riskZone: RiskZone
    let location: CLLocationCoordinate2D
    var status: EvacuationStatus
    var assignedBrigade: String?
    var lastUpdate: Date
    
    enum RiskZone: String {
        case critical = "Критическая"
        case high = "Высокая"
        case medium = "Средняя"
        case low = "Низкая"
        
        var color: String {
            switch self {
            case .critical: return "red"
            case .high: return "orange"
            case .medium: return "yellow"
            case .low: return "green"
            }
        }
    }
    
    enum EvacuationStatus: String {
        case pending = "Ожидает"
        case assigned = "Назначено"
        case inProgress = "В процессе"
        case completed = "Завершено"
        case refused = "Отказался"
    }
}

// MARK: - Evacuation (Эвакуация)
struct Evacuation: Identifiable {
    let id: UUID
    let residentId: UUID
    let residentName: String
    let address: String
    var status: Resident.EvacuationStatus
    var assignedBrigade: String
    var startTime: String
    var endTime: String?
    var evacuationPoint: String
    var notes: String?
    var createdAt: Date
    var updatedAt: Date
}

// MARK: - Evacuation Point (Пункт эвакуации)
struct EvacuationPoint: Identifiable {
    let id: UUID
    let name: String
    let address: String
    let location: CLLocationCoordinate2D
    let capacity: Int
    var currentOccupancy: Int
    let type: PointType
    var isActive: Bool
    
    enum PointType: String {
        case school = "Школа"
        case sportComplex = "Спорткомплекс"
        case culturalCenter = "ДК"
        case hospital = "Больница"
    }
    
    var occupancyPercentage: Double {
        return Double(currentOccupancy) / Double(capacity) * 100
    }
}

// MARK: - Emergency Stats (Статистика МЧС)
struct EmergencyStats {
    let totalResidents: Int
    let activeEvacuations: Int
    let completedEvacuations: Int
    let pendingEvacuations: Int
    let criticalZoneResidents: Int
    let availableBrigades: Int
    
    var completionRate: Double {
        let total = activeEvacuations + completedEvacuations
        guard total > 0 else { return 0 }
        return Double(completedEvacuations) / Double(total) * 100
    }
}

// MARK: - Test Data
extension Resident {
    static var testResidents: [Resident] = [
        Resident(
            id: UUID(),
            name: "Иванов Иван Иванович",
            address: "ул. Конституции Казахстана, 45, кв. 12",
            phone: "+7 777 123 4567",
            riskZone: .critical,
            location: CLLocationCoordinate2D(latitude: 54.8667, longitude: 69.15),
            status: .pending,
            assignedBrigade: nil,
            lastUpdate: Date()
        ),
        Resident(
            id: UUID(),
            name: "Петрова Мария Сергеевна",
            address: "пр. Победы, 12, кв. 5",
            phone: "+7 777 234 5678",
            riskZone: .high,
            location: CLLocationCoordinate2D(latitude: 54.8657, longitude: 69.145),
            status: .completed,
            assignedBrigade: "Бригада #2",
            lastUpdate: Date().addingTimeInterval(-3600)
        ),
        Resident(
            id: UUID(),
            name: "Морозова Елена Владимировна",
            address: "ул. Пушкина, 33, кв. 8",
            phone: "+7 777 345 6789",
            riskZone: .medium,
            location: CLLocationCoordinate2D(latitude: 54.8647, longitude: 69.155),
            status: .inProgress,
            assignedBrigade: "Бригада #3",
            lastUpdate: Date().addingTimeInterval(-1800)
        ),
        Resident(
            id: UUID(),
            name: "Новиков Сергей Иванович",
            address: "ул. Гагарина, 78, кв. 15",
            phone: "+7 777 456 7890",
            riskZone: .high,
            location: CLLocationCoordinate2D(latitude: 54.8637, longitude: 69.16),
            status: .assigned,
            assignedBrigade: "Бригада #1",
            lastUpdate: Date().addingTimeInterval(-900)
        ),
        Resident(
            id: UUID(),
            name: "Сидорова Анна Петровна",
            address: "ул. Ленина, 22, кв. 3",
            phone: "+7 777 567 8901",
            riskZone: .critical,
            location: CLLocationCoordinate2D(latitude: 54.8627, longitude: 69.165),
            status: .pending,
            assignedBrigade: nil,
            lastUpdate: Date()
        )
    ]
}

extension Evacuation {
    static var testEvacuations: [Evacuation] = [
        Evacuation(
            id: UUID(),
            residentId: UUID(),
            residentName: "Иванов И.И.",
            address: "ул. Конституции, 45",
            status: .pending,
            assignedBrigade: "Бригада #1",
            startTime: "-",
            endTime: nil,
            evacuationPoint: "Школа №7",
            notes: "Требуется помощь с переноской вещей",
            createdAt: Date(),
            updatedAt: Date()
        ),
        Evacuation(
            id: UUID(),
            residentId: UUID(),
            residentName: "Петрова М.С.",
            address: "пр. Победы, 12",
            status: .completed,
            assignedBrigade: "Бригада #2",
            startTime: "13:15",
            endTime: "14:30",
            evacuationPoint: "Спорткомплекс",
            notes: "Эвакуация завершена успешно",
            createdAt: Date().addingTimeInterval(-7200),
            updatedAt: Date().addingTimeInterval(-3600)
        ),
        Evacuation(
            id: UUID(),
            residentId: UUID(),
            residentName: "Морозова Е.В.",
            address: "ул. Пушкина, 33",
            status: .inProgress,
            assignedBrigade: "Бригада #3",
            startTime: "15:00",
            endTime: nil,
            evacuationPoint: "Школа №5",
            notes: "В пути к месту эвакуации",
            createdAt: Date().addingTimeInterval(-1800),
            updatedAt: Date().addingTimeInterval(-900)
        ),
        Evacuation(
            id: UUID(),
            residentId: UUID(),
            residentName: "Новиков С.И.",
            address: "ул. Гагарина, 78",
            status: .assigned,
            assignedBrigade: "Бригада #1",
            startTime: "-",
            endTime: nil,
            evacuationPoint: "ДК Юность",
            notes: nil,
            createdAt: Date().addingTimeInterval(-900),
            updatedAt: Date().addingTimeInterval(-900)
        )
    ]
}

extension EvacuationPoint {
    static var testPoints: [EvacuationPoint] = [
        EvacuationPoint(
            id: UUID(),
            name: "Школа №7",
            address: "ул. Школьная, 15",
            location: CLLocationCoordinate2D(latitude: 54.8700, longitude: 69.1450),
            capacity: 500,
            currentOccupancy: 120,
            type: .school,
            isActive: true
        ),
        EvacuationPoint(
            id: UUID(),
            name: "Спорткомплекс Олимп",
            address: "пр. Ауэзова, 25",
            location: CLLocationCoordinate2D(latitude: 54.8680, longitude: 69.1500),
            capacity: 800,
            currentOccupancy: 350,
            type: .sportComplex,
            isActive: true
        ),
        EvacuationPoint(
            id: UUID(),
            name: "ДК Юность",
            address: "ул. Космонавтов, 42",
            location: CLLocationCoordinate2D(latitude: 54.8650, longitude: 69.1550),
            capacity: 300,
            currentOccupancy: 85,
            type: .culturalCenter,
            isActive: true
        )
    ]
}

extension EmergencyStats {
    static var testStats: EmergencyStats {
        EmergencyStats(
            totalResidents: Resident.testResidents.count,
            activeEvacuations: Resident.testResidents.filter { $0.status == .inProgress }.count,
            completedEvacuations: Resident.testResidents.filter { $0.status == .completed }.count,
            pendingEvacuations: Resident.testResidents.filter { $0.status == .pending }.count,
            criticalZoneResidents: Resident.testResidents.filter { $0.riskZone == .critical }.count,
            availableBrigades: 4
        )
    }
}

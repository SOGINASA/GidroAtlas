import SwiftUI
import MapKit

// MARK: - Модели зон риска

enum RiskZoneType {
    case low
    case medium
    case high
}

struct RiskZone: Identifiable {
    let id: String
    let name: String
    let type: RiskZoneType
    let coordinates: [CLLocationCoordinate2D]
    let residentsCount: Int
    let relatedSensorIDs: [String]
    
    var fillColor: Color {
        switch type {
        case .low:
            return Color.green.opacity(0.22)
        case .medium:
            return Color.yellow.opacity(0.25)
        case .high:
            return Color.red.opacity(0.25)
        }
    }
}

// Все зоны из zones_data
let RISK_ZONES: [RiskZone] = [
    RiskZone(
        id: "zone-medium-1",
        name: "Зона среднего риска - Речной порт",
        type: .medium,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.9050, longitude: 69.1250),
            CLLocationCoordinate2D(latitude: 54.9150, longitude: 69.1250),
            CLLocationCoordinate2D(latitude: 54.9150, longitude: 69.1350),
            CLLocationCoordinate2D(latitude: 54.9050, longitude: 69.1350)
        ],
        residentsCount: 1200,
        relatedSensorIDs: ["sensor-1","sensor-2","sensor-3"]
    ),
    RiskZone(
        id: "zone-medium-2",
        name: "Зона среднего риска - Пёстрое",
        type: .medium,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.8800, longitude: 69.1200),
            CLLocationCoordinate2D(latitude: 54.8900, longitude: 69.1200),
            CLLocationCoordinate2D(latitude: 54.8900, longitude: 69.1300),
            CLLocationCoordinate2D(latitude: 54.8800, longitude: 69.1300)
        ],
        residentsCount: 950,
        relatedSensorIDs: ["sensor-4","sensor-5","sensor-6"]
    ),
    RiskZone(
        id: "zone-medium-3",
        name: "Зона среднего риска - Заречный",
        type: .medium,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.8350, longitude: 69.1100),
            CLLocationCoordinate2D(latitude: 54.8450, longitude: 69.1100),
            CLLocationCoordinate2D(latitude: 54.8450, longitude: 69.1200),
            CLLocationCoordinate2D(latitude: 54.8350, longitude: 69.1200)
        ],
        residentsCount: 800,
        relatedSensorIDs: ["sensor-7","sensor-8","sensor-9"]
    ),
    RiskZone(
        id: "zone-low-1",
        name: "Зона низкого риска - Кожевенный",
        type: .low,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.8450, longitude: 69.1500),
            CLLocationCoordinate2D(latitude: 54.8550, longitude: 69.1500),
            CLLocationCoordinate2D(latitude: 54.8550, longitude: 69.1600),
            CLLocationCoordinate2D(latitude: 54.8450, longitude: 69.1600)
        ],
        residentsCount: 1400,
        relatedSensorIDs: ["sensor-10","sensor-11","sensor-12"]
    ),
    RiskZone(
        id: "zone-low-2",
        name: "Зона низкого риска - Хромзавод",
        type: .low,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.8600, longitude: 69.1000),
            CLLocationCoordinate2D(latitude: 54.8700, longitude: 69.1000),
            CLLocationCoordinate2D(latitude: 54.8700, longitude: 69.1100),
            CLLocationCoordinate2D(latitude: 54.8600, longitude: 69.1100)
        ],
        residentsCount: 900,
        relatedSensorIDs: ["sensor-13","sensor-14","sensor-15"]
    ),
    RiskZone(
        id: "zone-low-3",
        name: "Зона низкого риска - Дачи",
        type: .low,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.8300, longitude: 69.1600),
            CLLocationCoordinate2D(latitude: 54.8400, longitude: 69.1600),
            CLLocationCoordinate2D(latitude: 54.8400, longitude: 69.1700),
            CLLocationCoordinate2D(latitude: 54.8300, longitude: 69.1700)
        ],
        residentsCount: 0,
        relatedSensorIDs: ["sensor-16","sensor-17","sensor-18"]
    ),
    RiskZone(
        id: "zone-low-4",
        name: "Зона низкого риска - Косогор",
        type: .low,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.8650, longitude: 69.1700),
            CLLocationCoordinate2D(latitude: 54.8750, longitude: 69.1700),
            CLLocationCoordinate2D(latitude: 54.8750, longitude: 69.1800),
            CLLocationCoordinate2D(latitude: 54.8650, longitude: 69.1800)
        ],
        residentsCount: 750,
        relatedSensorIDs: ["sensor-19","sensor-20","sensor-21"]
    ),
    RiskZone(
        id: "zone-low-5",
        name: "Зона низкого риска - Набережная",
        type: .low,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.8750, longitude: 69.1400),
            CLLocationCoordinate2D(latitude: 54.8850, longitude: 69.1400),
            CLLocationCoordinate2D(latitude: 54.8850, longitude: 69.1500),
            CLLocationCoordinate2D(latitude: 54.8750, longitude: 69.1500)
        ],
        residentsCount: 600,
        relatedSensorIDs: ["sensor-22","sensor-23","sensor-24"]
    ),
    RiskZone(
        id: "zone-low-6",
        name: "Зона низкого риска - Центр",
        type: .low,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.8600, longitude: 69.1400),
            CLLocationCoordinate2D(latitude: 54.8700, longitude: 69.1400),
            CLLocationCoordinate2D(latitude: 54.8700, longitude: 69.1550),
            CLLocationCoordinate2D(latitude: 54.8600, longitude: 69.1550)
        ],
        residentsCount: 15000,
        relatedSensorIDs: ["sensor-25","sensor-26","sensor-27","sensor-28"]
    ),
    RiskZone(
        id: "zone-high-1",
        name: "Зона высокого риска - Северо-Запад",
        type: .high,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.9200, longitude: 69.1200),
            CLLocationCoordinate2D(latitude: 54.9300, longitude: 69.1200),
            CLLocationCoordinate2D(latitude: 54.9300, longitude: 69.1300),
            CLLocationCoordinate2D(latitude: 54.9200, longitude: 69.1300)
        ],
        residentsCount: 1100,
        relatedSensorIDs: ["sensor-29","sensor-30","sensor-31"]
    ),
    RiskZone(
        id: "zone-high-2",
        name: "Зона высокого риска - Восток",
        type: .high,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.9400, longitude: 69.1100),
            CLLocationCoordinate2D(latitude: 54.9500, longitude: 69.1100),
            CLLocationCoordinate2D(latitude: 54.9500, longitude: 69.1250),
            CLLocationCoordinate2D(latitude: 54.9400, longitude: 69.1250)
        ],
        residentsCount: 900,
        relatedSensorIDs: ["sensor-32","sensor-33","sensor-34"]
    ),
    RiskZone(
        id: "zone-high-3",
        name: "Зона высокого риска - Юг",
        type: .high,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.8250, longitude: 69.0500),
            CLLocationCoordinate2D(latitude: 54.8350, longitude: 69.0500),
            CLLocationCoordinate2D(latitude: 54.8350, longitude: 69.0650),
            CLLocationCoordinate2D(latitude: 54.8250, longitude: 69.0650)
        ],
        residentsCount: 750,
        relatedSensorIDs: ["sensor-35","sensor-36","sensor-37"]
    ),
    RiskZone(
        id: "zone-high-4",
        name: "Зона высокого риска - Юго-Запад",
        type: .high,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.8350, longitude: 69.1300),
            CLLocationCoordinate2D(latitude: 54.8450, longitude: 69.1300),
            CLLocationCoordinate2D(latitude: 54.8450, longitude: 69.1450),
            CLLocationCoordinate2D(latitude: 54.8350, longitude: 69.1450)
        ],
        residentsCount: 820,
        relatedSensorIDs: ["sensor-38","sensor-39","sensor-40","sensor-41"]
    ),
    RiskZone(
        id: "zone-high-5",
        name: "Зона высокого риска - Северо-Восток",
        type: .high,
        coordinates: [
            CLLocationCoordinate2D(latitude: 54.8500, longitude: 69.1000),
            CLLocationCoordinate2D(latitude: 54.8600, longitude: 69.1000),
            CLLocationCoordinate2D(latitude: 54.8600, longitude: 69.1150),
            CLLocationCoordinate2D(latitude: 54.8500, longitude: 69.1150)
        ],
        residentsCount: 950,
        relatedSensorIDs: ["sensor-42","sensor-43","sensor-44","sensor-45","sensor-46","sensor-47","sensor-48"]
    )
]

// Датчики вдоль реки по точным координатам
let RIVER_SENSORS: [Sensor] = [
    Sensor(
        id: UUID(),
        name: "Речной датчик 1",
        location: CLLocationCoordinate2D(latitude: 54.81604, longitude: 69.04904),
        currentLevel: 1.8,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 2",
        location: CLLocationCoordinate2D(latitude: 54.82841, longitude: 69.04828),
        currentLevel: 1.9,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 3",
        location: CLLocationCoordinate2D(latitude: 54.83637, longitude: 69.05291),
        currentLevel: 2.0,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 4",
        location: CLLocationCoordinate2D(latitude: 54.83796, longitude: 69.07325),
        currentLevel: 2.1,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 5",
        location: CLLocationCoordinate2D(latitude: 54.84257, longitude: 69.07907),
        currentLevel: 2.2,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 6",
        location: CLLocationCoordinate2D(latitude: 54.80675, longitude: 69.09392),
        currentLevel: 2.3,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 7",
        location: CLLocationCoordinate2D(latitude: 54.84253, longitude: 69.05398),
        currentLevel: 2.4,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 8",
        location: CLLocationCoordinate2D(latitude: 54.84634, longitude: 69.08947),
        currentLevel: 2.5,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 9",
        location: CLLocationCoordinate2D(latitude: 54.84798, longitude: 69.08364),
        currentLevel: 2.6,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 10",
        location: CLLocationCoordinate2D(latitude: 54.85114, longitude: 69.09354),
        currentLevel: 2.7,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 11",
        location: CLLocationCoordinate2D(latitude: 54.85704, longitude: 69.07852),
        currentLevel: 2.8,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 12",
        location: CLLocationCoordinate2D(latitude: 54.85601, longitude: 69.08903),
        currentLevel: 2.9,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 13",
        location: CLLocationCoordinate2D(latitude: 54.85450, longitude: 69.09866),
        currentLevel: 3.0,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 14",
        location: CLLocationCoordinate2D(latitude: 54.85642, longitude: 69.05351),
        currentLevel: 3.1,
        maxLevel: 4.5,
        status: .safe,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 15",
        location: CLLocationCoordinate2D(latitude: 54.85946, longitude: 69.04523),
        currentLevel: 3.2,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 16",
        location: CLLocationCoordinate2D(latitude: 54.86614, longitude: 69.05135),
        currentLevel: 3.3,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 17",
        location: CLLocationCoordinate2D(latitude: 54.86945, longitude: 69.05938),
        currentLevel: 3.4,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 18",
        location: CLLocationCoordinate2D(latitude: 54.87556, longitude: 69.07027),
        currentLevel: 3.5,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 19",
        location: CLLocationCoordinate2D(latitude: 54.87630, longitude: 69.08222),
        currentLevel: 3.6,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 20",
        location: CLLocationCoordinate2D(latitude: 54.87715, longitude: 69.09349),
        currentLevel: 3.7,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 21",
        location: CLLocationCoordinate2D(latitude: 54.88073, longitude: 69.09852),
        currentLevel: 3.8,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 22",
        location: CLLocationCoordinate2D(latitude: 54.88167, longitude: 69.08136),
        currentLevel: 3.9,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 23",
        location: CLLocationCoordinate2D(latitude: 54.88406, longitude: 69.08669),
        currentLevel: 4.0,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 24",
        location: CLLocationCoordinate2D(latitude: 54.88565, longitude: 69.09375),
        currentLevel: 4.1,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 25",
        location: CLLocationCoordinate2D(latitude: 54.88740, longitude: 69.10051),
        currentLevel: 4.2,
        maxLevel: 4.5,
        status: .danger,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 26",
        location: CLLocationCoordinate2D(latitude: 54.88752, longitude: 69.10810),
        currentLevel: 4.3,
        maxLevel: 4.5,
        status: .danger,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 27",
        location: CLLocationCoordinate2D(latitude: 54.88257, longitude: 69.11602),
        currentLevel: 4.3,
        maxLevel: 4.5,
        status: .danger,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 28",
        location: CLLocationCoordinate2D(latitude: 54.88676, longitude: 69.12152),
        currentLevel: 4.4,
        maxLevel: 4.5,
        status: .danger,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 29",
        location: CLLocationCoordinate2D(latitude: 54.89187, longitude: 69.12627),
        currentLevel: 4.4,
        maxLevel: 4.5,
        status: .danger,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 30",
        location: CLLocationCoordinate2D(latitude: 54.89660, longitude: 69.12973),
        currentLevel: 4.5,
        maxLevel: 4.5,
        status: .danger,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 31",
        location: CLLocationCoordinate2D(latitude: 54.90672, longitude: 69.12909),
        currentLevel: 4.2,
        maxLevel: 4.5,
        status: .danger,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 32",
        location: CLLocationCoordinate2D(latitude: 54.91199, longitude: 69.12638),
        currentLevel: 4.1,
        maxLevel: 4.5,
        status: .danger,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 33",
        location: CLLocationCoordinate2D(latitude: 54.91790, longitude: 69.12440),
        currentLevel: 4.0,
        maxLevel: 4.5,
        status: .danger,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 34",
        location: CLLocationCoordinate2D(latitude: 54.92633, longitude: 69.12100),
        currentLevel: 4.0,
        maxLevel: 4.5,
        status: .danger,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 35",
        location: CLLocationCoordinate2D(latitude: 54.93244, longitude: 69.12001),
        currentLevel: 4.1,
        maxLevel: 4.5,
        status: .danger,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 36",
        location: CLLocationCoordinate2D(latitude: 54.87996, longitude: 69.06881),
        currentLevel: 3.0,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 37",
        location: CLLocationCoordinate2D(latitude: 54.88102, longitude: 69.07647),
        currentLevel: 3.1,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 38",
        location: CLLocationCoordinate2D(latitude: 54.88514, longitude: 69.07540),
        currentLevel: 3.2,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 39",
        location: CLLocationCoordinate2D(latitude: 54.88926, longitude: 69.07328),
        currentLevel: 3.3,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 40",
        location: CLLocationCoordinate2D(latitude: 54.89114, longitude: 69.07852),
        currentLevel: 3.4,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 41",
        location: CLLocationCoordinate2D(latitude: 54.89483, longitude: 69.07842),
        currentLevel: 3.5,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    ),
    Sensor(
        id: UUID(),
        name: "Речной датчик 42",
        location: CLLocationCoordinate2D(latitude: 54.85922, longitude: 69.10500),
        currentLevel: 3.6,
        maxLevel: 4.5,
        status: .warning,
        lastUpdate: Date()
    )
]


// Датчики, сгенерированные по тем же координатам (по 1 на каждую точку)
let SENSORS_FROM_ZONES: [Sensor] = {
    var result: [Sensor] = []
    
    for zone in RISK_ZONES {
        for (index, coord) in zone.coordinates.enumerated() {
            let status: WaterLevel
            let currentLevel: Double
            let maxLevel: Double = 4.5
            
            switch zone.type {
            case .low:
                status = .safe
                currentLevel = 1.0
            case .medium:
                status = .warning
                currentLevel = 2.5
            case .high:
                status = .danger
                currentLevel = 3.8
            }
            
            let sensor = Sensor(
                id: UUID(),
                name: "\(zone.name) • датчик \(index + 1)",
                location: coord,
                currentLevel: currentLevel,
                maxLevel: maxLevel,
                status: status,
                lastUpdate: Date()
            )
            result.append(sensor)
        }
    }
    
    return result
}()

// MARK: - Водные объекты Казахстана (GidroAtlas)

// Небольшой хелпер для дат
private func gzDate(_ year: Int, _ month: Int, _ day: Int) -> Date {
    var comps = DateComponents()
    comps.year = year
    comps.month = month
    comps.day = day
    return Calendar.current.date(from: comps) ?? Date()
}

// Статический набор водных объектов по ТЗ
// (название, область, тип ресурса, тип воды, фауна, дата паспорта, состояние 1–5, координаты)
let WATER_OBJECTS_KZ: [WaterObject] = [
    WaterObject(
        id: UUID(),
        name: "Озеро Балхаш",
        region: "Жетысуская область",
        resourceType: .lake,
        waterType: .nonFresh, // смешанное / непресное
        hasFauna: true,
        passportDate: gzDate(2014, 6, 12),
        technicalCondition: 3,
        coordinate: CLLocationCoordinate2D(latitude: 46.167, longitude: 74.333),
        passportURL: nil
    ),
    WaterObject(
        id: UUID(),
        name: "Бухтарминское водохранилище",
        region: "Восточно-Казахстанская область",
        resourceType: .reservoir,
        waterType: .fresh,
        hasFauna: true,
        passportDate: gzDate(2010, 9, 25),
        technicalCondition: 2,
        coordinate: CLLocationCoordinate2D(latitude: 49.5372, longitude: 83.6267),
        passportURL: nil
    ),
    WaterObject(
        id: UUID(),
        name: "Капчагайское водохранилище",
        region: "Алматинская область",
        resourceType: .reservoir,
        waterType: .fresh,
        hasFauna: true,
        passportDate: gzDate(2016, 4, 3),
        technicalCondition: 2,
        coordinate: CLLocationCoordinate2D(latitude: 43.8655, longitude: 77.0529),
        passportURL: nil
    ),
    WaterObject(
        id: UUID(),
        name: "Шардаринское водохранилище",
        region: "Туркестанская область",
        resourceType: .reservoir,
        waterType: .fresh,
        hasFauna: true,
        passportDate: gzDate(2012, 11, 17),
        technicalCondition: 4,
        coordinate: CLLocationCoordinate2D(latitude: 41.2003, longitude: 67.9983),
        passportURL: nil
    ),
    WaterObject(
        id: UUID(),
        name: "Северная часть Аральского моря",
        region: "Кызылординская область",
        resourceType: .lake,
        waterType: .nonFresh,
        hasFauna: false,
        passportDate: gzDate(2005, 8, 9),
        technicalCondition: 5,
        coordinate: CLLocationCoordinate2D(latitude: 46.1, longitude: 61.5),
        passportURL: nil
    ),
    WaterObject(
        id: UUID(),
        name: "Ишимское водохранилище",
        region: "Астана",
        resourceType: .reservoir,
        waterType: .fresh,
        hasFauna: true,
        passportDate: gzDate(2018, 5, 20),
        technicalCondition: 2,
        coordinate: CLLocationCoordinate2D(latitude: 51.16, longitude: 71.47),
        passportURL: nil
    )
]

// MARK: - Комбинированный тип для старого Map API (iOS 16-)

private struct CombinedAnnotationItem: Identifiable {
    enum Kind {
        case sensor(Sensor)
        case waterObject(WaterObject)
    }
    
    let id = UUID()
    let coordinate: CLLocationCoordinate2D
    let kind: Kind
}

// MARK: - MapView

struct MapView: View {
    @EnvironmentObject var sensorStore: SensorStore
    
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 48.0, longitude: 68.0),
        span: MKCoordinateSpan(latitudeDelta: 18.0, longitudeDelta: 32.0)
    )
    
    @State private var selectedSensor: Sensor?
    @State private var selectedWaterObject: WaterObject?
    @State private var showSatellite = false
    @State private var animateMarkers = false
    
    // Все датчики: бэкенд + те, что по координатам зон
    private var sensors: [Sensor] {
        let backendSensors = sensorStore.sensors
        if backendSensors.isEmpty {
            // хотя бы зоны + река, если бэкенд ничего не вернул
            return SENSORS_FROM_ZONES + RIVER_SENSORS
        } else {
            return backendSensors + SENSORS_FROM_ZONES + RIVER_SENSORS
        }
    }
    
    // Водные объекты GidroAtlas
    private let waterObjects: [WaterObject] = WATER_OBJECTS_KZ
    
    // Для iOS 16-: общий список аннотаций
    private var legacyAnnotations: [CombinedAnnotationItem] {
        var items: [CombinedAnnotationItem] = []
        for s in sensors {
            items.append(
                CombinedAnnotationItem(
                    coordinate: s.location,
                    kind: .sensor(s)
                )
            )
        }
        for o in waterObjects {
            items.append(
                CombinedAnnotationItem(
                    coordinate: o.coordinate,
                    kind: .waterObject(o)
                )
            )
        }
        return items
    }
    
    private let zones: [RiskZone] = RISK_ZONES
    
    var body: some View {
        NavigationView {
            ZStack {
                // Основной слой карты
                mapContent
                    .ignoresSafeArea()
                
                // Верхний и нижний оверлеи
                VStack {
                    MapHeaderView(
                        showSatellite: $showSatellite,
                        onRefresh: {
                            Task {
                                await sensorStore.loadSensors(force: true)
                                withAnimation {
                                    animateMarkers.toggle()
                                }
                            }
                        }
                    )
                    .padding(.horizontal)
                    .padding(.top, 8)
                    
                    Spacer()
                    
                    VStack(spacing: 12) {
                        MapStatsPanel(sensors: sensors)
                        MapLegendView()
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 16)
                }
            }
            .navigationBarHidden(true)
            .onAppear {
                if sensorStore.sensors.isEmpty {
                    Task {
                        await sensorStore.loadSensors()
                    }
                }
                withAnimation(.spring(response: 0.6, dampingFraction: 0.7).delay(0.3)) {
                    animateMarkers = true
                }
            }
            // Детальная карточка датчика
            .sheet(item: $selectedSensor) { sensor in
                ModernSensorDetailSheet(sensor: sensor)
            }
            // Карточка водного объекта по ТЗ
            .sheet(item: $selectedWaterObject) { waterObject in
                WaterObjectQuickSheet(object: waterObject)
            }
        }
    }
    
    // MARK: - Map слой (iOS 17 / ниже)
    
    @ViewBuilder
    private var mapContent: some View {
        if #available(iOS 17.0, *) {
            Map(position: .constant(.region(region))) {
                // Полигоны зон риска
                ForEach(zones) { zone in
                    let polygon = MKPolygon(
                        coordinates: zone.coordinates,
                        count: zone.coordinates.count
                    )
                    MapPolygon(polygon)
                        .foregroundStyle(zone.fillColor)
                }
                
                // Точки датчиков
                ForEach(sensors) { sensor in
                    Annotation(sensor.name, coordinate: sensor.location) {
                        AnimatedSensorMarker(sensor: sensor, isAnimating: animateMarkers) {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                selectedSensor = sensor
                            }
                        }
                    }
                }
                
                // Водные объекты GidroAtlas
                ForEach(waterObjects) { object in
                    Annotation(object.name, coordinate: object.coordinate) {
                        WaterObjectMarkerView(object: object) {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                                selectedWaterObject = object
                            }
                        }
                    }
                }
            }
            .mapStyle(showSatellite ? .imagery : .standard)
        } else {
            // iOS 16 и ниже: один общий список аннотаций
            Map(coordinateRegion: $region, annotationItems: legacyAnnotations) { item in
                MapAnnotation(coordinate: item.coordinate) {
                    switch item.kind {
                    case .sensor(let sensor):
                        AnimatedSensorMarker(sensor: sensor, isAnimating: animateMarkers) {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                selectedSensor = sensor
                            }
                        }
                    case .waterObject(let object):
                        WaterObjectMarkerView(object: object) {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                                selectedWaterObject = object
                            }
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Header

struct MapHeaderView: View {
    @Binding var showSatellite: Bool
    let onRefresh: () -> Void
    
    var body: some View {
        HStack {
            OracleLogoView(size: 28, showText: false)
            
            Text("Карта водных объектов")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(OracleDesign.Colors.primary)
            
            Spacer()
            
            Button(action: {
                withAnimation(.easeInOut(duration: 0.25)) {
                    showSatellite.toggle()
                }
            }) {
                Image(systemName: showSatellite ? "map.fill" : "globe.americas.fill")
                    .font(.title3)
                    .foregroundColor(.white)
                    .frame(width: 44, height: 44)
                    .background(
                        LinearGradient(
                            colors: showSatellite
                            ? [OracleDesign.Colors.primary, OracleDesign.Colors.secondary]
                            : [.green, .green.opacity(0.8)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .clipShape(Circle())
                    .shadow(color: .black.opacity(0.2), radius: 5, y: 2)
            }
            
            Button(action: onRefresh) {
                Image(systemName: "arrow.clockwise")
                    .font(.title3)
                    .foregroundColor(.white)
                    .frame(width: 44, height: 44)
                    .background(OracleDesign.Colors.primaryGradient())
                    .clipShape(Circle())
                    .shadow(color: .black.opacity(0.2), radius: 5, y: 2)
            }
        }
        .padding(10)
        .background(
            .ultraThinMaterial,
            in: RoundedRectangle(cornerRadius: 20, style: .continuous)
        )
        .shadow(color: .black.opacity(0.1), radius: 12, y: 4)
    }
}

// MARK: - Легенда

struct MapLegendView: View {
    var body: some View {
        HStack {
            LegendItem(color: .green, text: "Низкий риск")
            Spacer()
            LegendItem(color: .yellow, text: "Средний риск")
            Spacer()
            LegendItem(color: .red, text: "Высокий риск")
        }
        .padding(12)
        .background(
            .thinMaterial,
            in: RoundedRectangle(cornerRadius: 18, style: .continuous)
        )
        .shadow(color: .black.opacity(0.08), radius: 10, y: 3)
    }
}

struct LegendItem: View {
    let color: Color
    let text: String
    
    var body: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(color)
                .frame(width: 10, height: 10)
            
            Text(text)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
    }
}

// MARK: - Анимированный маркер датчика

struct AnimatedSensorMarker: View {
    let sensor: Sensor
    let isAnimating: Bool
    let action: () -> Void
    @State private var isPulsing = false
    
    var body: some View {
        Button(action: action) {
            ZStack {
                if sensor.status == .warning || sensor.status == .danger || sensor.status == .critical {
                    Circle()
                        .fill(statusColor.opacity(0.3))
                        .frame(width: 60, height: 60)
                        .scaleEffect(isPulsing ? 1.3 : 1.0)
                        .opacity(isPulsing ? 0 : 0.8)
                }
                
                VStack(spacing: 4) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 14)
                            .fill(
                                LinearGradient(
                                    colors: [statusColor, statusColor.opacity(0.8)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 38, height: 38)
                            .shadow(color: statusColor.opacity(0.4), radius: 6, y: 3)
                        
                        Image(systemName: statusIconName)
                            .foregroundColor(.white)
                            .font(.system(size: 18, weight: .bold))
                    }
                    
                    TriangleShape()
                        .fill(statusColor)
                        .frame(width: 10, height: 8)
                        .shadow(color: statusColor.opacity(0.4), radius: 3, y: 1)
                }
                .offset(y: isAnimating ? 0 : -5)
                .animation(
                    .spring(response: 0.7, dampingFraction: 0.7)
                    .repeatForever(autoreverses: true),
                    value: isAnimating
                )
            }
        }
        .buttonStyle(PlainButtonStyle())
        .onAppear {
            if isAnimating {
                withAnimation {
                    isPulsing = true
                }
            }
        }
    }
    
    private var statusColor: Color {
        switch sensor.status {
        case .safe:
            return .green
        case .warning:
            return .yellow
        case .danger:
            return .orange
        case .critical:
            return .red
        }
    }
    
    private var statusIconName: String {
        switch sensor.status {
        case .safe:
            return "checkmark"
        case .warning:
            return "exclamationmark.triangle.fill"
        case .danger:
            return "flame.fill"
        case .critical:
            return "exclamationmark.octagon.fill"
        }
    }
}

// MARK: - Маркер водного объекта

struct WaterObjectMarkerView: View {
    let object: WaterObject
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 3) {
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(
                            LinearGradient(
                                colors: [OracleDesign.Colors.waterBlue, OracleDesign.Colors.waterCyan],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 34, height: 34)
                        .shadow(color: OracleDesign.Colors.waterBlue.opacity(0.4), radius: 5, y: 3)
                    
                    Image(systemName: "drop.fill")
                        .foregroundColor(.white)
                        .font(.system(size: 18, weight: .bold))
                }
                
                TriangleShape()
                    .fill(OracleDesign.Colors.waterBlue)
                    .frame(width: 10, height: 8)
                    .shadow(color: OracleDesign.Colors.waterBlue.opacity(0.4), radius: 3, y: 1)
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Треугольник хвостик

struct TriangleShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let width = rect.width
        let height = rect.height
        path.move(to: CGPoint(x: width / 2, y: height))
        path.addLine(to: CGPoint(x: 0, y: 0))
        path.addLine(to: CGPoint(x: width, y: 0))
        path.closeSubpath()
        return path
    }
}

// MARK: - Детальная карточка датчика (как была)

struct ModernSensorDetailSheet: View {
    let sensor: Sensor
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text(sensor.name)
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(OracleDesign.Colors.primary)
                            
                            Spacer()
                            
                            Text(sensor.status.rawValue)
                                .font(.caption)
                                .fontWeight(.semibold)
                                .padding(.horizontal, 10)
                                .padding(.vertical, 5)
                                .background(statusBadgeColor.opacity(0.2))
                                .foregroundColor(statusBadgeColor)
                                .clipShape(Capsule())
                        }
                        
                        Text("Детальная информация о состоянии воды по данному датчику.")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding(16)
                    .background(
                        RoundedRectangle(cornerRadius: 20)
                            .fill(Color.white)
                            .shadow(color: .black.opacity(0.05), radius: 10, y: 4)
                    )
                    
                    HStack(spacing: 16) {
                        SensorMetricCard(
                            title: "Текущий уровень",
                            value: String(format: "%.2f м", sensor.currentLevel),
                            icon: "waveform.path.ecg",
                            color: OracleDesign.Colors.waterBlue
                        )
                        
                        SensorMetricCard(
                            title: "Максимум",
                            value: String(format: "%.2f м", sensor.maxLevel),
                            icon: "chart.line.uptrend.xyaxis",
                            color: .orange
                        )
                    }
                    
                    SensorLevelProgressView(sensor: sensor)
                    
                    SensorHistoryView()
                }
                .padding(16)
            }
            .navigationTitle("Датчик")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    private var statusBadgeColor: Color {
        switch sensor.status {
        case .safe:
            return .green
        case .warning:
            return .yellow
        case .danger:
            return .orange
        case .critical:
            return .red
        }
    }
}

// MARK: - Карточки метрик

struct SensorMetricCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                ZStack {
                    Circle()
                        .fill(color.opacity(0.2))
                        .frame(width: 34, height: 34)
                    Image(systemName: icon)
                        .foregroundColor(color)
                        .font(.system(size: 18))
                }
                
                Spacer()
            }
            
            Text(value)
                .font(.headline)
                .foregroundColor(OracleDesign.Colors.primary)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(14)
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .shadow(color: .black.opacity(0.06), radius: 8, y: 3)
    }
}

// MARK: - Прогресс по уровню

struct SensorLevelProgressView: View {
    let sensor: Sensor
    
    private var progress: Double {
        min(max(sensor.levelPercentage / 100.0, 0), 1)
    }
    
    private var statusColor: Color {
        switch sensor.status {
        case .safe:
            return .green
        case .warning:
            return .yellow
        case .danger:
            return .orange
        case .critical:
            return .red
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Заполнение относительно максимума")
                    .font(.subheadline)
                    .foregroundColor(OracleDesign.Colors.primary)
                
                Spacer()
                
                Text("\(Int(progress * 100))%")
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(statusColor)
            }
            
            HStack(spacing: 16) {
                ZStack {
                    Circle()
                        .stroke(Color.gray.opacity(0.2), lineWidth: 10)
                        .frame(width: 80, height: 80)
                    
                    Circle()
                        .trim(from: 0.0, to: progress)
                        .stroke(
                            AngularGradient(
                                gradient: Gradient(colors: [statusColor, statusColor.opacity(0.7), statusColor]),
                                center: .center
                            ),
                            style: StrokeStyle(lineWidth: 10, lineCap: .round)
                        )
                        .frame(width: 80, height: 80)
                        .rotationEffect(.degrees(-90))
                    
                    Text("\(Int(progress * 100))%")
                        .font(.title3)
                        .fontWeight(.bold)
                        .foregroundColor(statusColor)
                }
            }
            
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(Color.gray.opacity(0.2))
                    
                    RoundedRectangle(cornerRadius: 10)
                        .fill(
                            LinearGradient(
                                colors: [statusColor, statusColor.opacity(0.7)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: geometry.size.width * CGFloat(progress))
                }
            }
            .frame(height: 12)
        }
        .padding(20)
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        .shadow(color: .black.opacity(0.06), radius: 10, y: 3)
    }
}

// MARK: - История (заглушка)

struct SensorHistoryView: View {
    let data: [Double] = [1.5, 1.8, 2.1, 2.4, 2.2, 2.5, 2.3]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("История изменений (условные данные)")
                .font(.subheadline)
                .foregroundColor(OracleDesign.Colors.primary)
            
            SimpleLineChart(data: data)
                .frame(height: 120)
        }
        .padding(16)
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        .shadow(color: .black.opacity(0.06), radius: 8, y: 3)
    }
}

// MARK: - Простой линейный график

struct SimpleLineChart: View {
    let data: [Double]
    
    var body: some View {
        GeometryReader { geometry in
            let maxValue = (data.max() ?? 1)
            let minValue = (data.min() ?? 0)
            let range = maxValue - minValue == 0 ? 1 : maxValue - minValue
            
            Path { path in
                for index in data.indices {
                    let x = geometry.size.width * CGFloat(index) / CGFloat(max(data.count - 1, 1))
                    let normalized = (data[index] - minValue) / range
                    let y = geometry.size.height * (1 - CGFloat(normalized))
                    
                    if index == 0 {
                        path.move(to: CGPoint(x: x, y: y))
                    } else {
                        path.addLine(to: CGPoint(x: x, y: y))
                    }
                }
            }
            .stroke(
                LinearGradient(
                    colors: [OracleDesign.Colors.waterBlue, OracleDesign.Colors.waterCyan],
                    startPoint: .leading,
                    endPoint: .trailing
                ),
                style: StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round)
            )
        }
    }
}

// MARK: - Статистика по датчикам

struct MapStatsPanel: View {
    let sensors: [Sensor]
    
    var stats: (safe: Int, warning: Int, danger: Int) {
        var safe = 0, warning = 0, danger = 0
        for sensor in sensors {
            switch sensor.status {
            case .safe: safe += 1
            case .warning: warning += 1
            case .danger, .critical: danger += 1
            }
        }
        return (safe, warning, danger)
    }
    
    var body: some View {
        HStack(spacing: 10) {
            MapStatItem(
                count: stats.safe,
                label: "Норма",
                color: .green,
                icon: "checkmark.circle.fill"
            )
            
            MapStatItem(
                count: stats.warning,
                label: "Предупр.",
                color: .orange,
                icon: "exclamationmark.triangle.fill"
            )
            
            MapStatItem(
                count: stats.danger,
                label: "Опасно",
                color: .red,
                icon: "flame.fill"
            )
        }
        .padding(12)
        .background(
            .ultraThinMaterial,
            in: RoundedRectangle(cornerRadius: 18, style: .continuous)
        )
        .shadow(color: .black.opacity(0.08), radius: 10, y: 3)
    }
}

struct MapStatItem: View {
    let count: Int
    let label: String
    let color: Color
    let icon: String
    
    var body: some View {
        HStack(spacing: 8) {
            ZStack {
                Circle()
                    .fill(color.opacity(0.15))
                    .frame(width: 28, height: 28)
                
                Image(systemName: icon)
                    .font(.system(size: 14))
                    .foregroundColor(color)
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text("\(count)")
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .foregroundColor(OracleDesign.Colors.primary)
                
                Text(label)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
    }
}

// MARK: - Карточка водного объекта по ТЗ

private let waterObjectDateFormatter: DateFormatter = {
    let f = DateFormatter()
    f.dateStyle = .medium
    f.timeStyle = .none
    return f
}()

struct WaterObjectQuickSheet: View {
    let object: WaterObject
    
    private var coordinatesString: String {
        String(format: "%.4f, %.4f", object.coordinate.latitude, object.coordinate.longitude)
    }
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
                    // Основной блок
                    VStack(alignment: .leading, spacing: 8) {
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(object.name)
                                    .font(.title2)
                                    .fontWeight(.bold)
                                    .foregroundColor(OracleDesign.Colors.primary)
                                
                                Text(object.region)
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                            
                            // Категория состояния 1–5
                            VStack(alignment: .trailing, spacing: 4) {
                                Text("Состояние")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                
                                HStack(spacing: 6) {
                                    Text("\(object.technicalCondition)")
                                        .font(.headline)
                                        .foregroundColor(conditionColor)
                                    
                                    Circle()
                                        .fill(conditionColor.opacity(0.2))
                                        .frame(width: 22, height: 22)
                                        .overlay(
                                            Circle()
                                                .stroke(conditionColor, lineWidth: 2)
                                        )
                                }
                            }
                        }
                        
                        Text("Краткая карточка водного объекта по данным паспорта.")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding(16)
                    .background(
                        RoundedRectangle(cornerRadius: 20)
                            .fill(Color.white)
                            .shadow(color: .black.opacity(0.05), radius: 10, y: 4)
                    )
                    
                    // Основные атрибуты по ТЗ
                    VStack(alignment: .leading, spacing: 12) {
                        Group {
                            WaterObjectInfoRow(title: "Область", value: object.region, icon: "mappin.and.ellipse")
                            
                            WaterObjectInfoRow(
                                title: "Тип водного ресурса",
                                value: object.resourceType.rawValue,
                                icon: "water.waves"
                            )
                            
                            WaterObjectInfoRow(
                                title: "Тип воды",
                                value: object.waterType.rawValue,
                                icon: "drop.fill"
                            )
                            
                            WaterObjectInfoRow(
                                title: "Наличие фауны",
                                value: object.hasFauna ? "Есть" : "Нет",
                                icon: "fish"
                            )
                            
                            WaterObjectInfoRow(
                                title: "Дата паспорта",
                                value: waterObjectDateFormatter.string(from: object.passportDate),
                                icon: "calendar"
                            )
                            
                            WaterObjectInfoRow(
                                title: "Категория состояния (1–5)",
                                value: "\(object.technicalCondition)",
                                icon: "bolt.heart"
                            )
                            
                            WaterObjectInfoRow(
                                title: "Координаты",
                                value: coordinatesString,
                                icon: "location.north.line"
                            )
                        }
                    }
                    .padding(16)
                    .background(
                        RoundedRectangle(cornerRadius: 20)
                            .fill(Color.white)
                            .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
                    )
                    
                    // Кнопка "Открыть паспорт"
                    if let url = object.passportURL {
                        Link(destination: url) {
                            HStack {
                                Image(systemName: "doc.richtext")
                                Text("Открыть паспорт объекта (PDF)")
                            }
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(OracleDesign.Colors.primaryGradient())
                            .foregroundColor(.white)
                            .cornerRadius(16)
                            .shadow(color: .black.opacity(0.15), radius: 8, y: 3)
                        }
                    } else {
                        HStack {
                            Image(systemName: "doc.richtext")
                            Text("Паспорт объекта не прикреплён")
                        }
                        .font(.subheadline)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Color.gray.opacity(0.1))
                        .foregroundColor(.secondary)
                        .cornerRadius(16)
                    }
                    
                    Spacer(minLength: 8)
                }
                .padding(16)
            }
            .navigationTitle("Водный объект")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    private var conditionColor: Color {
        switch object.technicalCondition {
        case 1: return .green
        case 2: return .green.opacity(0.8)
        case 3: return .yellow
        case 4: return .orange
        default: return .red
        }
    }
}

struct WaterObjectInfoRow: View {
    let title: String
    let value: String
    let icon: String
    
    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            ZStack {
                Circle()
                    .fill(OracleDesign.Colors.waterBlue.opacity(0.12))
                    .frame(width: 26, height: 26)
                Image(systemName: icon)
                    .font(.system(size: 13))
                    .foregroundColor(OracleDesign.Colors.waterBlue)
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Text(value)
                    .font(.subheadline)
                    .foregroundColor(OracleDesign.Colors.primary)
            }
            
            Spacer()
        }
    }
}

// MARK: - Preview

#Preview {
    MapView()
        .environmentObject(SensorStore())
}

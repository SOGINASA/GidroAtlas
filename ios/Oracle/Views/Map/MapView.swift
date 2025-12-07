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

// Все зоны из zones_data (как у тебя было)
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
        relatedSensorIDs: [
            "sensor-42","sensor-43","sensor-44",
            "sensor-45","sensor-46","sensor-47","sensor-48"
        ]
    )
]

// MARK: - Модели для Казахстана: водоёмы, ГТС, критические зоны

/// Объект водного ресурса на карте (минимальная версия только для карты)
struct MapWaterObject: Identifiable {
    let id = UUID()
    let name: String
    let region: String
    let resourceType: String      // озеро / водохранилище / река / канал
    let waterType: String         // пресная / солоноватая и т.п.
    let hasFauna: Bool            // есть ли рыбные/биоресурсы
    let passportYear: Int         // год паспортизации
    let technicalCategory: Int    // 1–5
    let coordinate: CLLocationCoordinate2D
}

/// Гидротехническое сооружение (ГЭС / плотина и т.д.)
struct HydroFacility: Identifiable {
    let id = UUID()
    let name: String
    let region: String
    let type: String              // ГЭС / Плотина и т.п.
    let conditionCategory: Int    // 1–5
    let coordinate: CLLocationCoordinate2D
}

/// Критическая зона по руслу реки
enum CriticalLevel {
    case warning
    case critical
}

struct CriticalFloodZone: Identifiable {
    let id = UUID()
    let name: String
    let region: String
    let level: CriticalLevel
    let description: String
    let coordinate: CLLocationCoordinate2D
}

// Немного реальных объектов по Казахстану (координаты из твоего React-кода)

let WATER_OBJECTS_KZ: [MapWaterObject] = [
    MapWaterObject(
        name: "Озеро Балхаш",
        region: "Карагандинская область",
        resourceType: "Озеро",
        waterType: "Смешанная (пресная/солоноватая)",
        hasFauna: true,
        passportYear: 2022,
        technicalCategory: 3,
        coordinate: CLLocationCoordinate2D(latitude: 46.8, longitude: 74.9)
    ),
    MapWaterObject(
        name: "Капшагайское водохранилище",
        region: "Алматинская область",
        resourceType: "Водохранилище",
        waterType: "Пресная",
        hasFauna: true,
        passportYear: 2021,
        technicalCategory: 2,
        coordinate: CLLocationCoordinate2D(latitude: 43.9, longitude: 77.1)
    ),
    MapWaterObject(
        name: "Бухтарминское водохранилище",
        region: "Восточно-Казахстанская область",
        resourceType: "Водохранилище",
        waterType: "Пресная",
        hasFauna: true,
        passportYear: 2020,
        technicalCategory: 5,
        coordinate: CLLocationCoordinate2D(latitude: 47.4, longitude: 83.1)
    ),
    MapWaterObject(
        name: "Шардаринское водохранилище",
        region: "Туркестанская область",
        resourceType: "Водохранилище",
        waterType: "Пресная",
        hasFauna: true,
        passportYear: 2019,
        technicalCategory: 2,
        coordinate: CLLocationCoordinate2D(latitude: 41.2, longitude: 68.3)
    ),
    MapWaterObject(
        name: "Озеро Жайсан",
        region: "Восточно-Казахстанская область",
        resourceType: "Озеро",
        waterType: "Пресная",
        hasFauna: true,
        passportYear: 2018,
        technicalCategory: 3,
        coordinate: CLLocationCoordinate2D(latitude: 47.5, longitude: 84.8)
    ),
    MapWaterObject(
        name: "Озеро Алаколь",
        region: "Жетысуская область",
        resourceType: "Озеро",
        waterType: "Солоноватая",
        hasFauna: true,
        passportYear: 2023,
        technicalCategory: 1,
        coordinate: CLLocationCoordinate2D(latitude: 46.2, longitude: 81.8)
    ),
    MapWaterObject(
        name: "Озеро Тенгиз",
        region: "Акмолинская область",
        resourceType: "Озеро",
        waterType: "Солёная",
        hasFauna: false,
        passportYear: 2017,
        technicalCategory: 4,
        coordinate: CLLocationCoordinate2D(latitude: 50.5, longitude: 69.0)
    ),
    MapWaterObject(
        name: "Водохранилище Сорбулак",
        region: "Алматинская область",
        resourceType: "Водохранилище",
        waterType: "Слабо минерализованная",
        hasFauna: false,
        passportYear: 2020,
        technicalCategory: 2,
        coordinate: CLLocationCoordinate2D(latitude: 43.4, longitude: 77.3)
    )
]

let HYDRO_FACILITIES_KZ: [HydroFacility] = [
    HydroFacility(
        name: "Бухтарминская ГЭС",
        region: "Восточно-Казахстанская область",
        type: "ГЭС",
        conditionCategory: 3,
        coordinate: CLLocationCoordinate2D(latitude: 47.4, longitude: 83.1)
    ),
    HydroFacility(
        name: "Капшагайская ГЭС",
        region: "Алматинская область",
        type: "ГЭС",
        conditionCategory: 2,
        coordinate: CLLocationCoordinate2D(latitude: 43.9, longitude: 77.1)
    ),
    HydroFacility(
        name: "Шардаринская ГЭС",
        region: "Туркестанская область",
        type: "ГЭС",
        conditionCategory: 4,
        coordinate: CLLocationCoordinate2D(latitude: 41.2, longitude: 68.3)
    ),
    HydroFacility(
        name: "Усть-Каменогорская ГЭС",
        region: "Восточно-Казахстанская область",
        type: "ГЭС",
        conditionCategory: 2,
        coordinate: CLLocationCoordinate2D(latitude: 49.9, longitude: 82.6)
    ),
    HydroFacility(
        name: "Плотина Коктерек",
        region: "Алматинская область",
        type: "Плотина",
        conditionCategory: 5,
        coordinate: CLLocationCoordinate2D(latitude: 43.2, longitude: 76.8)
    ),
    HydroFacility(
        name: "Плотина Сорбулак",
        region: "Алматинская область",
        type: "Плотина",
        conditionCategory: 1,
        coordinate: CLLocationCoordinate2D(latitude: 43.4, longitude: 77.3)
    )
]

let CRITICAL_ZONES_KZ: [CriticalFloodZone] = [
    CriticalFloodZone(
        name: "Иртыш (Павлодар)",
        region: "Павлодарская область",
        level: .critical,
        description: "Высокий уровень воды, риск выходa на пойму",
        coordinate: CLLocationCoordinate2D(latitude: 52.3, longitude: 76.9)
    ),
    CriticalFloodZone(
        name: "Урал (Уральск)",
        region: "Западно-Казахстанская область",
        level: .warning,
        description: "Повышенный уровень, требуется мониторинг",
        coordinate: CLLocationCoordinate2D(latitude: 51.2, longitude: 51.4)
    ),
    CriticalFloodZone(
        name: "Сырдарья (Кызылорда)",
        region: "Кызылординская область",
        level: .critical,
        description: "Критический уровень, возможен выход воды на пойму",
        coordinate: CLLocationCoordinate2D(latitude: 44.8, longitude: 65.5)
    )
]

// MARK: - Фильтр регионов

enum RegionFilter: String, CaseIterable, Identifiable {
    case all
    case almaty
    case vko
    case karaganda
    case pavlodar
    case turkestan
    case jetysu
    case kzylorda
    case northKz
    
    var id: String { rawValue }
    
    var title: String {
        switch self {
        case .all: return "Вся страна"
        case .almaty: return "Алматинская обл."
        case .vko: return "ВКО"
        case .karaganda: return "Карагандинская обл."
        case .pavlodar: return "Павлодарская обл."
        case .turkestan: return "Туркестанская обл."
        case .jetysu: return "Жетысуская обл."
        case .kzylorda: return "Кызылординская обл."
        case .northKz: return "Северо-Казахстанская обл."
        }
    }
    
    /// Кусочек строки, по которой фильтруем `region.lowercased()`
    var query: String? {
        switch self {
        case .all: return nil
        case .almaty: return "алматин"
        case .vko: return "восточно"
        case .karaganda: return "караганд"
        case .pavlodar: return "павлодар"
        case .turkestan: return "туркестан"
        case .jetysu: return "жетысу"
        case .kzylorda: return "кызылорд"
        case .northKz: return "северо-казахстан"
        }
    }
}

// MARK: - Датчики вдоль реки (как было)

let RIVER_SENSORS: [Sensor] = [
    // … здесь оставь твой текущий длинный список "Речной датчик 1–42"
    // Я его не обрезаю логически, просто скопируй из своего файла.
]

/// Датчики, сгенерированные по координатам зон риска (как у тебя было)
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

// MARK: - MapView

struct MapView: View {
    @EnvironmentObject var sensorStore: SensorStore
    
    // Теперь Россия не нужна — старт сразу по Казахстану целиком
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 48.0, longitude: 68.0),
        span: MKCoordinateSpan(latitudeDelta: 18.0, longitudeDelta: 32.0)
    )
    
    @State private var selectedSensor: Sensor?
    @State private var selectedWaterObject: MapWaterObject?
    
    @State private var showSatellite = false
    @State private var animateMarkers = false
    
    // Слои
    @State private var showWaterObjects = true
    @State private var showFacilities = true
    @State private var showCriticalZones = true
    @State private var showSensors = true
    
    // Фильтр региона
    @State private var selectedRegion: RegionFilter = .all
    
    private var zones: [RiskZone] { RISK_ZONES }
    private var waterObjects: [MapWaterObject] { WATER_OBJECTS_KZ }
    private var facilities: [HydroFacility] { HYDRO_FACILITIES_KZ }
    private var criticalZones: [CriticalFloodZone] { CRITICAL_ZONES_KZ }
    
    // Все датчики: бэкенд + зоны + река
    private var sensors: [Sensor] {
        let backendSensors = sensorStore.sensors
        if backendSensors.isEmpty {
            return SENSORS_FROM_ZONES + RIVER_SENSORS
        } else {
            return backendSensors + SENSORS_FROM_ZONES + RIVER_SENSORS
        }
    }
    
    // Фильтрация по региону
    private func passesRegionFilter(regionName: String) -> Bool {
        guard let query = selectedRegion.query else { return true }
        return regionName.lowercased().contains(query)
    }
    
    private var filteredWaterObjects: [MapWaterObject] {
        waterObjects.filter { passesRegionFilter(regionName: $0.region) }
    }
    
    private var filteredFacilities: [HydroFacility] {
        facilities.filter { passesRegionFilter(regionName: $0.region) }
    }
    
    private var filteredCriticalZones: [CriticalFloodZone] {
        criticalZones.filter { passesRegionFilter(regionName: $0.region) }
    }
    
    // Для iOS 16 и ниже — общий список аннотаций
    private struct CombinedAnnotationItem: Identifiable {
        let id = UUID()
        let coordinate: CLLocationCoordinate2D
        let kind: Kind
        
        enum Kind {
            case sensor(Sensor)
            case water(MapWaterObject)
            case facility(HydroFacility)
            case critical(CriticalFloodZone)
        }
    }
    
    private var legacyAnnotations: [CombinedAnnotationItem] {
        var items: [CombinedAnnotationItem] = []
        
        if showSensors {
            items += sensors.map {
                CombinedAnnotationItem(
                    coordinate: $0.location,
                    kind: .sensor($0)
                )
            }
        }
        
        if showWaterObjects {
            items += filteredWaterObjects.map {
                CombinedAnnotationItem(
                    coordinate: $0.coordinate,
                    kind: .water($0)
                )
            }
        }
        
        if showFacilities {
            items += filteredFacilities.map {
                CombinedAnnotationItem(
                    coordinate: $0.coordinate,
                    kind: .facility($0)
                )
            }
        }
        
        if showCriticalZones {
            items += filteredCriticalZones.map {
                CombinedAnnotationItem(
                    coordinate: $0.coordinate,
                    kind: .critical($0)
                )
            }
        }
        
        return items
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                mapContent
                    .ignoresSafeArea()
                
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
                    
                    VStack(spacing: 10) {
                        MapLayerFilterPanel(
                            showWaterObjects: $showWaterObjects,
                            showFacilities: $showFacilities,
                            showCriticalZones: $showCriticalZones,
                            showSensors: $showSensors,
                            waterCount: filteredWaterObjects.count,
                            facilityCount: filteredFacilities.count,
                            criticalCount: filteredCriticalZones.count,
                            sensorCount: sensors.count
                        )
                        
                        MapRegionFilterPanel(selectedRegion: $selectedRegion)
                        
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
            .sheet(item: $selectedSensor) { sensor in
                ModernSensorDetailSheet(sensor: sensor)
            }
            .sheet(item: $selectedWaterObject) { waterObject in
                WaterObjectQuickSheet(waterObject: waterObject)
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
                
                // Водоёмы
                if showWaterObjects {
                    ForEach(filteredWaterObjects) { waterObject in
                        Annotation(waterObject.name, coordinate: waterObject.coordinate) {
                            WaterObjectMarkerView(waterObject: waterObject) {
                                withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                                    selectedWaterObject = waterObject
                                }
                            }
                        }
                    }
                }
                
                // ГТС
                if showFacilities {
                    ForEach(filteredFacilities) { facility in
                        Annotation(facility.name, coordinate: facility.coordinate) {
                            HydroFacilityMarkerView(facility: facility)
                        }
                    }
                }
                
                // Критические зоны
                if showCriticalZones {
                    ForEach(filteredCriticalZones) { zone in
                        Annotation(zone.name, coordinate: zone.coordinate) {
                            CriticalZoneMarkerView(zone: zone)
                        }
                    }
                }
                
                // Датчики
                if showSensors {
                    ForEach(sensors) { sensor in
                        Annotation(sensor.name, coordinate: sensor.location) {
                            AnimatedSensorMarker(sensor: sensor, isAnimating: animateMarkers) {
                                withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                    selectedSensor = sensor
                                }
                            }
                        }
                    }
                }
            }
            .mapStyle(showSatellite ? .imagery : .standard)
        } else {
            Map(coordinateRegion: $region, annotationItems: legacyAnnotations) { item in
                MapAnnotation(coordinate: item.coordinate) {
                    switch item.kind {
                    case .sensor(let sensor):
                        AnimatedSensorMarker(sensor: sensor, isAnimating: animateMarkers) {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                selectedSensor = sensor
                            }
                        }
                    case .water(let waterObject):
                        WaterObjectMarkerView(waterObject: waterObject) {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                                selectedWaterObject = waterObject
                            }
                        }
                    case .facility(let facility):
                        HydroFacilityMarkerView(facility: facility)
                    case .critical(let zone):
                        CriticalZoneMarkerView(zone: zone)
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
            
            VStack(alignment: .leading, spacing: 2) {
                Text("Карта мониторинга")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(OracleDesign.Colors.primary)
                
                Text("Водоёмы, ГТС и датчики по Казахстану")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Button(action: {
                withAnimation(.easeInOut(duration: 0.25)) {
                    showSatellite.toggle()
                }
            }) {
                Image(systemName: showSatellite ? "map.fill" : "globe.asia.australia.fill")
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

// MARK: - Панель слоёв

struct MapLayerFilterPanel: View {
    @Binding var showWaterObjects: Bool
    @Binding var showFacilities: Bool
    @Binding var showCriticalZones: Bool
    @Binding var showSensors: Bool
    
    let waterCount: Int
    let facilityCount: Int
    let criticalCount: Int
    let sensorCount: Int
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                LayerToggleChip(
                    title: "Водоёмы",
                    count: waterCount,
                    systemImage: "drop.fill",
                    color: .blue,
                    isOn: $showWaterObjects
                )
                
                LayerToggleChip(
                    title: "ГТС",
                    count: facilityCount,
                    systemImage: "bolt.fill",
                    color: .purple,
                    isOn: $showFacilities
                )
                
                LayerToggleChip(
                    title: "Критические зоны",
                    count: criticalCount,
                    systemImage: "exclamationmark.triangle.fill",
                    color: .red,
                    isOn: $showCriticalZones
                )
                
                LayerToggleChip(
                    title: "Датчики",
                    count: sensorCount,
                    systemImage: "antenna.radiowaves.left.and.right",
                    color: .green,
                    isOn: $showSensors
                )
            }
            .padding(10)
        }
        .background(
            .ultraThinMaterial,
            in: RoundedRectangle(cornerRadius: 18, style: .continuous)
        )
        .shadow(color: .black.opacity(0.08), radius: 8, y: 3)
    }
}

struct LayerToggleChip: View {
    let title: String
    let count: Int
    let systemImage: String
    let color: Color
    @Binding var isOn: Bool
    
    var body: some View {
        Button {
            withAnimation(.easeInOut(duration: 0.2)) {
                isOn.toggle()
            }
        } label: {
            HStack(spacing: 6) {
                Image(systemName: systemImage)
                    .font(.system(size: 13, weight: .semibold))
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.caption2)
                        .fontWeight(.semibold)
                    Text("\(count)")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            .padding(.vertical, 6)
            .padding(.horizontal, 10)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(isOn ? color.opacity(0.16) : Color(.systemBackground).opacity(0.92))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .stroke(isOn ? color : Color.gray.opacity(0.25), lineWidth: 1)
            )
            .foregroundColor(isOn ? color : .secondary)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Фильтр региона

struct MapRegionFilterPanel: View {
    @Binding var selectedRegion: RegionFilter
    
    var body: some View {
        HStack {
            Image(systemName: "line.3.horizontal.decrease.circle")
                .foregroundColor(OracleDesign.Colors.primary)
            
            Text("Регион:")
                .font(.caption)
                .foregroundColor(.secondary)
            
            Menu {
                ForEach(RegionFilter.allCases) { region in
                    Button {
                        selectedRegion = region
                    } label: {
                        if region == selectedRegion {
                            Label(region.title, systemImage: "checkmark")
                        } else {
                            Text(region.title)
                        }
                    }
                }
            } label: {
                HStack(spacing: 6) {
                    Text(selectedRegion.title)
                        .font(.subheadline)
                    Image(systemName: "chevron.up.chevron.down")
                        .font(.caption2)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .fill(Color(.systemBackground).opacity(0.95))
                )
            }
            
            Spacer()
        }
        .padding(10)
        .background(
            .ultraThinMaterial,
            in: RoundedRectangle(cornerRadius: 18, style: .continuous)
        )
        .shadow(color: .black.opacity(0.06), radius: 8, y: 3)
    }
}

// MARK: - Легенда зон риска (как было)

struct MapLegendView: View {
    var body: some View {
        HStack {
            LegendItem(color: .green, text: "Низкий риск / Кат. 1–2")
            Spacer()
            LegendItem(color: .yellow, text: "Средний риск / Кат. 3")
            Spacer()
            LegendItem(color: .red, text: "Высокий риск / Кат. 4–5")
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

// MARK: - Маркерлер

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

// Водоёмы
struct WaterObjectMarkerView: View {
    let waterObject: MapWaterObject
    let action: () -> Void
    
    private var categoryColor: Color {
        switch waterObject.technicalCategory {
        case 5: return .red
        case 4: return .orange
        case 3: return .yellow
        case 2: return .green.opacity(0.8)
        default: return .green
        }
    }
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                ZStack {
                    Circle()
                        .fill(Color.blue.opacity(0.9))
                        .frame(width: 34, height: 34)
                        .shadow(color: .blue.opacity(0.4), radius: 6, y: 3)
                    
                    Image(systemName: "drop.fill")
                        .foregroundColor(.white)
                        .font(.system(size: 18, weight: .bold))
                }
                
                Text("Кат. \(waterObject.technicalCategory)")
                    .font(.system(size: 9, weight: .semibold))
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(
                        Capsule()
                            .fill(categoryColor.opacity(0.18))
                    )
                    .foregroundColor(categoryColor)
            }
        }
        .buttonStyle(.plain)
    }
}

// ГТС
struct HydroFacilityMarkerView: View {
    let facility: HydroFacility
    
    private var color: Color {
        switch facility.conditionCategory {
        case 5: return .red
        case 4: return .orange
        case 3: return .yellow
        case 2: return .green.opacity(0.8)
        default: return .green
        }
    }
    
    var body: some View {
        VStack(spacing: 4) {
            ZStack {
                RoundedRectangle(cornerRadius: 10, style: .continuous)
                    .fill(color)
                    .frame(width: 32, height: 32)
                    .shadow(color: color.opacity(0.5), radius: 6, y: 3)
                
                Image(systemName: "bolt.fill")
                    .foregroundColor(.white)
                    .font(.system(size: 16, weight: .bold))
            }
            
            Text("\(facility.conditionCategory)")
                .font(.system(size: 9, weight: .semibold))
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(
                    Capsule()
                        .fill(Color(.systemBackground).opacity(0.9))
                )
                .foregroundColor(color)
        }
    }
}

// Критические зоны рек
struct CriticalZoneMarkerView: View {
    let zone: CriticalFloodZone
    @State private var pulse = false
    
    private var color: Color {
        switch zone.level {
        case .critical: return .red
        case .warning: return .orange
        }
    }
    
    var body: some View {
        ZStack {
            Circle()
                .fill(color.opacity(0.25))
                .frame(width: 60, height: 60)
                .scaleEffect(pulse ? 1.3 : 1.0)
                .opacity(pulse ? 0 : 1)
            
            ZStack {
                Circle()
                    .fill(color)
                    .frame(width: 32, height: 32)
                    .shadow(color: color.opacity(0.5), radius: 6, y: 3)
                
                Image(systemName: "exclamationmark.triangle.fill")
                    .foregroundColor(.white)
                    .font(.system(size: 18, weight: .bold))
            }
        }
        .onAppear {
            withAnimation(
                .easeOut(duration: 1.4)
                    .repeatForever(autoreverses: false)
            ) {
                pulse = true
            }
        }
    }
}

// MARK: - Хвостик маркера

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

// MARK: - Детальная карточка датчика (как было)

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

// MARK: - Карточка водоёма

struct WaterObjectQuickSheet: View {
    let waterObject: MapWaterObject
    
    private var categoryColor: Color {
        switch waterObject.technicalCategory {
        case 5: return .red
        case 4: return .orange
        case 3: return .yellow
        case 2: return .green.opacity(0.8)
        default: return .green
        }
    }
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(waterObject.name)
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(OracleDesign.Colors.primary)
                        
                        Text(waterObject.region)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        
                        HStack(spacing: 8) {
                            Text(waterObject.resourceType)
                            Text("•")
                            Text(waterObject.waterType)
                        }
                        .font(.caption)
                        .foregroundColor(.secondary)
                    }
                    .padding(16)
                    .background(
                        RoundedRectangle(cornerRadius: 20)
                            .fill(Color.white)
                            .shadow(color: .black.opacity(0.05), radius: 10, y: 4)
                    )
                    
                    VStack(spacing: 12) {
                        WaterObjectInfoRow(
                            label: "Наличие фауны",
                            value: waterObject.hasFauna ? "Есть рыбные ресурсы" : "Биоресурсы ограничены"
                        )
                        WaterObjectInfoRow(
                            label: "Дата паспорта",
                            value: "\(waterObject.passportYear) г."
                        )
                        WaterObjectInfoRow(
                            label: "Категория состояния",
                            value: "Категория \(waterObject.technicalCategory)",
                            badgeColor: categoryColor
                        )
                    }
                    .padding(16)
                    .background(
                        RoundedRectangle(cornerRadius: 20)
                            .fill(Color.white)
                            .shadow(color: .black.opacity(0.05), radius: 10, y: 4)
                    )
                    
                    Text("Детальные паспорта и документы могут быть подключены на следующем этапе (PDF/ссылки). Сейчас показана краткая сводка по объекту для приоритизации обследований.")
                        .font(.footnote)
                        .foregroundColor(.secondary)
                        .padding(12)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color(.systemGray6))
                        )
                }
                .padding(16)
            }
            .navigationTitle("Водный объект")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

struct WaterObjectInfoRow: View {
    let label: String
    let value: String
    var badgeColor: Color? = nil
    
    var body: some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            Spacer()
            
            if let badgeColor {
                Text(value)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(badgeColor.opacity(0.18))
                    .foregroundColor(badgeColor)
                    .clipShape(Capsule())
            } else {
                Text(value)
                    .font(.subheadline)
                    .foregroundColor(OracleDesign.Colors.primary)
            }
        }
    }
}

// MARK: - Preview

#Preview {
    MapView()
        .environmentObject(SensorStore())
}

import SwiftUI
import MapKit

// Какую карточку показывать снизу
enum EmergencyMapSheet: Identifiable {
    case sensor(Sensor)
    case resident(Resident)
    case evacPoint(EvacuationPoint)
    
    var id: String {
        switch self {
        case .sensor(let s):     return "sensor-\(s.id)"
        case .resident(let r):   return "resident-\(r.id)"
        case .evacPoint(let p):  return "point-\(p.id)"
        }
    }
}

struct EmergencyMapView: View {
    @EnvironmentObject var sensorStore: SensorStore
    
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 54.8656, longitude: 69.1395),
        span: MKCoordinateSpan(latitudeDelta: 0.08, longitudeDelta: 0.08)
    )
    
    @State private var residents: [Resident] = Resident.testResidents
    @State private var evacPoints: [EvacuationPoint] = EvacuationPoint.testPoints
    
    @State private var showRiskZones = true
    @State private var showSensors = true
    @State private var showResidents = false
    @State private var showEvacPoints = false
    @State private var mapType: MKMapType = .standard
    @State private var animateMarkers = false
    
    @State private var activeSheet: EmergencyMapSheet?
    
    // Все датчики: из бэка + зоны + река
    private var sensors: [Sensor] {
        let backend = sensorStore.sensors
        let base = backend.isEmpty ? [] : backend
        return base + SENSORS_FROM_ZONES + RIVER_SENSORS
    }
    
    var body: some View {
        ZStack {
            mapLayer
            
            VStack {
                // Верхняя панель
                topControls
                    .padding(.horizontal)
                    .padding(.top, 8)
                
                Spacer()
                
                // Нижняя панель слоёв
                layerPanel
                    .padding(.horizontal)
                    .padding(.bottom, 12)
            }
        }
        .sheet(item: $activeSheet) { sheet in
            switch sheet {
            case .sensor(let sensor):
                ModernSensorDetailSheet(sensor: sensor)
            case .resident(let resident):
                ResidentOnMapSheet(resident: resident)
            case .evacPoint(let point):
                EvacPointOnMapSheet(point: point)
            }
        }
        .navigationTitle("Карта (МЧС)")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.7)) {
                animateMarkers = true
            }
        }
    }
    
    // MARK: - Map
    
    @ViewBuilder
    private var mapLayer: some View {
        if #available(iOS 17.0, *) {
            Map(position: .constant(.region(region))) {
                // Зоны риска
                if showRiskZones {
                    ForEach(RISK_ZONES) { zone in
                        let polygon = MKPolygon(
                            coordinates: zone.coordinates,
                            count: zone.coordinates.count
                        )
                        MapPolygon(polygon)
                            .foregroundStyle(zone.fillColor)
                    }
                }
                
                // Датчики
                if showSensors {
                    ForEach(sensors) { sensor in
                        Annotation(sensor.name, coordinate: sensor.location) {
                            AnimatedSensorMarker(sensor: sensor, isAnimating: animateMarkers) {
                                activeSheet = .sensor(sensor)
                            }
                        }
                    }
                }
                
                // Жители
                if showResidents {
                    ForEach(residents) { resident in
                        Annotation(resident.name, coordinate: resident.location) {
                            ResidentMarker(resident: resident) {
                                activeSheet = .resident(resident)
                            }
                        }
                    }
                }
                
                // Пункты эвакуации
                if showEvacPoints {
                    ForEach(evacPoints) { point in
                        Annotation(point.name, coordinate: point.location) {
                            EvacPointMarker(point: point) {
                                activeSheet = .evacPoint(point)
                            }
                        }
                    }
                }
            }
            .mapStyle(mapType == .standard ? .standard : .imagery)
            .ignoresSafeArea(edges: .bottom)
        } else {
            // Для iOS < 17 можно позже сделать свой MapRepresentable
            Map(coordinateRegion: $region)
                .ignoresSafeArea(edges: .bottom)
        }
    }
    
    // MARK: - Top controls
    
    private var topControls: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Оперативная карта")
                    .font(.headline)
                Text("Паводки, жители и пункты эвакуации")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Button(action: {
                mapType = mapType == .standard ? .hybridFlyover : .standard
            }) {
                Image(systemName: mapType == .standard ? "globe.europe.africa.fill" : "map.fill")
                    .padding(8)
                    .background(.ultraThinMaterial, in: Circle())
            }
        }
    }
    
    // MARK: - Layer panel
    
    private var layerPanel: some View {
        HStack(spacing: 8) {
            LayerToggleChip(
                title: "Зоны риска",
                systemImage: "exclamationmark.triangle",
                isOn: $showRiskZones,
                activeColor: .red
            )
            LayerToggleChip(
                title: "Датчики",
                systemImage: "antenna.radiowaves.left.and.right",
                isOn: $showSensors,
                activeColor: .blue
            )
            LayerToggleChip(
                title: "Жители",
                systemImage: "person.2.fill",
                isOn: $showResidents,
                activeColor: .green
            )
            LayerToggleChip(
                title: "Эвакуация",
                systemImage: "bus.fill",
                isOn: $showEvacPoints,
                activeColor: .orange
            )
        }
        .padding(10)
        .background(
            .ultraThinMaterial,
            in: RoundedRectangle(cornerRadius: 18, style: .continuous)
        )
        .shadow(color: .black.opacity(0.1), radius: 8, y: 3)
    }
}

// MARK: - Layer toggle chip

struct LayerToggleChip: View {
    let title: String
    let systemImage: String
    @Binding var isOn: Bool
    let activeColor: Color
    
    var body: some View {
        Button(action: { isOn.toggle() }) {
            HStack(spacing: 6) {
                Image(systemName: systemImage)
                    .font(.caption)
                Text(title)
                    .font(.caption2)
                    .fontWeight(.semibold)
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .foregroundColor(isOn ? .white : .primary)
            .background(
                RoundedRectangle(cornerRadius: 14)
                    .fill(isOn ? activeColor : Color(.secondarySystemBackground))
            )
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Маркеры

struct ResidentMarker: View {
    let resident: Resident
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 2) {
                Text(riskIcon)
                    .font(.subheadline)
                Image(systemName: "house.fill")
                    .font(.caption)
            }
            .padding(6)
            .background(riskColor.opacity(0.9))
            .clipShape(Circle())
            .shadow(radius: 4)
        }
        .buttonStyle(.plain)
    }
    
    private var riskColor: Color {
        switch resident.riskZone {
        case .critical: return .red
        case .high:     return .orange
        case .medium:   return .yellow
        case .low:      return .green
        }
    }
    
    private var riskIcon: String {
        switch resident.riskZone {
        case .critical: return "‼️"
        case .high:     return "⚠️"
        case .medium:   return "🟡"
        case .low:      return "🟢"
        }
    }
}

struct EvacPointMarker: View {
    let point: EvacuationPoint
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 2) {
                Image(systemName: "bus.fill")
                    .font(.caption)
                Text(point.name.prefix(1))
                    .font(.caption2)
            }
            .padding(6)
            .background(Color.blue.opacity(0.9))
            .clipShape(Circle())
            .shadow(radius: 4)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Детальные шторки

struct ResidentOnMapSheet: View {
    let resident: Resident
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 12) {
                Text(resident.name)
                    .font(.title2)
                    .fontWeight(.bold)
                
                Text("Зона риска: \(riskTitle)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                Text("Адрес: \(resident.address)")
                    .font(.subheadline)
                
                Spacer()
            }
            .padding()
            .navigationTitle("Житель")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Закрыть") { dismiss() }
                }
            }
        }
    }
    
    private var riskTitle: String {
        switch resident.riskZone {
        case .critical: return "Критическая"
        case .high:     return "Высокая"
        case .medium:   return "Средняя"
        case .low:      return "Низкая"
        }
    }
}

struct EvacPointOnMapSheet: View {
    let point: EvacuationPoint
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 12) {
                Text(point.name)
                    .font(.title2)
                    .fontWeight(.bold)
                
                Text(point.address)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                Spacer()
            }
            .padding()
            .navigationTitle("Пункт эвакуации")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Закрыть") { dismiss() }
                }
            }
        }
    }
}

#Preview {
    EmergencyMapView()
        .environmentObject(SensorStore())
}

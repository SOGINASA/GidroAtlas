import SwiftUI
import MapKit

struct EmergencyMapView: View {
    @EnvironmentObject var waterStore: WaterObjectStore

    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 48.0, longitude: 68.0),
        span: MKCoordinateSpan(latitudeDelta: 15.0, longitudeDelta: 20.0)
    )

    @State private var selectedObject: WaterObject? = nil

    /// Критические объекты: состояние 4–5 или высокий PriorityScore
    private var criticalObjects: [WaterObject] {
        waterStore.objects
            .filter { $0.technicalCondition >= 4 || $0.priorityLevel == .high }
            .sorted {
                if $0.technicalCondition == $1.technicalCondition {
                    return $0.priorityScore > $1.priorityScore
                }
                return $0.technicalCondition > $1.technicalCondition
            }
    }

    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(
                    colors: [
                        Color(red: 0.99, green: 0.93, blue: 0.93),
                        Color(red: 0.96, green: 0.88, blue: 0.88)
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()

                VStack(spacing: 12) {
                    header

                    mapSection

                    listSection
                }
                .padding(.horizontal, 12)
                .padding(.top, 8)
            }
            .navigationBarHidden(true)
            .sheet(item: $selectedObject) { obj in
                EmergencyWaterObjectDetailView(object: obj)
            }
        }
    }

    // MARK: - Подвьюхи

    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Критические объекты")
                    .font(.system(size: 24, weight: .bold, design: .rounded))
                    .foregroundColor(.red)

                Text("Мониторинг водных объектов с высоким риском")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                Text("Экстренный режим")
                    .font(.caption)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(
                        Capsule()
                            .fill(Color.red.opacity(0.1))
                    )
                    .foregroundColor(.red)
            }
        }
    }

    private var mapSection: some View {
        ZStack(alignment: .bottomLeading) {
            Map(coordinateRegion: $region, annotationItems: criticalObjects) { obj in
                MapAnnotation(coordinate: obj.coordinate) {
                    Button {
                        selectedObject = obj
                    } label: {
                        EmergencyMarkerView(object: obj)
                    }
                }
            }
            .cornerRadius(18)
            .frame(height: 260)
            .shadow(color: Color.black.opacity(0.15), radius: 10, x: 0, y: 4)

            VStack(alignment: .leading, spacing: 4) {
                Text("Критических объектов: \(criticalObjects.count)")
                    .font(.caption)
                    .foregroundColor(.secondary)

                Text("Показаны категория 4–5 и высокий приоритет")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            .padding(10)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.white.opacity(0.9))
            )
            .padding(10)
        }
    }

    private var listSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Список критических объектов")
                .font(.headline)
                .foregroundColor(.red)

            ScrollView {
                LazyVStack(spacing: 8) {
                    ForEach(criticalObjects) { obj in
                        Button {
                            selectedObject = obj
                        } label: {
                            EmergencyRow(object: obj)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
            }
            .frame(maxHeight: 260)
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 18)
                .fill(Color.white)
                .shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 3)
        )
    }
}

// MARK: - Маркер на карте для emergency

private struct EmergencyMarkerView: View {
    let object: WaterObject

    private var color: Color {
        switch object.technicalCondition {
        case 4: return .orange
        default: return .red
        }
    }

    var body: some View {
        VStack(spacing: 2) {
            Text("\(object.technicalCondition)")
                .font(.caption2)
                .fontWeight(.bold)
                .foregroundColor(.white)
                .frame(width: 26, height: 26)
                .background(
                    Circle()
                        .fill(color)
                )
                .shadow(color: color.opacity(0.6), radius: 4, x: 0, y: 2)

            Image(systemName: "triangle.fill")
                .font(.system(size: 10))
                .rotationEffect(.degrees(180))
                .foregroundColor(color)
        }
    }
}

// MARK: - Ряд списка в emergency

private struct EmergencyRow: View {
    let object: WaterObject

    private var conditionColor: Color {
        switch object.technicalCondition {
        case 4: return .orange
        default: return .red
        }
    }

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            RoundedRectangle(cornerRadius: 10)
                .fill(conditionColor.opacity(0.15))
                .frame(width: 40, height: 40)
                .overlay(
                    Text("\(object.technicalCondition)")
                        .font(.headline)
                        .foregroundColor(conditionColor)
                )

            VStack(alignment: .leading, spacing: 4) {
                Text(object.name)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.primary)
                    .lineLimit(2)

                Text(object.region)
                    .font(.caption)
                    .foregroundColor(.secondary)

                HStack(spacing: 8) {
                    Text(object.resourceType.rawValue)
                        .font(.caption2)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Color.red.opacity(0.05))
                        .cornerRadius(8)

                    Text(object.waterType.rawValue)
                        .font(.caption2)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Color.orange.opacity(0.05))
                        .cornerRadius(8)
                }

                HStack(spacing: 8) {
                    Text("Паспорт: \(object.formattedPassportDate)")
                        .font(.caption2)
                        .foregroundColor(.secondary)

                    Spacer()

                    Text("Priority: \(object.priorityScore)")
                        .font(.caption2)
                        .fontWeight(.semibold)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Color.red.opacity(0.08))
                        .foregroundColor(.red)
                        .cornerRadius(8)
                }
            }
        }
        .padding(10)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white)
        )
        .shadow(color: Color.black.opacity(0.03), radius: 2, x: 0, y: 1)
    }
}

// MARK: - Деталка для emergency

private struct EmergencyWaterObjectDetailView: View {
    let object: WaterObject

    private var conditionColor: Color {
        switch object.technicalCondition {
        case 4: return .orange
        default: return .red
        }
    }

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text(object.name)
                        .font(.title2)
                        .fontWeight(.bold)

                    Text(object.region)
                        .font(.subheadline)
                        .foregroundColor(.secondary)

                    HStack(spacing: 8) {
                        Label(object.resourceType.rawValue, systemImage: "exclamationmark.triangle.fill")
                            .font(.caption)
                            .padding(8)
                            .background(Color.red.opacity(0.08))
                            .cornerRadius(10)

                        Label(object.waterType.rawValue, systemImage: "water.waves")
                            .font(.caption)
                            .padding(8)
                            .background(Color.orange.opacity(0.08))
                            .cornerRadius(10)

                        if object.hasFauna {
                            Label("Есть фауна", systemImage: "fish.fill")
                                .font(.caption)
                                .padding(8)
                                .background(Color.green.opacity(0.08))
                                .cornerRadius(10)
                        }
                    }

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Техническое состояние")
                            .font(.headline)

                        HStack(spacing: 8) {
                            Text("Категория: \(object.technicalCondition)")
                                .font(.subheadline)
                            Circle()
                                .fill(conditionColor)
                                .frame(width: 10, height: 10)
                        }

                        Text("Дата паспорта: \(object.formattedPassportDate)")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Приоритет обследования")
                            .font(.headline)

                        HStack(spacing: 8) {
                            Text("PriorityScore: \(object.priorityScore)")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                        }
                    }

                    if let url = object.passportURL {
                        Link(destination: url) {
                            HStack {
                                Image(systemName: "doc.richtext")
                                Text("Открыть паспорт (PDF)")
                            }
                            .font(.subheadline)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.red.opacity(0.1))
                            .cornerRadius(12)
                        }
                    } else {
                        Text("Паспорт объекта пока недоступен.")
                            .font(.footnote)
                            .foregroundColor(.secondary)
                    }

                    Spacer(minLength: 10)
                }
                .padding()
            }
            .navigationTitle("Критический объект")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

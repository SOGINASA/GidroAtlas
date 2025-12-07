import SwiftUI

struct AdminMapView: View {
    @EnvironmentObject var sensorStore: SensorStore
    @State private var showFilters = true
    
    var body: some View {
        ZStack(alignment: .top) {
            MapView() // твоя основная карта с зонами риска и сенсорами
            
            if showFilters {
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("Карта объектов")
                            .font(.headline)
                        Spacer()
                        Button(action: { showFilters.toggle() }) {
                            Image(systemName: "xmark.circle.fill")
                                .font(.headline)
                        }
                    }
                    
                    Text("Режим администратора: используется общая карта, данные только для просмотра. В будущем сюда можно повесить редактирование зон и объектов.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(12)
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color(.systemBackground).opacity(0.95))
                        .shadow(color: .black.opacity(0.15), radius: 8, x: 0, y: 4)
                )
                .padding()
            } else {
                VStack {
                    HStack {
                        Spacer()
                        Button(action: { showFilters.toggle() }) {
                            HStack(spacing: 6) {
                                Image(systemName: "slider.horizontal.3")
                                Text("Панель")
                            }
                            .padding(8)
                            .background(Color(.systemBackground).opacity(0.95))
                            .cornerRadius(14)
                            .shadow(color: .black.opacity(0.15), radius: 6, x: 0, y: 3)
                        }
                    }
                    .padding()
                    Spacer()
                }
            }
        }
        .navigationTitle("Карта")
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    AdminMapView()
        .environmentObject(SensorStore())
}

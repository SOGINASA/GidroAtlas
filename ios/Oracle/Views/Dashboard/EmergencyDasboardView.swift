import SwiftUI

struct EmergencyDashboardView: View {
    @State private var residents = Resident.testResidents
    @State private var evacuations = Evacuation.testEvacuations
    @State private var stats = EmergencyStats.testStats
    @State private var selectedResident: Resident?
    @State private var showEvacuationForm = false
    @State private var animateCards = false
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Header МЧС
                emergencyHeader
                
                // Статистика
                statsGrid
                
                // Критические зоны
                criticalZonesSection
                
                // Активные эвакуации
                activeEvacuationsSection
                
                // Жители в зонах риска
                residentsSection
            }
            .padding()
            .padding(.bottom, 80)
        }
        .background(
            LinearGradient(
                colors: [
                    Color(red: 1.0, green: 0.95, blue: 0.95),
                    Color(red: 0.98, green: 0.92, blue: 0.90)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
        )
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.7)) {
                animateCards = true
            }
        }
        .sheet(isPresented: $showEvacuationForm) {
            if let resident = selectedResident {
                EvacuationFormSheet(resident: resident) {
                    // Обновить данные
                    showEvacuationForm = false
                }
            }
        }
    }
    
    // MARK: - Header МЧС
    private var emergencyHeader: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 8) {
                    Image(systemName: "flame.fill")
                        .font(.title2)
                        .foregroundColor(.red)
                    
                    Text("МЧС GidroAtlas")
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundColor(.red)
                }
                
                Text("Управление эвакуацией")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            // Статус дежурства
            HStack(spacing: 8) {
                Circle()
                    .fill(Color.green)
                    .frame(width: 8, height: 8)
                
                Text("На дежурстве")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(.green)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(Color.green.opacity(0.1))
            .cornerRadius(20)
        }
        .padding()
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .red.opacity(0.1), radius: 10, y: 5)
    }
    
    // MARK: - Статистика
    private var statsGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            EmergencyStatCard(
                title: "Всего жителей",
                value: "\(stats.totalResidents)",
                icon: "person.3.fill",
                gradient: [.blue, .cyan],
                isAnimating: animateCards
            )
            
            EmergencyStatCard(
                title: "Активные",
                value: "\(stats.activeEvacuations)",
                icon: "figure.run",
                gradient: [.orange, .red],
                isAnimating: animateCards
            )
            
            EmergencyStatCard(
                title: "Завершено",
                value: "\(stats.completedEvacuations)",
                icon: "checkmark.circle.fill",
                gradient: [.green, .green.opacity(0.7)],
                isAnimating: animateCards
            )
            
            EmergencyStatCard(
                title: "Ожидают",
                value: "\(stats.pendingEvacuations)",
                icon: "clock.fill",
                gradient: [.yellow, .orange],
                isAnimating: animateCards
            )
        }
    }
    
    // MARK: - Критические зоны
    private var criticalZonesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "exclamationmark.triangle.fill")
                    .foregroundColor(.red)
                
                Text("Критические зоны")
                    .font(.headline)
                    .fontWeight(.bold)
                
                Spacer()
                
                Text("\(stats.criticalZoneResidents)")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.red)
            }
            
            let criticalResidents = residents.filter { $0.riskZone == .critical }
            
            if criticalResidents.isEmpty {
                Text("Нет жителей в критических зонах")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity)
                    .padding()
            } else {
                ForEach(criticalResidents) { resident in
                    CriticalResidentCard(resident: resident) {
                        selectedResident = resident
                        showEvacuationForm = true
                    }
                }
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 10, y: 5)
    }
    
    // MARK: - Активные эвакуации
    private var activeEvacuationsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "car.fill")
                    .foregroundColor(.orange)
                
                Text("Активные эвакуации")
                    .font(.headline)
                    .fontWeight(.bold)
                
                Spacer()
            }
            
            let activeEvacs = evacuations.filter { $0.status == .inProgress }
            
            if activeEvacs.isEmpty {
                Text("Нет активных эвакуаций")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity)
                    .padding()
            } else {
                ForEach(activeEvacs) { evacuation in
                    ActiveEvacuationCard(evacuation: evacuation)
                }
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 10, y: 5)
    }
    
    // MARK: - Все жители
    private var residentsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "list.bullet")
                    .foregroundColor(.blue)
                
                Text("Все жители")
                    .font(.headline)
                    .fontWeight(.bold)
                
                Spacer()
                
                Button(action: {}) {
                    Image(systemName: "arrow.up.arrow.down")
                        .foregroundColor(.blue)
                }
            }
            
            ForEach(residents) { resident in
                ResidentListCard(resident: resident) {
                    selectedResident = resident
                    showEvacuationForm = true
                }
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 10, y: 5)
    }
}

// MARK: - Emergency Stat Card
struct EmergencyStatCard: View {
    let title: String
    let value: String
    let icon: String
    let gradient: [Color]
    let isAnimating: Bool
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.white)
            
            Spacer()
            
            Text(value)
                .font(.system(size: 32, weight: .bold))
                .foregroundColor(.white)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.white.opacity(0.9))
        }
        .frame(height: 120)
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(
            LinearGradient(
                colors: gradient,
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(16)
        .shadow(color: gradient[0].opacity(0.3), radius: 8, y: 4)
        .scaleEffect(isAnimating ? 1.0 : 0.95)
        .animation(.spring(response: 0.6, dampingFraction: 0.7), value: isAnimating)
    }
}

// MARK: - Critical Resident Card
struct CriticalResidentCard: View {
    let resident: Resident
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                // Иконка
                ZStack {
                    Circle()
                        .fill(Color.red.opacity(0.2))
                        .frame(width: 50, height: 50)
                    
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundColor(.red)
                        .font(.title3)
                }
                
                // Информация
                VStack(alignment: .leading, spacing: 4) {
                    Text(resident.name)
                        .font(.headline)
                        .foregroundColor(.primary)
                    
                    Text(resident.address)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(1)
                    
                    HStack(spacing: 8) {
                        StatusBadge(status: resident.status)
                        
                        Text(resident.phone)
                            .font(.caption2)
                            .foregroundColor(.blue)
                    }
                }
                
                Spacer()
                
                // Кнопка эвакуации
                Image(systemName: "chevron.right")
                    .foregroundColor(.gray)
            }
            .padding()
            .background(Color.red.opacity(0.05))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.red.opacity(0.3), lineWidth: 1)
            )
        }
    }
}

// MARK: - Active Evacuation Card
struct ActiveEvacuationCard: View {
    let evacuation: Evacuation
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(evacuation.residentName)
                    .font(.headline)
                
                Spacer()
                
                StatusBadge(status: evacuation.status)
            }
            
            HStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 4) {
                    Label(evacuation.address, systemImage: "mappin.circle.fill")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Label(evacuation.assignedBrigade, systemImage: "person.2.fill")
                        .font(.caption)
                        .foregroundColor(.blue)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    Text("Начало:")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    
                    Text(evacuation.startTime)
                        .font(.caption)
                        .fontWeight(.semibold)
                }
            }
            
            // Прогресс бар
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color.gray.opacity(0.2))
                    
                    RoundedRectangle(cornerRadius: 4)
                        .fill(
                            LinearGradient(
                                colors: [.orange, .red],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: geometry.size.width * 0.6) // 60% выполнено
                }
            }
            .frame(height: 6)
        }
        .padding()
        .background(Color.orange.opacity(0.05))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.orange.opacity(0.3), lineWidth: 1)
        )
    }
}

// MARK: - Resident List Card
struct ResidentListCard: View {
    let resident: Resident
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                // Зона риска
                ZStack {
                    Circle()
                        .fill(riskZoneColor.opacity(0.2))
                        .frame(width: 40, height: 40)
                    
                    Text(riskZoneIcon)
                        .font(.title3)
                }
                
                // Информация
                VStack(alignment: .leading, spacing: 4) {
                    Text(resident.name)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                    
                    Text(resident.address)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(1)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    StatusBadge(status: resident.status)
                    
                    Text(resident.riskZone.rawValue)
                        .font(.caption2)
                        .foregroundColor(riskZoneColor)
                }
            }
            .padding()
            .background(Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.gray.opacity(0.2), lineWidth: 1)
            )
        }
    }
    
    private var riskZoneColor: Color {
        switch resident.riskZone {
        case .critical: return .red
        case .high: return .orange
        case .medium: return .yellow
        case .low: return .green
        }
    }
    
    private var riskZoneIcon: String {
        switch resident.riskZone {
        case .critical: return "⚠️"
        case .high: return "🔶"
        case .medium: return "⚡️"
        case .low: return "✅"
        }
    }
}

// MARK: - Status Badge
struct StatusBadge: View {
    let status: Resident.EvacuationStatus
    
    var body: some View {
        Text(status.rawValue)
            .font(.caption2)
            .fontWeight(.semibold)
            .foregroundColor(statusColor)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(statusColor.opacity(0.15))
            .cornerRadius(8)
    }
    
    private var statusColor: Color {
        switch status {
        case .completed: return .green
        case .inProgress: return .blue
        case .assigned: return .yellow
        case .pending: return .gray
        case .refused: return .red
        }
    }
}

// MARK: - Evacuation Form Sheet
struct EvacuationFormSheet: View {
    let resident: Resident
    let onComplete: () -> Void
    @Environment(\.dismiss) var dismiss
    @State private var selectedBrigade = "Бригада #1"
    @State private var selectedPoint = "Школа №7"
    @State private var notes = ""
    
    let brigades = ["Бригада #1", "Бригада #2", "Бригада #3", "Бригада #4"]
    let points = ["Школа №7", "Спорткомплекс Олимп", "ДК Юность"]
    
    var body: some View {
        NavigationView {
            Form {
                Section("Житель") {
                    Text(resident.name)
                        .font(.headline)
                    Text(resident.address)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    Text(resident.phone)
                        .font(.subheadline)
                        .foregroundColor(.blue)
                }
                
                Section("Назначение") {
                    Picker("Бригада", selection: $selectedBrigade) {
                        ForEach(brigades, id: \.self) { brigade in
                            Text(brigade).tag(brigade)
                        }
                    }
                    
                    Picker("Пункт эвакуации", selection: $selectedPoint) {
                        ForEach(points, id: \.self) { point in
                            Text(point).tag(point)
                        }
                    }
                }
                
                Section("Примечания") {
                    TextEditor(text: $notes)
                        .frame(height: 100)
                }
            }
            .navigationTitle("Начать эвакуацию")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Отмена") { dismiss() }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Начать") {
                        onComplete()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }
}

#Preview {
    EmergencyDashboardView()
}

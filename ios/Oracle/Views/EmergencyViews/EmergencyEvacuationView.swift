import SwiftUI
import MapKit

// MARK: - Фильтр по статусу

private enum EvacuationFilter: String, CaseIterable, Identifiable {
    case all
    case pending
    case assigned
    case inProgress
    case completed
    case refused
    
    var id: String { rawValue }
    
    var title: String {
        switch self {
        case .all:        return "Все"
        case .pending:    return "Ожидают"
        case .assigned:   return "Назначено"
        case .inProgress: return "В процессе"
        case .completed:  return "Завершено"
        case .refused:    return "Отказались"
        }
    }
    
    var status: Resident.EvacuationStatus? {
        switch self {
        case .all:        return nil
        case .pending:    return .pending
        case .assigned:   return .assigned
        case .inProgress: return .inProgress
        case .completed:  return .completed
        case .refused:    return .refused
        }
    }
}

// MARK: - Основной экран

struct EmergencyEvacuationView: View {
    @State private var evacuations: [Evacuation] = Evacuation.testEvacuations
    @State private var residents: [Resident] = Resident.testResidents
    @State private var evacPoints: [EvacuationPoint] = EvacuationPoint.testPoints
    
    @State private var selectedFilter: EvacuationFilter = .all
    @State private var searchText: String = ""
    @State private var activeSheet: Evacuation?
    
    @State private var animateCards = false
    
    // Отфильтрованный список
    private var filteredEvacuations: [Evacuation] {
        evacuations.filter { evac in
            // фильтр по статусу
            if let status = selectedFilter.status, evac.status != status {
                return false
            }
            // фильтр по поиску
            if searchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                return true
            }
            let query = searchText.lowercased()
            return evac.residentName.lowercased().contains(query)
                || evac.address.lowercased().contains(query)
                || evac.assignedBrigade.lowercased().contains(query)
                || evac.evacuationPoint.lowercased().contains(query)
        }
    }
    
    // Статистика по статусам
    private var stats: (pending: Int, assigned: Int, inProgress: Int, completed: Int, refused: Int) {
        var pending = 0, assigned = 0, inProgress = 0, completed = 0, refused = 0
        for evac in evacuations {
            switch evac.status {
            case .pending:    pending += 1
            case .assigned:   assigned += 1
            case .inProgress: inProgress += 1
            case .completed:  completed += 1
            case .refused:    refused += 1
            }
        }
        return (pending, assigned, inProgress, completed, refused)
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(
                    colors: [
                        Color(red: 1.0, green: 0.96, blue: 0.95),
                        Color(red: 0.98, green: 0.92, blue: 0.90)
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 18) {
                        header
                        statsRow
                        filterChips
                        searchField
                        
                        if filteredEvacuations.isEmpty {
                            emptyState
                        } else {
                            ForEach(filteredEvacuations) { evac in
                                EvacuationListCard(
                                    evacuation: evac,
                                    resident: residents.first(where: { $0.id == evac.residentId }),
                                    onTap: {
                                        activeSheet = evac
                                    }
                                )
                                .scaleEffect(animateCards ? 1.0 : 0.97)
                                .animation(
                                    .spring(response: 0.6, dampingFraction: 0.8)
                                        .delay(0.03 * Double(filteredEvacuations.firstIndex(where: { $0.id == evac.id }) ?? 0)),
                                    value: animateCards
                                )
                            }
                        }
                        
                        Spacer(minLength: 40)
                    }
                    .padding()
                }
            }
            .navigationBarHidden(true)
            .onAppear {
                withAnimation {
                    animateCards = true
                }
            }
            .sheet(item: $activeSheet) { evac in
                EvacuationEditSheet(
                    evacuation: evac,
                    points: evacPoints,
                    onSave: { updated in
                        updateEvacuation(updated)
                    }
                )
            }
        }
    }
    
    // MARK: - UI куски
    
    private var header: some View {
        HStack {
            HStack(spacing: 10) {
                ZStack {
                    Circle()
                        .fill(Color.red.opacity(0.15))
                        .frame(width: 40, height: 40)
                    Image(systemName: "figure.run")
                        .foregroundColor(.red)
                        .font(.system(size: 20, weight: .bold))
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("Эвакуация жителей")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.red)
                    
                    Text("Управление бригадами и статусами")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            Spacer()
            
            VStack(alignment: .trailing, spacing: 4) {
                Text("\(evacuations.count)")
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                Text("записей")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            .padding(10)
            .background(Color.white)
            .cornerRadius(12)
            .shadow(color: .black.opacity(0.06), radius: 6, y: 3)
        }
        .padding()
        .background(Color.white)
        .cornerRadius(18)
        .shadow(color: .red.opacity(0.08), radius: 10, y: 5)
    }
    
    private var statsRow: some View {
        let s = stats
        
        return VStack(alignment: .leading, spacing: 10) {
            Text("Состояние эвакуации")
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(.primary)
            
            HStack(spacing: 12) {
                StatusMiniCard(
                    title: "Ожидают",
                    value: s.pending,
                    color: .gray,
                    icon: "clock.fill"
                )
                StatusMiniCard(
                    title: "Назначено",
                    value: s.assigned,
                    color: .yellow,
                    icon: "person.2.fill"
                )
                StatusMiniCard(
                    title: "В пути",
                    value: s.inProgress,
                    color: .blue,
                    icon: "car.fill"
                )
                StatusMiniCard(
                    title: "Завершено",
                    value: s.completed,
                    color: .green,
                    icon: "checkmark.circle.fill"
                )
            }
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(.ultraThinMaterial)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .stroke(Color.black.opacity(0.04), lineWidth: 1)
        )
    }

    
    private var filterChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(EvacuationFilter.allCases) { filter in
                    EvacuationFilterChip(
                        filter: filter,
                        isSelected: filter == selectedFilter
                    ) {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            selectedFilter = filter
                        }
                    }
                }
            }
            .padding(.horizontal, 2)
        }
    }
    
    private var searchField: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.secondary)
            TextField("Поиск по ФИО, адресу, бригаде…", text: $searchText)
                .textFieldStyle(.plain)
        }
        .padding(10)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.05), radius: 6, y: 3)
        )
    }
    
    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "checkmark.seal")
                .font(.system(size: 40))
                .foregroundColor(.green)
            
            Text("По выбранным фильтрам эвакуаций нет")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 40)
    }
    
    // MARK: - Обновление данных
    
    private func updateEvacuation(_ updated: Evacuation) {
        if let index = evacuations.firstIndex(where: { $0.id == updated.id }) {
            evacuations[index] = updated
        }
    }
}

// MARK: - Маленькие карточки статусов

private struct StatusMiniCard: View {
    let title: String
    let value: Int
    let color: Color
    let icon: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            // Иконка в кружке
            ZStack {
                Circle()
                    .fill(color.opacity(0.18))
                    .frame(width: 26, height: 26)
                Image(systemName: icon)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(color)
            }
            
            // Число
            Text("\(value)")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundColor(.primary)
                .minimumScaleFactor(0.7)
            
            // Подпись
            Text(title)
                .font(.caption2)
                .foregroundColor(.secondary)
                .lineLimit(1)
            
            // Тонкая цветная полоска внизу вместо жёсткой рамки
            Capsule()
                .fill(
                    LinearGradient(
                        colors: [color, color.opacity(0.6)],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .frame(height: 3)
                .padding(.top, 2)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}


// MARK: - Чип фильтра

private struct EvacuationFilterChip: View {
    let filter: EvacuationFilter
    let isSelected: Bool
    let action: () -> Void
    
    private var color: Color {
        switch filter {
        case .all:        return .gray
        case .pending:    return .gray
        case .assigned:   return .yellow
        case .inProgress: return .blue
        case .completed:  return .green
        case .refused:    return .red
        }
    }
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Text(filter.title)
                    .font(.caption)
                    .fontWeight(.semibold)
                if isSelected {
                    Image(systemName: "checkmark")
                        .font(.caption2)
                }
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(
                Capsule()
                    .fill(isSelected ? color.opacity(0.18) : Color.white)
            )
            .overlay(
                Capsule()
                    .stroke(color.opacity(isSelected ? 0.8 : 0.3), lineWidth: 1)
            )
            .foregroundColor(isSelected ? color : .secondary)
        }
    }
}

// MARK: - Карточка эвакуации

private struct EvacuationListCard: View {
    let evacuation: Evacuation
    let resident: Resident?
    let onTap: () -> Void
    
    private var statusColor: Color {
        switch evacuation.status {
        case .completed:  return .green
        case .inProgress: return .blue
        case .assigned:   return .yellow
        case .pending:    return .gray
        case .refused:    return .red
        }
    }
    
    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 10) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(evacuation.residentName)
                            .font(.headline)
                            .foregroundColor(.primary)
                        
                        if let resident = resident {
                            Text(resident.phone)
                                .font(.caption)
                                .foregroundColor(.blue)
                        }
                    }
                    
                    Spacer()
                    
                    StatusBadge(status: evacuation.status) // уже есть в Dashboard
                }
                
                HStack(alignment: .top, spacing: 12) {
                    VStack(alignment: .leading, spacing: 4) {
                        Label(evacuation.address, systemImage: "mappin.circle.fill")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .lineLimit(2)
                        
                        Label(evacuation.evacuationPoint, systemImage: "building.2.fill")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing, spacing: 4) {
                        Label(evacuation.assignedBrigade, systemImage: "person.3.fill")
                            .font(.caption)
                            .foregroundColor(.blue)
                        
                        HStack(spacing: 6) {
                            if evacuation.startTime != "-" {
                                Text(evacuation.startTime)
                            }
                            if let end = evacuation.endTime {
                                Text("→ \(end)")
                            }
                        }
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    }
                }
            }
            .padding(14)
            .background(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(Color.white)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .stroke(statusColor.opacity(0.35), lineWidth: 1)
            )
            .shadow(color: .black.opacity(0.05), radius: 8, y: 3)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Экран редактирования одной эвакуации

private struct EvacuationEditSheet: View {
    let evacuation: Evacuation
    let points: [EvacuationPoint]
    let onSave: (Evacuation) -> Void
    
    @Environment(\.dismiss) private var dismiss
    
    @State private var status: Resident.EvacuationStatus
    @State private var brigade: String
    @State private var pointName: String
    @State private var startTime: String
    @State private var endTime: String
    @State private var notes: String
    
    private let brigades = ["Бригада #1", "Бригада #2", "Бригада #3", "Бригада #4"]
    
    init(evacuation: Evacuation,
         points: [EvacuationPoint],
         onSave: @escaping (Evacuation) -> Void) {
        self.evacuation = evacuation
        self.points = points
        self.onSave = onSave
        
        _status    = State(initialValue: evacuation.status)
        _brigade   = State(initialValue: evacuation.assignedBrigade)
        _pointName = State(initialValue: evacuation.evacuationPoint)
        _startTime = State(initialValue: evacuation.startTime)
        _endTime   = State(initialValue: evacuation.endTime ?? "")
        _notes     = State(initialValue: evacuation.notes ?? "")
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section("Житель") {
                    Text(evacuation.residentName)
                    Text(evacuation.address)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Section("Статус") {
                    Picker("Статус", selection: $status) {
                        Text("Ожидает").tag(Resident.EvacuationStatus.pending)
                        Text("Назначено").tag(Resident.EvacuationStatus.assigned)
                        Text("В процессе").tag(Resident.EvacuationStatus.inProgress)
                        Text("Завершено").tag(Resident.EvacuationStatus.completed)
                        Text("Отказался").tag(Resident.EvacuationStatus.refused)
                    }
                    .pickerStyle(.menu)
                }
                
                Section("Бригада и пункт") {
                    Picker("Бригада", selection: $brigade) {
                        ForEach(brigades, id: \.self) { b in
                            Text(b).tag(b)
                        }
                    }
                    
                    Picker("Пункт эвакуации", selection: $pointName) {
                        ForEach(points) { point in
                            Text(point.name).tag(point.name)
                        }
                    }
                }
                
                Section("Время") {
                    TextField("Начало (например, 15:30)", text: $startTime)
                    TextField("Окончание", text: $endTime)
                }
                
                Section("Примечания") {
                    TextEditor(text: $notes)
                        .frame(minHeight: 80)
                }
            }
            .navigationTitle("Эвакуация")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Отмена") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Сохранить") {
                        var updated = evacuation
                        updated.status = status
                        updated.assignedBrigade = brigade
                        updated.evacuationPoint = pointName
                        updated.startTime = startTime
                        updated.endTime = endTime.isEmpty ? nil : endTime
                        updated.notes = notes.isEmpty ? nil : notes
                        onSave(updated)
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
    }
}

// --- превью ---

#Preview {
    EmergencyEvacuationView()
}

import SwiftUI

struct AdminObjectsView: View {
    @State private var searchText: String = ""
    @State private var selectedType: AdminWaterObjectKind? = nil
    @State private var selectedRegion: String? = nil
    @State private var showAddSheet = false
    @State private var editingObject: AdminWaterObject? = nil
    
    @State private var objects: [AdminWaterObject] = AdminWaterObject.mock
    
    private var filteredObjects: [AdminWaterObject] {
        objects.filter { obj in
            let matchesSearch = searchText.isEmpty ||
                obj.name.lowercased().contains(searchText.lowercased())
            
            let matchesType = selectedType == nil || obj.kind == selectedType
            let matchesRegion = selectedRegion == nil || obj.region == selectedRegion
            
            return matchesSearch && matchesType && matchesRegion
        }
    }
    
    private var regions: [String] {
        Array(Set(objects.map { $0.region })).sorted()
    }
    
    var body: some View {
        VStack(spacing: 12) {
            filters
            
            if filteredObjects.isEmpty {
                emptyState
            } else {
                List {
                    ForEach(filteredObjects) { object in
                        AdminWaterObjectRow(
                            object: object,
                            onEdit: { editingObject = object },
                            onDelete: {
                                if let index = objects.firstIndex(where: { $0.id == object.id }) {
                                    objects.remove(at: index)
                                }
                            }
                        )
                    }
                }
                .listStyle(.plain)
            }
        }
        .navigationTitle("Объекты")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button(action: { showAddSheet = true }) {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(isPresented: $showAddSheet) {
            EditAdminWaterObjectView(
                title: "Новый объект",
                object: nil
            ) { newObject in
                objects.append(newObject)
            }
        }
        .sheet(item: $editingObject) { object in
            EditAdminWaterObjectView(
                title: "Редактирование",
                object: object
            ) { updated in
                if let idx = objects.firstIndex(where: { $0.id == updated.id }) {
                    objects[idx] = updated
                }
            }
        }
        .padding(.top, 4)
    }
    
    // MARK: - Filters
    
    private var filters: some View {
        VStack(spacing: 8) {
            HStack(spacing: 8) {
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.secondary)
                    TextField("Поиск по названию", text: $searchText)
                        .textInputAutocapitalization(.never)
                }
                .padding(8)
                .background(Color(.secondarySystemBackground))
                .cornerRadius(10)
            }
            .padding(.horizontal)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    // Тип объекта
                    Menu {
                        Button("Все типы") {
                            selectedType = nil
                        }
                        Divider()
                        ForEach(AdminWaterObjectKind.allCases, id: \.self) { type in
                            Button(type.title) {
                                selectedType = type
                            }
                        }
                    } label: {
                        AdminFilterChip(
                            title: selectedType?.title ?? "Тип",
                            isActive: selectedType != nil,
                            icon: "drop.circle"
                        )
                    }
                    
                    // Область
                    Menu {
                        Button("Все области") {
                            selectedRegion = nil
                        }
                        Divider()
                        ForEach(regions, id: \.self) { region in
                            Button(region) {
                                selectedRegion = region
                            }
                        }
                    } label: {
                        AdminFilterChip(
                            title: selectedRegion ?? "Область",
                            isActive: selectedRegion != nil,
                            icon: "mappin.circle"
                        )
                    }
                    
                    // Сброс
                    Button(action: {
                        searchText = ""
                        selectedType = nil
                        selectedRegion = nil
                    }) {
                        AdminFilterChip(
                            title: "Сбросить",
                            isActive: false,
                            icon: "arrow.counterclockwise"
                        )
                    }
                }
                .padding(.horizontal)
            }
        }
    }
    
    // MARK: - Empty state
    
    private var emptyState: some View {
        VStack(spacing: 16) {
            Spacer()
            Image(systemName: "drop.triangle")
                .font(.system(size: 50))
                .foregroundColor(Color(red: 0.84, green: 0.30, blue: 0.70))
            Text("Объекты не найдены")
                .font(.headline)
            Text("Добавьте первый водный объект, чтобы начать работу с GidroAtlas.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            Spacer()
        }
    }
}

// MARK: - Models (админские, чтобы не конфликтовали с остальными)

enum AdminWaterObjectKind: String, CaseIterable, Codable {
    case lake
    case reservoir
    case canal
    
    var title: String {
        switch self {
        case .lake: return "Озеро"
        case .reservoir: return "Водохранилище"
        case .canal: return "Канал"
        }
    }
}

struct AdminWaterObject: Identifiable, Codable, Hashable {
    let id: UUID
    var name: String
    var region: String
    var kind: AdminWaterObjectKind
    var waterType: String // "Пресная"/"Непресная"
    var hasFauna: Bool
    var technicalState: Int // 1–5
    var latitude: Double
    var longitude: Double
    
    static let mock: [AdminWaterObject] = [
        AdminWaterObject(
            id: UUID(),
            name: "Озеро Балхаш",
            region: "Карагандинская обл.",
            kind: .lake,
            waterType: "Смешанная",
            hasFauna: true,
            technicalState: 3,
            latitude: 46.8,
            longitude: 74.9
        ),
        AdminWaterObject(
            id: UUID(),
            name: "Капшагайское водохранилище",
            region: "Алматинская обл.",
            kind: .reservoir,
            waterType: "Пресная",
            hasFauna: true,
            technicalState: 2,
            latitude: 43.9,
            longitude: 77.1
        ),
        AdminWaterObject(
            id: UUID(),
            name: "Канал имени Кунаева",
            region: "Алматинская обл.",
            kind: .canal,
            waterType: "Пресная",
            hasFauna: false,
            technicalState: 4,
            latitude: 44.0,
            longitude: 76.8
        )
    ]
}

// MARK: - Rows & Views

struct AdminWaterObjectRow: View {
    let object: AdminWaterObject
    let onEdit: () -> Void
    let onDelete: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(object.name)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                Spacer()
                Text(object.kind.title)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(10)
            }
            
            Text(object.region)
                .font(.caption)
                .foregroundColor(.secondary)
            
            HStack(spacing: 10) {
                Label(object.waterType, systemImage: "drop.fill")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                
                if object.hasFauna {
                    Label("Фауна есть", systemImage: "fish.fill")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                } else {
                    Label("Без фауны", systemImage: "nosign")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                
                Label("Сост. \(object.technicalState)/5", systemImage: "wrench.and.screwdriver.fill")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            
            HStack(spacing: 12) {
                Button(action: onEdit) {
                    Label("Редактировать", systemImage: "pencil")
                        .font(.caption)
                }
                Button(role: .destructive, action: onDelete) {
                    Label("Удалить", systemImage: "trash")
                        .font(.caption)
                }
            }
            .padding(.top, 4)
        }
        .padding(.vertical, 6)
    }
}

// Чип фильтра — отдельное имя, чтобы не конфликтовать с FilterChip из EmergencyNotificationsView
struct AdminFilterChip: View {
    let title: String
    let isActive: Bool
    let icon: String
    
    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
            Text(title)
        }
        .font(.caption)
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(isActive ? Color(red: 0.84, green: 0.30, blue: 0.70) : Color(.secondarySystemBackground))
        )
        .foregroundColor(isActive ? .white : .primary)
    }
}

// MARK: - Редактирование

struct EditAdminWaterObjectView: View {
    let title: String
    var object: AdminWaterObject?
    var onSave: (AdminWaterObject) -> Void
    
    @Environment(\.dismiss) var dismiss
    
    @State private var name: String = ""
    @State private var region: String = ""
    @State private var kind: AdminWaterObjectKind = .lake
    @State private var waterType: String = "Пресная"
    @State private var hasFauna: Bool = true
    @State private var technicalState: Int = 3
    @State private var latitude: String = ""
    @State private var longitude: String = ""
    
    init(title: String, object: AdminWaterObject?, onSave: @escaping (AdminWaterObject) -> Void) {
        self.title = title
        self.object = object
        self.onSave = onSave
        
        _name = State(initialValue: object?.name ?? "")
        _region = State(initialValue: object?.region ?? "")
        _kind = State(initialValue: object?.kind ?? .lake)
        _waterType = State(initialValue: object?.waterType ?? "Пресная")
        _hasFauna = State(initialValue: object?.hasFauna ?? true)
        _technicalState = State(initialValue: object?.technicalState ?? 3)
        _latitude = State(initialValue: object != nil ? String(object!.latitude) : "")
        _longitude = State(initialValue: object != nil ? String(object!.longitude) : "")
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Основная информация")) {
                    TextField("Название", text: $name)
                    TextField("Область", text: $region)
                    
                    Picker("Тип ресурса", selection: $kind) {
                        ForEach(AdminWaterObjectKind.allCases, id: \.self) { type in
                            Text(type.title).tag(type)
                        }
                    }
                    
                    Picker("Тип воды", selection: $waterType) {
                        Text("Пресная").tag("Пресная")
                        Text("Непресная").tag("Непресная")
                        Text("Смешанная").tag("Смешанная")
                    }
                }
                
                Section(header: Text("Характеристики")) {
                    Toggle("Наличие фауны", isOn: $hasFauna)
                    
                    Stepper(value: $technicalState, in: 1...5) {
                        Text("Техническое состояние: \(technicalState)/5")
                    }
                }
                
                Section(header: Text("Координаты")) {
                    TextField("Широта", text: $latitude)
                        .keyboardType(.decimalPad)
                    TextField("Долгота", text: $longitude)
                        .keyboardType(.decimalPad)
                }
                
                Section {
                    Button(action: save) {
                        HStack {
                            Spacer()
                            Text("Сохранить")
                                .fontWeight(.semibold)
                            Spacer()
                        }
                    }
                }
            }
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Отмена") {
                        dismiss()
                    }
                }
            }
        }
    }
    
    private func save() {
        let lat = Double(latitude) ?? 0
        let lon = Double(longitude) ?? 0
        
        let result = AdminWaterObject(
            id: object?.id ?? UUID(),
            name: name.isEmpty ? "Без названия" : name,
            region: region.isEmpty ? "Не указано" : region,
            kind: kind,
            waterType: waterType,
            hasFauna: hasFauna,
            technicalState: technicalState,
            latitude: lat,
            longitude: lon
        )
        
        onSave(result)
        dismiss()
    }
}

#Preview {
    NavigationView {
        AdminObjectsView()
    }
}

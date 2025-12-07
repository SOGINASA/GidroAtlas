import SwiftUI

struct AdminDashboardView: View {
    @EnvironmentObject var sensorStore: SensorStore
    @EnvironmentObject var notificationStore: NotificationStore
    
    @State private var showAddObjectSheet = false
    @State private var showAddSensorSheet = false
    @State private var showBroadcastSheet = false
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                header
                
                statsGrid
                
                managementSection
                
                recentChangesSection
            }
            .padding(.horizontal)
            .padding(.top, 16)
            .padding(.bottom, 24)
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("Админ-панель")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showAddObjectSheet) {
            AdminQuickFormView(
                title: "Новый водный объект",
                fields: ["Название", "Область", "Тип ресурса", "Тип воды"],
                primaryColor: Color(red: 0.84, green: 0.30, blue: 0.70)
            )
        }
        .sheet(isPresented: $showAddSensorSheet) {
            AdminQuickFormView(
                title: "Новый сенсор",
                fields: ["Название", "Координаты", "Тип датчика"],
                primaryColor: Color(red: 0.70, green: 0.35, blue: 0.90)
            )
        }
        .sheet(isPresented: $showBroadcastSheet) {
            AdminQuickFormView(
                title: "Широковещательное уведомление",
                fields: ["Заголовок", "Текст уведомления", "Целевая аудитория"],
                primaryColor: Color(red: 0.98, green: 0.40, blue: 0.60)
            )
        }
    }
    
    // MARK: - Header
    
    private var header: some View {
        ZStack(alignment: .leading) {
            RoundedRectangle(cornerRadius: 20)
                .fill(
                    LinearGradient(
                        colors: [
                            Color(red: 0.92, green: 0.36, blue: 0.62),
                            Color(red: 0.58, green: 0.26, blue: 0.82)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .shadow(color: Color(red: 0.6, green: 0.2, blue: 0.6).opacity(0.4), radius: 12, x: 0, y: 6)
            
            VStack(alignment: .leading, spacing: 10) {
                Text("Админ-панель GidroAtlas")
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                Text("Управляйте водными объектами, сенсорами и уведомлениями в одном месте.")
                    .font(.subheadline)
                    .foregroundColor(.white.opacity(0.9))
                    .fixedSize(horizontal: false, vertical: true)
                
                HStack(spacing: 16) {
                    HStack(spacing: 6) {
                        Circle()
                            .fill(Color.green)
                            .frame(width: 8, height: 8)
                        Text("Онлайн")
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.95))
                    }
                    
                    HStack(spacing: 6) {
                        Image(systemName: "bolt.heart.fill")
                            .font(.caption)
                        Text("MVP режим")
                            .font(.caption)
                    }
                    .foregroundColor(.white.opacity(0.9))
                }
                .padding(.top, 4)
            }
            .padding(16)
        }
        .frame(maxWidth: .infinity)
    }
    
    // MARK: - Статистика
    
    private var statsGrid: some View {
        let sensorsCount = sensorStore.sensors.count
        let notificationsCount = notificationStore.notifications.count
        
        return VStack(alignment: .leading, spacing: 12) {
            Text("Общая картина")
                .font(.headline)
                .foregroundColor(Color(red: 0.3, green: 0.1, blue: 0.4))
                .padding(.horizontal, 4)
            
            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: 12),
                GridItem(.flexible(), spacing: 12)
            ], spacing: 12) {
                AdminStatCard(
                    title: "Водные объекты",
                    value: "128",
                    subtitle: "паспортизировано",
                    icon: "drop.fill",
                    color: Color(red: 0.84, green: 0.30, blue: 0.70)
                )
                
                AdminStatCard(
                    title: "Сенсоры",
                    value: "\(sensorsCount)",
                    subtitle: "активных устройств",
                    icon: "sensor.tag.radiowaves.forward",
                    color: Color(red: 0.70, green: 0.35, blue: 0.90)
                )
                
                AdminStatCard(
                    title: "Уведомления",
                    value: "\(notificationsCount)",
                    subtitle: "в очереди",
                    icon: "bell.badge.fill",
                    color: Color(red: 0.98, green: 0.40, blue: 0.60)
                )
                
                AdminStatCard(
                    title: "Риск-зоны",
                    value: "12",
                    subtitle: "актуальных зон",
                    icon: "exclamationmark.triangle.fill",
                    color: Color(red: 0.95, green: 0.64, blue: 0.22)
                )
            }
        }
    }
    
    // MARK: - Управление
    
    private var managementSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Управление")
                .font(.headline)
                .foregroundColor(Color(red: 0.3, green: 0.1, blue: 0.4))
                .padding(.horizontal, 4)
            
            VStack(spacing: 12) {
                AdminActionButton(
                    title: "Добавить водный объект",
                    subtitle: "Озеро, канал, водохранилище",
                    icon: "plus.circle.fill",
                    gradient: [
                        Color(red: 0.92, green: 0.36, blue: 0.62),
                        Color(red: 0.58, green: 0.26, blue: 0.82)
                    ],
                    action: { showAddObjectSheet = true }
                )
                
                AdminActionButton(
                    title: "Добавить сенсор",
                    subtitle: "Привязка к объекту и координатам",
                    icon: "antenna.radiowaves.left.and.right",
                    gradient: [
                        Color(red: 0.58, green: 0.26, blue: 0.82),
                        Color(red: 0.30, green: 0.14, blue: 0.46)
                    ],
                    action: { showAddSensorSheet = true }
                )
                
                AdminActionButton(
                    title: "Отправить уведомление",
                    subtitle: "Жителям, администраторам, МЧС",
                    icon: "paperplane.fill",
                    gradient: [
                        Color(red: 0.98, green: 0.40, blue: 0.60),
                        Color(red: 0.95, green: 0.64, blue: 0.22)
                    ],
                    action: { showBroadcastSheet = true }
                )
            }
        }
    }
    
    // MARK: - Последние изменения
    
    private var recentChangesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Последние изменения")
                .font(.headline)
                .foregroundColor(Color(red: 0.3, green: 0.1, blue: 0.4))
                .padding(.horizontal, 4)
            
            VStack(spacing: 10) {
                AdminChangeRow(
                    icon: "drop.fill",
                    title: "Обновлён паспорт озера Балхаш",
                    subtitle: "Изменён технический статус: 3 → 2",
                    time: "Сегодня, 12:40"
                )
                AdminChangeRow(
                    icon: "sensor.tag.radiowaves.forward.fill",
                    title: "Добавлен сенсор #A-204",
                    subtitle: "Капшагайское водохранилище",
                    time: "Сегодня, 11:15"
                )
                AdminChangeRow(
                    icon: "bell.fill",
                    title: "Рассылка о паводковой обстановке",
                    subtitle: "Отправлена жителям 3 регионов",
                    time: "Вчера, 18:05"
                )
            }
            .padding()
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.04), radius: 6, x: 0, y: 3)
        }
    }
}

// MARK: - Вспомогательные компоненты

struct AdminStatCard: View {
    let title: String
    let value: String
    let subtitle: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .font(.title3)
                    .foregroundColor(.white)
                    .padding(8)
                    .background(color)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                
                Spacer()
                
                Text(value)
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
            }
            
            Text(title)
                .font(.subheadline)
                .fontWeight(.semibold)
            
            Text(subtitle)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(12)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 6, x: 0, y: 3)
    }
}

struct AdminActionButton: View {
    let title: String
    let subtitle: String
    let icon: String
    let gradient: [Color]
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(LinearGradient(colors: gradient, startPoint: .topLeading, endPoint: .bottomTrailing))
                        .frame(width: 44, height: 44)
                    Image(systemName: icon)
                        .foregroundColor(.white)
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.footnote)
                    .foregroundColor(.secondary)
            }
            .padding(12)
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 3)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct AdminChangeRow: View {
    let icon: String
    let title: String
    let subtitle: String
    let time: String
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(Color(red: 0.84, green: 0.30, blue: 0.70))
                .frame(width: 28)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                Text(subtitle)
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(time)
                    .font(.caption2)
                    .foregroundColor(.secondary.opacity(0.7))
            }
            Spacer()
        }
        .padding(.vertical, 6)
    }
}

// Шаблон простой формы (модалки)
struct AdminQuickFormView: View {
    let title: String
    let fields: [String]
    let primaryColor: Color
    
    @Environment(\.dismiss) var dismiss
    @State private var values: [String]
    
    init(title: String, fields: [String], primaryColor: Color) {
        self.title = title
        self.fields = fields
        self.primaryColor = primaryColor
        _values = State(initialValue: Array(repeating: "", count: fields.count))
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text(title)) {
                    ForEach(fields.indices, id: \.self) { index in
                        TextField(fields[index], text: $values[index])
                    }
                }
                
                Section {
                    Button(action: {
                        // Здесь в будущем будет отправка на бэкенд
                        dismiss()
                    }) {
                        HStack {
                            Spacer()
                            Text("Сохранить")
                                .fontWeight(.semibold)
                            Spacer()
                        }
                    }
                    .foregroundColor(primaryColor)
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
}

#Preview {
    AdminDashboardView()
        .environmentObject(SensorStore())
        .environmentObject(NotificationStore())
}

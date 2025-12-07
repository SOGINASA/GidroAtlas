import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var sensorStore: SensorStore
    @State private var currentWaterLevel: Double = 2.3
    @State private var maxWaterLevel: Double = 4.5
    @State private var animateCards = false
    @State private var showEmergencyCall = false
    @State private var showEvacuationInfo = false
    @State private var showInfoSheet = false
    @State private var selectedTab: Int? = nil
    
    private var sensors: [Sensor] {
        sensorStore.sensors
    }
    
    var averageLevel: Double {
        guard !sensors.isEmpty else { return 0 }
        return sensors.reduce(0) { $0 + $1.currentLevel } / Double(sensors.count)
    }
    
    var overallStatus: WaterLevel {
        let maxSensorLevel = sensors.map { $0.status }.max { status1, status2 in
            let priority = [WaterLevel.safe: 0, .warning: 1, .danger: 2, .critical: 3]
            return priority[status1]! < priority[status2]!
        }
        return maxSensorLevel ?? .safe
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                // Фон
                LinearGradient(
                    colors: [
                        Color(red: 0.95, green: 0.97, blue: 1.0),
                        Color(red: 0.9, green: 0.95, blue: 0.98)
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 20) {
                        // Заголовок с логотипом
                        headerView
                        
                        // Статус-карточка с анимацией
                        statusCard
                            .scaleEffect(animateCards ? 1.0 : 0.95)
                            .opacity(animateCards ? 1.0 : 0)
                        
                        // Средний уровень воды
                        waterLevelCard
                            .scaleEffect(animateCards ? 1.0 : 0.95)
                            .opacity(animateCards ? 1.0 : 0)
                        
                        // Секция с датчиками
                        sensorsSection
                            .scaleEffect(animateCards ? 1.0 : 0.95)
                            .opacity(animateCards ? 1.0 : 0)
                        
                        // Быстрые действия
                        quickActionsSection
                            .scaleEffect(animateCards ? 1.0 : 0.95)
                            .opacity(animateCards ? 1.0 : 0)
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                    .padding(.bottom, 32)
                }
            }
            .navigationBarHidden(true)
        }
        .onAppear {
            withAnimation(.spring(response: 0.8, dampingFraction: 0.8, blendDuration: 0.3)) {
                animateCards = true
            }
        }
        .sheet(isPresented: $showEvacuationInfo) {
            EvacuationInfoSheet()
                .presentationDetents([.medium, .large])
        }
        .sheet(isPresented: $showInfoSheet) {
            HelpInfoSheet()
                .presentationDetents([.medium, .large])
        }
        .alert(isPresented: $showEmergencyCall) {
            Alert(
                title: Text("Вызов 112"),
                message: Text("Вы действительно хотите позвонить в службу ЧС?"),
                primaryButton: .default(Text("Позвонить")) {
                    if let url = URL(string: "tel://112") {
                        UIApplication.shared.open(url)
                    }
                },
                secondaryButton: .cancel(Text("Отмена"))
            )
        }
    }
    
    // MARK: - Header
    
    private var headerView: some View {
        HStack {
            HStack(spacing: 10) {
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [
                                    Color(red: 0.1, green: 0.4, blue: 0.7),
                                    Color(red: 0.3, green: 0.7, blue: 0.9)
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 40, height: 40)
                    
                    Image(systemName: "drop.fill")
                        .foregroundColor(.white)
                        .font(.system(size: 20))
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    Text("GidroAtlas")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                    
                    Text("Главная")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            Spacer()
            
            // Кнопка уведомлений
            Button(action: {
                selectedTab = 2
                NotificationCenter.default.post(
                    name: NSNotification.Name("SwitchToNotificationsTab"),
                    object: nil
                )
            }) {
                ZStack {
                    RoundedRectangle(cornerRadius: 14)
                        .fill(Color.white)
                        .shadow(color: Color.black.opacity(0.08), radius: 8, x: 0, y: 4)
                        .frame(width: 44, height: 44)
                    
                    Image(systemName: "bell.badge.fill")
                        .font(.system(size: 20))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [
                                    Color(red: 0.95, green: 0.5, blue: 0.3),
                                    Color(red: 0.9, green: 0.2, blue: 0.3)
                                ],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                }
            }
        }
    }
    
    // MARK: - Status Card
    
    private var statusCard: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 24)
                .fill(
                    LinearGradient(
                        colors: statusBackgroundColors,
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(maxWidth: .infinity)
                .frame(height: 170)
                .shadow(color: Color.black.opacity(0.12), radius: 20, x: 0, y: 10)
            
            HStack(alignment: .center, spacing: 16) {
                ZStack {
                    Circle()
                        .fill(Color.white.opacity(0.2))
                        .frame(width: 70, height: 70)
                    
                    ZStack {
                        Circle()
                            .strokeBorder(Color.white.opacity(0.35), lineWidth: 3)
                            .frame(width: 60, height: 60)
                        
                        Circle()
                            .trim(from: 0, to: CGFloat(min(averageLevel / maxWaterLevel, 1.0)))
                            .stroke(
                                AngularGradient(
                                    gradient: Gradient(colors: [
                                        Color.white,
                                        Color.white.opacity(0.8),
                                        Color.white
                                    ]),
                                    center: .center
                                ),
                                style: StrokeStyle(lineWidth: 5, lineCap: .round)
                            )
                            .rotationEffect(.degrees(-90))
                            .frame(width: 60, height: 60)
                            .shadow(color: Color.white.opacity(0.8), radius: 8, x: 0, y: 0)
                            .animation(.easeInOut(duration: 1.0), value: averageLevel)
                        
                        Image(systemName: statusIcon)
                            .font(.system(size: 35))
                            .foregroundColor(.white)
                    }
                }
                
                VStack(alignment: .leading, spacing: 8) {
                    Text(overallStatus.rawValue)
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                    
                    Text(statusMessage)
                        .font(.subheadline)
                        .foregroundColor(.white.opacity(0.9))
                        .lineLimit(2)
                    
                    HStack(spacing: 12) {
                        statusBadge(text: "Средний уровень", value: String(format: "%.1f м", averageLevel))
                        statusBadge(text: "Датчиков онлайн", value: "\(sensors.count)")
                    }
                }
                
                Spacer()
            }
            .padding(.horizontal, 20)
        }
    }
    
    private var statusBackgroundColors: [Color] {
        switch overallStatus {
        case .safe:
            return [
                Color(red: 0.1, green: 0.6, blue: 0.4),
                Color(red: 0.2, green: 0.8, blue: 0.5)
            ]
        case .warning:
            return [
                Color(red: 0.9, green: 0.6, blue: 0.2),
                Color(red: 0.9, green: 0.45, blue: 0.2)
            ]
        case .danger:
            return [
                Color(red: 0.9, green: 0.35, blue: 0.25),
                Color(red: 0.8, green: 0.1, blue: 0.2)
            ]
        case .critical:
            return [
                Color(red: 0.6, green: 0.0, blue: 0.0),
                Color(red: 0.4, green: 0.0, blue: 0.0)
            ]
        }
    }
    
    private var statusIcon: String {
        switch overallStatus {
        case .safe: return "checkmark.seal.fill"
        case .warning: return "exclamationmark.triangle.fill"
        case .danger: return "flame.fill"
        case .critical: return "exclamationmark.octagon.fill"
        }
    }
    
    private var statusMessage: String {
        switch overallStatus {
        case .safe:
            return "Уровень воды в норме, риск подтопления минимален."
        case .warning:
            return "Отмечены повышенные уровни воды. Следите за обновлениями."
        case .danger:
            return "Риск подтопления повышен. Будьте готовы к возможной эвакуации."
        case .critical:
            return "Критический уровень воды! Возможны серьёзные подтопления."
        }
    }
    
    private func statusBadge(text: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(text)
                .font(.caption2)
                .foregroundColor(.white.opacity(0.8))
            
            Text(value)
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(.white)
        }
        .padding(.vertical, 6)
        .padding(.horizontal, 10)
        .background(Color.white.opacity(0.12))
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
    }
    
    // MARK: - Water Level Card
    
    private var waterLevelCard: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 24)
                .fill(Color.white)
                .frame(maxWidth: .infinity)
                .frame(height: 220)
                .shadow(color: Color.black.opacity(0.06), radius: 16, x: 0, y: 8)
            
            HStack(spacing: 20) {
                // Круговой индикатор
                ZStack {
                    Circle()
                        .stroke(Color.gray.opacity(0.15), lineWidth: 10)
                        .frame(width: 120, height: 120)
                    
                    Circle()
                        .trim(from: 0.0, to: CGFloat(min(averageLevel / maxWaterLevel, 1.0)))
                        .stroke(
                            AngularGradient(
                                gradient: Gradient(colors: [
                                    Color(red: 0.1, green: 0.5, blue: 0.9),
                                    Color(red: 0.2, green: 0.85, blue: 0.9),
                                    Color(red: 0.1, green: 0.5, blue: 0.9)
                                ]),
                                center: .center
                            ),
                            style: StrokeStyle(lineWidth: 10, lineCap: .round, lineJoin: .round)
                        )
                        .rotationEffect(.degrees(-90))
                        .frame(width: 120, height: 120)
                        .shadow(color: Color(red: 0.2, green: 0.6, blue: 0.9).opacity(0.4), radius: 10, x: 0, y: 4)
                        .animation(.easeInOut(duration: 1.0), value: averageLevel)
                    
                    VStack(spacing: 2) {
                        Text(String(format: "%.1f м", averageLevel))
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                        
                        Text("в среднем")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                }
                
                VStack(alignment: .leading, spacing: 12) {
                    Text("Динамика воды")
                        .font(.headline)
                        .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                    
                    Text("Система отслеживает изменения уровня воды по всему городу.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                    
                    VStack(spacing: 10) {
                        levelRow(title: "Текущий уровень", value: String(format: "%.1f м", averageLevel), color: Color(red: 0.1, green: 0.5, blue: 0.9))
                        levelRow(title: "Критический порог", value: String(format: "%.1f м", maxWaterLevel), color: Color(red: 0.9, green: 0.3, blue: 0.3))
                    }
                }
            }
            .padding(.horizontal, 18)
        }
    }
    
    private func levelRow(title: String, value: String, color: Color) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Text(value)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
            }
            
            Spacer()
            
            Capsule()
                .fill(
                    LinearGradient(
                        colors: [
                            color.opacity(0.2),
                            color.opacity(0.05)
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .frame(width: 80, height: 8)
                .overlay(
                    Capsule()
                        .fill(color)
                        .frame(width: 40, height: 8),
                    alignment: .leading
                )
        }
    }
    
    // MARK: - Sensors Section
    
    private var sensorsSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text("Датчики в городе")
                    .font(.headline)
                    .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                
                Spacer()
                
                HStack(spacing: 6) {
                    Circle()
                        .fill(Color.green.opacity(0.9))
                        .frame(width: 8, height: 8)
                    Text("Норма")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    
                    Circle()
                        .fill(Color.yellow.opacity(0.9))
                        .frame(width: 8, height: 8)
                    Text("Риск")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    
                    Circle()
                        .fill(Color.red.opacity(0.9))
                        .frame(width: 8, height: 8)
                    Text("Опасно")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            
            VStack(spacing: 10) {
                ForEach(Array(sensors.enumerated()), id: \.element.id) { index, sensor in
                    ModernSensorCard(sensor: sensor, index: index)
                }
            }
        }
    }
    
    // MARK: - Quick Actions
    
    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Быстрые действия")
                    .font(.headline)
                    .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                
                Spacer()
            }
            
            HStack(spacing: 12) {
                ModernQuickActionButton(
                    title: "Вызов 112",
                    subtitle: "Экстренная служба",
                    icon: "phone.fill",
                    gradient: [
                        Color(red: 0.95, green: 0.4, blue: 0.3),
                        Color(red: 0.85, green: 0.1, blue: 0.2)
                    ],
                    action: {
                        showEmergencyCall = true
                    }
                )
                
                ModernQuickActionButton(
                    title: "Эвакуация",
                    subtitle: "Пункты сбора",
                    icon: "figure.walk.arrival",
                    gradient: [
                        Color(red: 0.3, green: 0.6, blue: 0.9),
                        Color(red: 0.1, green: 0.4, blue: 0.7)
                    ],
                    action: {
                        showEvacuationInfo = true
                    }
                )
            }
            
            HStack(spacing: 12) {
                ModernQuickActionButton(
                    title: "Карта",
                    subtitle: "Сенсоры и зоны риска",
                    icon: "map.fill",
                    gradient: [
                        Color(red: 0.3, green: 0.8, blue: 0.7),
                        Color(red: 0.1, green: 0.6, blue: 0.5)
                    ],
                    action: {
                        NotificationCenter.default.post(
                            name: NSNotification.Name("SwitchToMapTab"),
                            object: nil
                        )
                    }
                )
                
                ModernQuickActionButton(
                    title: "Памятка",
                    subtitle: "Что делать при подъёме воды",
                    icon: "book.fill",
                    gradient: [
                        Color(red: 0.9, green: 0.7, blue: 0.3),
                        Color(red: 0.9, green: 0.5, blue: 0.2)
                    ],
                    action: {
                        showInfoSheet = true
                    }
                )
            }
        }
    }
}

// MARK: - Modern Sensor Card

struct ModernSensorCard: View {
    let sensor: Sensor
    let index: Int
    
    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(sensorStatusBackground)
                    .frame(width: 38, height: 38)
                
                Image(systemName: "sensor.tag.radiowaves.forward.fill")
                    .font(.system(size: 18))
                    .foregroundColor(sensorStatusColor)
            }
            
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(sensor.name)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                    
                    Spacer()
                    
                    Text(String(format: "%.2f м", sensor.currentLevel))
                        .font(.subheadline)
                        .fontWeight(.bold)
                        .foregroundColor(sensorStatusColor)
                }
                
                HStack(spacing: 6) {
                    Text(sensor.status.rawValue)
                        .font(.caption2)
                        .foregroundColor(sensorStatusColor)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(sensorStatusBackground.opacity(0.2))
                        .clipShape(Capsule())
                    
                    Text("Обновлено: \(sensor.lastUpdate, formatter: dateFormatter)")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                
                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        Capsule()
                            .fill(Color.gray.opacity(0.15))
                            .frame(height: 6)
                        
                        Capsule()
                            .fill(
                                LinearGradient(
                                    colors: [
                                        sensorStatusColor.opacity(0.8),
                                        sensorStatusColor
                                    ],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .frame(width: geometry.size.width * CGFloat(min(sensor.levelPercentage, 1.0)), height: 6)
                            .animation(.easeInOut(duration: 0.8).delay(Double(index) * 0.05), value: sensor.levelPercentage)
                    }
                }
                .frame(height: 6)
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .background(
            RoundedRectangle(cornerRadius: 18)
                .fill(Color.white)
                .shadow(color: Color.black.opacity(0.04), radius: 8, x: 0, y: 4)
        )
    }
    
    private var sensorStatusColor: Color {
        switch sensor.status {
        case .safe:
            return Color.green
        case .warning:
            return Color.yellow
        case .danger:
            return Color.orange
        case .critical:
            return Color.red
        }
    }
    
    private var sensorStatusBackground: Color {
        switch sensor.status {
        case .safe:
            return Color.green.opacity(0.1)
        case .warning:
            return Color.yellow.opacity(0.1)
        case .danger:
            return Color.orange.opacity(0.1)
        case .critical:
            return Color.red.opacity(0.1)
        }
    }
    
    private var dateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter
    }
}

// MARK: - Quick Action Button

struct ModernQuickActionButton: View {
    let title: String
    let subtitle: String
    let icon: String
    let gradient: [Color]
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(alignment: .center, spacing: 10) {
                ZStack {
                    RoundedRectangle(cornerRadius: 14)
                        .fill(
                            LinearGradient(
                                colors: gradient,
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 36, height: 36)
                    
                    Image(systemName: icon)
                        .font(.system(size: 18))
                        .foregroundColor(.white)
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                    
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: 18)
                    .fill(Color.white)
                    .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 4)
            )
        }
    }
}

// MARK: - Evacuation Info Sheet

struct EvacuationInfoSheet: View {
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Пункты эвакуации")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                        .padding(.bottom, 4)
                    
                    Text("В случае критического подъёма уровня воды действуйте по инструкции и следуйте в ближайший пункт эвакуации.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .padding(.bottom, 8)
                    
                    evacuationPoint(
                        name: "Школа № 1",
                        address: "ул. Абая, 12",
                        details: "Большой спортивный зал, запас питьевой воды и тёплые вещи."
                    )
                    
                    evacuationPoint(
                        name: "Дом культуры",
                        address: "пр. Нурсултана Назарбаева, 45",
                        details: "Зал на 300 человек, горячее питание, медицинский пункт."
                    )
                    
                    evacuationPoint(
                        name: "Гимназия № 5",
                        address: "ул. Жамбыла, 23",
                        details: "Вместимость до 200 человек, отдельные помещения для семей с детьми."
                    )
                    
                    Divider().padding(.vertical, 8)
                    
                    Text("Что взять с собой")
                        .font(.headline)
                        .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                    
                    VStack(alignment: .leading, spacing: 6) {
                        infoItem(text: "Документы, деньги и банковские карты")
                        infoItem(text: "Тёплая одежда и сменная обувь")
                        infoItem(text: "Необходимые лекарства на несколько дней")
                        infoItem(text: "Зарядные устройства для телефона")
                    }
                    
                    Divider().padding(.vertical, 8)
                    
                    Text("Как действовать")
                        .font(.headline)
                        .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                    
                    VStack(alignment: .leading, spacing: 6) {
                        infoItem(text: "Следуйте указаниям служб ЧС и местных властей")
                        infoItem(text: "Сообщите родственникам и близким, где вы находитесь")
                        infoItem(text: "Не пытайтесь пересекать затопленные участки дороги")
                    }
                }
                .padding(16)
            }
            .navigationTitle("Эвакуация")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    private func evacuationPoint(name: String, address: String, details: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(name)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                
                Spacer()
            }
            
            Text(address)
                .font(.caption)
                .foregroundColor(.secondary)
            
            Text(details)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white)
                .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 4)
        )
    }
    
    private func infoItem(text: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Circle()
                .fill(Color(red: 0.1, green: 0.4, blue: 0.7))
                .frame(width: 6, height: 6)
                .padding(.top, 4)
            
            Text(text)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}

// MARK: - Help Info Sheet

struct HelpInfoSheet: View {
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("Как действовать при подъёме воды")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                        .padding(.bottom, 4)
                    
                    Text("Соблюдение простых правил поможет сохранить вашу безопасность и здоровье.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .padding(.bottom, 8)
                    
                    helpSection(
                        title: "До подъёма воды",
                        items: [
                            "Подготовьте тревожный чемоданчик с документами и необходимыми вещами",
                            "Уточните расположение ближайшего пункта эвакуации",
                            "Продумайте маршрут эвакуации для всей семьи",
                            "Зарядите телефоны и повербанки"
                        ]
                    )
                    
                    helpSection(
                        title: "При повышении уровня воды",
                        items: [
                            "Следите за сообщениями в приложении и по официальным каналам",
                            "Поднимите ценные вещи и технику на верхние этажи или повыше",
                            "Отключите газ и электричество при угрозе затопления",
                            "Избегайте нахождения в подвалах и низинах"
                        ]
                    )
                    
                    helpSection(
                        title: "После спада воды",
                        items: [
                            "Не включайте электроприборы до проверки специалистами",
                            "Используйте только безопасную питьевую воду",
                            "Сообщите о повреждениях дома в соответствующие службы",
                            "Следите за здоровьем: при недомогании обращайтесь к врачу"
                        ]
                    )
                }
                .padding(16)
            }
            .navigationTitle("Памятка")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    private func helpSection(title: String, items: [String]) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
                .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
            
            VStack(alignment: .leading, spacing: 6) {
                ForEach(items, id: \.self) { item in
                    HStack(alignment: .top, spacing: 8) {
                        Circle()
                            .fill(Color(red: 0.1, green: 0.4, blue: 0.7))
                            .frame(width: 6, height: 6)
                            .padding(.top, 4)
                        
                        Text(item)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white)
                .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 4)
        )
    }
}

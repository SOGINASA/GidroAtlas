import SwiftUI

// MARK: - Модели уведомлений для МЧС

enum EmergencyNotificationType: String, CaseIterable, Identifiable {
    case info = "Информация"
    case warning = "Предупреждение"
    case evacuation = "Эвакуация"
    case critical = "Критическое"

    var id: String { rawValue }

    var color: Color {
        switch self {
        case .info: return .blue
        case .warning: return .orange
        case .evacuation: return .purple
        case .critical: return .red
        }
    }

    var icon: String {
        switch self {
        case .info: return "info.circle.fill"
        case .warning: return "exclamationmark.triangle.fill"
        case .evacuation: return "figure.run.circle.fill"
        case .critical: return "exclamationmark.octagon.fill"
        }
    }
}

enum EmergencyNotificationStatus: String {
    case sent = "Отправлено"
    case scheduled = "Запланировано"
    case failed = "Ошибка"

    var color: Color {
        switch self {
        case .sent: return .green
        case .scheduled: return .yellow
        case .failed: return .red
        }
    }

    var icon: String {
        switch self {
        case .sent: return "checkmark.circle.fill"
        case .scheduled: return "clock.fill"
        case .failed: return "xmark.octagon.fill"
        }
    }
}

struct EmergencyNotificationItem: Identifiable {
    let id = UUID()
    let title: String
    let message: String
    let type: EmergencyNotificationType
    let status: EmergencyNotificationStatus
    let audience: String                // «Все жители», «Критическая зона» и т.п.
    let channels: [String]              // ["SMS", "Push", "Telegram"]
    let recipients: Int                 // Кол-во получателей
    let createdAt: Date
    let scheduledAt: Date?
}

// Тестовые данные – чтобы всё сразу жило
extension EmergencyNotificationItem {
    static let mock: [EmergencyNotificationItem] = [
        EmergencyNotificationItem(
            title: "Эвакуация из критической зоны",
            message: "Жителям улиц Прибрежная, Набережная и Заречная немедленно проследовать к пунктам эвакуации №7 и №8.",
            type: .evacuation,
            status: .sent,
            audience: "Критическая зона",
            channels: ["SMS", "Push"],
            recipients: 312,
            createdAt: Date().addingTimeInterval(-60 * 20),
            scheduledAt: nil
        ),
        EmergencyNotificationItem(
            title: "Повышение уровня воды",
            message: "В ближайшие 3 часа ожидается подъём уровня воды на 25–30 см. Подготовьте документы и необходимые вещи.",
            type: .warning,
            status: .sent,
            audience: "Средний и высокий риск",
            channels: ["Push"],
            recipients: 1840,
            createdAt: Date().addingTimeInterval(-60 * 60),
            scheduledAt: nil
        ),
        EmergencyNotificationItem(
            title: "Проверка системы оповещения",
            message: "Завтра в 11:00 будет проведено тестовое включение сирен и рассылка тестовых сообщений.",
            type: .info,
            status: .scheduled,
            audience: "Все жители",
            channels: ["SMS", "Push", "Telegram"],
            recipients: 23500,
            createdAt: Date().addingTimeInterval(-60 * 90),
            scheduledAt: Date().addingTimeInterval(60 * 60 * 12)
        ),
        EmergencyNotificationItem(
            title: "Сбой доставки уведомлений",
            message: "Часть сообщений за 10:15–10:20 могла не дойти до абонентов. Отправка будет повторена автоматически.",
            type: .critical,
            status: .failed,
            audience: "Все жители (служебное)",
            channels: ["Telegram"],
            recipients: 540,
            createdAt: Date().addingTimeInterval(-60 * 150),
            scheduledAt: nil
        )
    ]
}

// MARK: - Основной экран

struct EmergencyNotificationsView: View {
    @State private var notifications: [EmergencyNotificationItem] = EmergencyNotificationItem.mock
    @State private var filterType: EmergencyNotificationType? = nil
    @State private var showNewSheet = false

    // небольшие агрегаты для «статистики»
    private var stats: (today: Int, critical: Int, scheduled: Int, failed: Int) {
        let calendar = Calendar.current
        let todayCount = notifications.filter {
            calendar.isDateInToday($0.createdAt)
        }.count
        let critical = notifications.filter { $0.type == .critical || $0.type == .evacuation }.count
        let scheduled = notifications.filter { $0.status == .scheduled }.count
        let failed = notifications.filter { $0.status == .failed }.count
        return (todayCount, critical, scheduled, failed)
    }

    private var filteredNotifications: [EmergencyNotificationItem] {
        if let filterType {
            return notifications.filter { $0.type == filterType }
                .sorted(by: { $0.createdAt > $1.createdAt })
        } else {
            return notifications.sorted(by: { $0.createdAt > $1.createdAt })
        }
    }

    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(
                    colors: [
                        Color(red: 1.0, green: 0.96, blue: 0.95),
                        Color(red: 0.98, green: 0.93, blue: 0.90)
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()

                VStack(spacing: 0) {
                    ScrollView {
                        VStack(spacing: 18) {
                            header
                            statsView
                            filterSegment

                            if filteredNotifications.isEmpty {
                                emptyState
                            } else {
                                LazyVStack(spacing: 14) {
                                    ForEach(filteredNotifications) { notification in
                                        EmergencyNotificationRow(item: notification)
                                    }
                                }
                            }

                            Spacer(minLength: 90)
                        }
                        .padding(.horizontal)
                        .padding(.top, 14)
                    }

                    bottomNewButton
                }
            }
            .navigationBarHidden(true)
            .sheet(isPresented: $showNewSheet) {
                NewEmergencyNotificationSheet { draft in
                    // «Отправляем»: добавляем в локальный список
                    let newItem = EmergencyNotificationItem(
                        title: draft.title,
                        message: draft.message,
                        type: draft.type,
                        status: draft.scheduleDate == nil ? .sent : .scheduled,
                        audience: draft.audienceLabel,
                        channels: draft.enabledChannels,
                        recipients: draft.estimatedRecipients,
                        createdAt: Date(),
                        scheduledAt: draft.scheduleDate
                    )
                    notifications.insert(newItem, at: 0)
                }
            }
        }
    }

    // MARK: - Подвьюхи

    private var header: some View {
        HStack(alignment: .center, spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(
                        LinearGradient(
                            colors: [.red, .orange],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 54, height: 54)

                Image(systemName: "bell.badge.fill")
                    .font(.system(size: 26))
                    .foregroundColor(.white)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text("Уведомления МЧС")
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)

                Text("Критические сообщения доставляются по всем каналам.")
                    .font(.footnote)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }

            Spacer()
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .fill(Color.white.opacity(0.98))
                .shadow(color: .black.opacity(0.06), radius: 10, y: 4)
        )
    }

    private var statsView: some View {
        let s = stats

        return HStack(spacing: 12) {
            NotificationsStatCard(
                title: "За сегодня",
                value: s.today,
                color: .blue,
                icon: "paperplane.fill"
            )

            NotificationsStatCard(
                title: "Критичных",
                value: s.critical,
                color: .red,
                icon: "exclamationmark.octagon.fill"
            )

            NotificationsStatCard(
                title: "Запланировано",
                value: s.scheduled,
                color: .orange,
                icon: "clock.arrow.circlepath"
            )

            NotificationsStatCard(
                title: "Ошибки",
                value: s.failed,
                color: .pink,
                icon: "xmark.octagon.fill"
            )
        }
    }

    private var filterSegment: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                FilterChip(
                    title: "Все",
                    isSelected: filterType == nil,
                    color: .gray
                ) {
                    filterType = nil
                }

                ForEach(EmergencyNotificationType.allCases) { type in
                    FilterChip(
                        title: type.rawValue,
                        isSelected: filterType == type,
                        color: type.color
                    ) {
                        filterType = type
                    }
                }
            }
            .padding(4)
        }
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color.white.opacity(0.9))
        )
    }

    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "text.bubble")
                .font(.system(size: 40))
                .foregroundColor(.gray.opacity(0.6))

            Text("Пока нет уведомлений по данному фильтру")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(.top, 40)
        .frame(maxWidth: .infinity)
    }

    private var bottomNewButton: some View {
        VStack {
            Divider()
                .padding(.bottom, 6)

            Button(action: { showNewSheet = true }) {
                HStack(spacing: 10) {
                    Image(systemName: "plus.circle.fill")
                    Text("Новое уведомление")
                        .fontWeight(.semibold)
                }
                .padding(.horizontal, 18)
                .padding(.vertical, 10)
                .frame(maxWidth: .infinity)
                .background(
                    LinearGradient(
                        colors: [.red, .orange],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .foregroundColor(.white)
                .cornerRadius(16)
                .shadow(color: .red.opacity(0.3), radius: 8, y: 4)
            }
            .padding(.horizontal)
            .padding(.bottom, 10)
        }
        .background(.ultraThinMaterial)
    }
}

// MARK: - Карточка статистики

private struct NotificationsStatCard: View {
    let title: String
    let value: Int
    let color: Color
    let icon: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                ZStack {
                    Circle()
                        .fill(color.opacity(0.18))
                        .frame(width: 26, height: 26)

                    Image(systemName: icon)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(color)
                }

                Spacer()
            }

            Text("\(value)")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundColor(.primary)

            Text(title)
                .font(.caption2)
                .foregroundColor(.secondary)
                .lineLimit(1)
        }
        .padding(10)
        .frame(maxWidth: .infinity)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.white.opacity(0.98))
                .shadow(color: .black.opacity(0.05), radius: 6, y: 3)
        )
    }
}

// MARK: - Чип фильтра

private struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                if isSelected {
                    Circle()
                        .fill(color)
                        .frame(width: 6, height: 6)
                }
                Text(title)
                    .font(.caption)
                    .fontWeight(isSelected ? .semibold : .regular)
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(
                Capsule(style: .continuous)
                    .fill(isSelected ? color.opacity(0.15) : Color.gray.opacity(0.07))
            )
            .foregroundColor(isSelected ? color : .secondary)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Строка уведомления

private struct EmergencyNotificationRow: View {
    let item: EmergencyNotificationItem

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Верхняя строка: тип + статус + время
            HStack(alignment: .center, spacing: 8) {
                HStack(spacing: 6) {
                    Image(systemName: item.type.icon)
                        .font(.caption)
                    Text(item.type.rawValue)
                        .font(.caption2)
                        .fontWeight(.semibold)
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(
                    Capsule(style: .continuous)
                        .fill(item.type.color.opacity(0.14))
                )
                .foregroundColor(item.type.color)

                Spacer()

                EmergencyNotificationStatusBadge(status: item.status)

                Text(formatTime(item.createdAt))
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }

            // Заголовок + текст
            VStack(alignment: .leading, spacing: 4) {
                Text(item.title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.primary)

                Text(item.message)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(3)
            }

            // Нижняя строка: аудитория, каналы, получатели
            HStack(spacing: 10) {
                Label(item.audience, systemImage: "person.3.fill")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                    .lineLimit(1)

                Divider()
                    .frame(height: 10)

                HStack(spacing: 4) {
                    ForEach(item.channels, id: \.self) { channel in
                        ChannelChip(label: channel)
                    }
                }

                Spacer()

                Label("\(item.recipients)",
                      systemImage: "person.2.wave.2.fill")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.04), radius: 6, y: 3)
        )
    }

    private func formatTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }
}

// MARK: - Бейдж статуса

private struct EmergencyNotificationStatusBadge: View {
    let status: EmergencyNotificationStatus

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: status.icon)
                .font(.caption2)
            Text(status.rawValue)
                .font(.caption2)
                .fontWeight(.semibold)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(
            Capsule(style: .continuous)
                .fill(status.color.opacity(0.15))
        )
        .foregroundColor(status.color)
    }
}

// MARK: - Чип канала доставки

private struct ChannelChip: View {
    let label: String

    var body: some View {
        Text(label.uppercased())
            .font(.caption2)
            .fontWeight(.semibold)
            .padding(.horizontal, 6)
            .padding(.vertical, 3)
            .background(
                Capsule(style: .continuous)
                    .fill(Color.gray.opacity(0.12))
            )
            .foregroundColor(.secondary)
    }
}

// MARK: - Шит создания уведомления

struct NewNotificationDraft {
    var title: String = ""
    var message: String = ""
    var type: EmergencyNotificationType = .warning
    var audience: Int = 0
    var channelsSMS = true
    var channelsPush = true
    var channelsTelegram = false
    var scheduleNow = true
    var scheduleDate: Date? = nil

    var audienceLabel: String {
        switch audience {
        case 0: return "Все жители"
        case 1: return "Критическая зона"
        case 2: return "Средний и высокий риск"
        default: return "Выборочно"
        }
    }

    var enabledChannels: [String] {
        var result: [String] = []
        if channelsSMS { result.append("SMS") }
        if channelsPush { result.append("Push") }
        if channelsTelegram { result.append("Telegram") }
        return result
    }

    var estimatedRecipients: Int {
        // Примерная оценка (можно подменить реальными данными)
        switch audience {
        case 0: return 23000
        case 1: return 800
        case 2: return 3500
        default: return 500
        }
    }
}

struct NewEmergencyNotificationSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var draft = NewNotificationDraft()
    let onSend: (NewNotificationDraft) -> Void

    var body: some View {
        NavigationView {
            Form {
                Section("Тип уведомления") {
                    Picker("Тип", selection: $draft.type) {
                        ForEach(EmergencyNotificationType.allCases) { type in
                            HStack {
                                Image(systemName: type.icon)
                                Text(type.rawValue)
                            }
                            .tag(type)
                        }
                    }
                }

                Section("Получатели") {
                    Picker("Кому", selection: $draft.audience) {
                        Text("Все жители города").tag(0)
                        Text("Только критическая зона").tag(1)
                        Text("Средний и высокий риск").tag(2)
                        Text("Выборочно (служебное)").tag(3)
                    }

                    HStack {
                        Text("Ориентировочно получат")
                        Spacer()
                        Text("\(draft.estimatedRecipients) чел.")
                            .foregroundColor(.secondary)
                            .font(.footnote)
                    }
                }

                Section("Каналы доставки") {
                    Toggle("SMS", isOn: $draft.channelsSMS)
                    Toggle("Push-уведомление", isOn: $draft.channelsPush)
                    Toggle("Telegram-бот", isOn: $draft.channelsTelegram)
                }

                Section("Текст уведомления") {
                    TextField("Заголовок", text: $draft.title)
                    TextEditor(text: $draft.message)
                        .frame(minHeight: 100)
                }

                Section("Время отправки") {
                    Toggle("Отправить сразу", isOn: $draft.scheduleNow)

                    if !draft.scheduleNow {
                        DatePicker(
                            "Запланировать на",
                            selection: Binding(
                                get: { draft.scheduleDate ?? Date().addingTimeInterval(600) },
                                set: { draft.scheduleDate = $0 }
                            ),
                            displayedComponents: [.date, .hourAndMinute]
                        )
                    }
                }
            }
            .navigationTitle("Новое уведомление")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Отмена") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Отправить") {
                        // Если «отправить сразу» — очищаем дату
                        if draft.scheduleNow {
                            draft.scheduleDate = nil
                        }
                        onSend(draft)
                        dismiss()
                    }
                    .disabled(draft.title.trimmingCharacters(in: .whitespaces).isEmpty ||
                              draft.message.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ||
                              draft.enabledChannels.isEmpty)
                }
            }
        }
    }
}

// MARK: - Превью

#Preview {
    EmergencyNotificationsView()
}

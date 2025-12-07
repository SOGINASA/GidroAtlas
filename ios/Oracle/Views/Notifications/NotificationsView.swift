import SwiftUI

struct NotificationsView: View {
    @EnvironmentObject var notificationStore: NotificationStore
    @State private var selectedFilter: NotificationFilter = .all
    @State private var animateIn = false
    
    enum NotificationFilter: String, CaseIterable {
        case all = "Все"
        case unread = "Непрочитанные"
        case important = "Важные"
    }
    
    private var notifications: [Notification] {
        notificationStore.notifications
    }
    
    
    var filteredNotifications: [Notification] {
        switch selectedFilter {
        case .all:
            return notifications
        case .unread:
            return notifications.filter { !$0.isRead }
        case .important:
            return notifications.filter { $0.type == .danger || $0.type == .evacuation }
        }
    }
    
    var unreadCount: Int {
        notifications.filter { !$0.isRead }.count
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
                
                VStack(spacing: 0) {
                    // Header
                    NotificationsHeaderView(unreadCount: unreadCount) {
                        markAllAsRead()
                    }
                    
                    // Фильтры
                    FilterTabsView(selectedFilter: $selectedFilter)
                        .padding(.horizontal)
                        .padding(.top, 10)
                    
                    // Список или пустое состояние
                    if filteredNotifications.isEmpty {
                        emptyState
                    } else {
                        notificationsList
                    }
                }
            }
            .navigationBarHidden(true)
            .onAppear {
                Task {
                    await notificationStore.loadNotifications()
                    withAnimation(.spring(response: 0.6, dampingFraction: 0.7)) {
                        animateIn = true
                    }
                }
            }
        }
    }
    
    // MARK: - Header уведомлений
    private var notificationsHeaderView: some View {
        HStack {
            OracleLogoView(size: 28, showText: false)
            
            VStack(alignment: .leading, spacing: 2) {
                Text("Уведомления")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(OracleDesign.Colors.primary)
                
                if unreadCount > 0 {
                    Text("\(unreadCount) новых")
                        .font(.caption)
                        .foregroundColor(.secondary)
                } else {
                    Text("Все уведомления прочитаны")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            Spacer()
            
            if unreadCount > 0 {
                Button(action: markAllAsRead) {
                    Text("Прочитать всё")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(
                            RoundedRectangle(cornerRadius: 14)
                                .fill(OracleDesign.Colors.primary.opacity(0.1))
                        )
                }
                .foregroundColor(OracleDesign.Colors.primary)
            }
        }
        .padding(.horizontal)
        .padding(.top, 10)
        .padding(.bottom, 6)
    }
    
    // MARK: - Список уведомлений
    private var notificationsList: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(Array(filteredNotifications.enumerated()), id: \.element.id) { index, notification in
                    ModernNotificationCard(notification: notification) {
                        markAsRead(notification)
                    }
                    .scaleEffect(animateIn ? 1.0 : 0.95)
                    .opacity(animateIn ? 1.0 : 0)
                    .animation(
                        .spring(response: 0.6, dampingFraction: 0.8)
                            .delay(Double(index) * 0.05),
                        value: animateIn
                    )
                }
            }
            .padding()
        }
    }
    
    // MARK: - Пустое состояние
    private var emptyState: some View {
        VStack(spacing: 20) {
            Spacer()
            
            ZStack {
                Circle()
                    .fill(OracleDesign.Colors.primary.opacity(0.1))
                    .frame(width: 120, height: 120)
                
                Image(systemName: "bell.slash.fill")
                    .font(.system(size: 50))
                    .foregroundColor(OracleDesign.Colors.primary.opacity(0.5))
            }
            
            VStack(spacing: 8) {
                Text("Нет уведомлений")
                    .font(.title3)
                    .fontWeight(.semibold)
                
                Text("Здесь будут появляться важные уведомления\nо состоянии воды и эвакуации")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
            
            Spacer()
        }
        .padding()
    }
    
    // MARK: - Actions
    private func markAsRead(_ notification: Notification) {
        Task {
            await notificationStore.markAsRead(notification)
        }
    }
    
    private func markAllAsRead() {
        Task {
            await notificationStore.markAllAsRead()
        }
    }
}

// MARK: - Header компонент
struct NotificationsHeaderView: View {
    let unreadCount: Int
    let onMarkAllRead: () -> Void
    
    var body: some View {
        HStack {
            OracleLogoView(size: 28, showText: false)
            
            VStack(alignment: .leading, spacing: 2) {
                Text("Уведомления")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(OracleDesign.Colors.primary)
                
                if unreadCount > 0 {
                    Text("\(unreadCount) новых")
                        .font(.caption)
                        .foregroundColor(.secondary)
                } else {
                    Text("Все уведомления прочитаны")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            Spacer()
            
            if unreadCount > 0 {
                Button(action: onMarkAllRead) {
                    Text("Все")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(OracleDesign.Colors.primaryGradient())
                        .cornerRadius(20)
                }
            }
        }
        .padding()
        .background(Color.white)
        .shadow(color: .black.opacity(0.05), radius: 5, y: 2)
    }
}

// MARK: - Фильтры

struct FilterTabsView: View {
    @Binding var selectedFilter: NotificationsView.NotificationFilter
    
    var body: some View {
        HStack(spacing: 8) {
            ForEach(NotificationsView.NotificationFilter.allCases, id: \.self) { filter in
                Button(action: {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                        selectedFilter = filter
                    }
                }) {
                    Text(filter.rawValue)
                        .font(.subheadline)
                        .fontWeight(selectedFilter == filter ? .semibold : .regular)
                        .foregroundColor(selectedFilter == filter ? .white : .secondary)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(
                            ZStack {
                                if selectedFilter == filter {
                                    RoundedRectangle(cornerRadius: 16)
                                        .fill(OracleDesign.Colors.primaryGradient())
                                        .matchedGeometryEffect(id: "filterTab", in: Namespace().wrappedValue)
                                } else {
                                    RoundedRectangle(cornerRadius: 16)
                                        .fill(Color.white.opacity(0.9))
                                        .shadow(color: .black.opacity(0.05), radius: 3, y: 1)
                                }
                            }
                        )
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
    }
}

// MARK: - Карточка уведомления

struct ModernNotificationCard: View {
    let notification: Notification
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack(alignment: .top, spacing: 12) {
                ZStack {
                    RoundedRectangle(cornerRadius: 14)
                        .fill(
                            LinearGradient(
                                colors: [
                                    notification.type.color.opacity(0.15),
                                    notification.type.color.opacity(0.05)
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 40, height: 40)
                    
                    Image(systemName: notification.type.iconName)
                        .font(.system(size: 18))
                        .foregroundColor(notification.type.color)
                }
                
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(notification.title)
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(OracleDesign.Colors.primary)
                            .lineLimit(2)
                        
                        Spacer()
                        
                        if !notification.isRead {
                            Circle()
                                .fill(notification.type.color)
                                .frame(width: 8, height: 8)
                        }
                    }
                    
                    Text(notification.message)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(3)
                    
                    HStack(spacing: 8) {
                        Text(notification.type.displayName)
                            .font(.caption2)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(notification.type.color.opacity(0.1))
                            .foregroundColor(notification.type.color)
                            .clipShape(Capsule())
                        
                        Spacer()
                        
                        Text(notification.timestamp, style: .time)
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 18)
                    .fill(Color.white)
                    .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 4)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Расширение NotificationType для цветов и иконок

extension NotificationType {
    var color: Color {
        switch self {
        case .info:
            return Color.blue
        case .warning:
            return Color.orange
        case .danger:
            return Color.red
        case .evacuation:
            return Color.purple
        }
    }
    
    var iconName: String {
        switch self {
        case .info:
            return "info.circle.fill"
        case .warning:
            return "exclamationmark.triangle.fill"
        case .danger:
            return "flame.fill"
        case .evacuation:
            return "figure.walk.arrival"
        }
    }
    
    var displayName: String {
        switch self {
        case .info:
            return "Информация"
        case .warning:
            return "Предупреждение"
        case .danger:
            return "Опасность"
        case .evacuation:
            return "Эвакуация"
        }
    }
}

// MARK: - Вспомогательный форматтер даты (если нужен)

struct RelativeDateFormatterHelper {
    static let shared = RelativeDateFormatterHelper()
    
    private let formatter: RelativeDateTimeFormatter
    
    private init() {
        formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .short
    }
    
    func string(for date: Date) -> String {
        formatter.localizedString(for: date, relativeTo: Date())
    }
}

// MARK: - Старый компонент (для совместимости)
struct NotificationCard: View {
    let notification: Notification
    let onTap: () -> Void
    
    var body: some View {
        ModernNotificationCard(notification: notification, onTap: onTap)
    }
}

#Preview {
    NotificationsView()
        .environmentObject(NotificationStore())
}

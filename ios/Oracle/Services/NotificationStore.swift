import Foundation

@MainActor
final class NotificationStore: ObservableObject {
    @Published var notifications: [Notification] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    func loadNotifications(force: Bool = false) async {
        if !force, !notifications.isEmpty { return }
        
        isLoading = true
        errorMessage = nil
        
        do {
            let result = try await APIClient.shared.fetchNotifications()
            self.notifications = result
        } catch {
            self.errorMessage = error.localizedDescription
        }
        
        isLoading = false
    }
    
    func markAsRead(_ notification: Notification) async {
        guard let index = notifications.firstIndex(where: { $0.id == notification.id }) else { return }
        notifications[index].isRead = true
        
        do {
            try await APIClient.shared.markNotificationRead(id: notification.id)
        } catch {
            // по вкусу: можно откатить состояние
            print("Ошибка при отметке прочитанным: \(error)")
        }
    }
    
    func markAllAsRead() async {
        notifications = notifications.map { n in
            var copy = n
            copy.isRead = true
            return copy
        }
        
        do {
            try await APIClient.shared.markAllNotificationsRead()
        } catch {
            print("Ошибка при markAllAsRead: \(error)")
        }
    }
}

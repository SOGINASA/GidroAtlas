import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        Group {
            if authManager.isAuthenticated, let user = authManager.currentUser {
                switch user.role {
                case .resident:
                    MainTabView()
                case .emergency:
                    EmergencyMainTabView()
                case .admin:
                    AdminMainTabView()
                }
            } else {
                LoginView()
            }
        }
    }
}

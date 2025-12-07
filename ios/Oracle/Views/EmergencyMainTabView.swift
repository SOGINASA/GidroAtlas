import SwiftUI

struct EmergencyMainTabView: View {
    @State private var selectedTab = 0
    
    init() {
        // Настройка TabBar для МЧС
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor.white
        appearance.shadowColor = UIColor.black.withAlphaComponent(0.1)
        
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Tab 1: Dashboard
            EmergencyDashboardView()
                .tabItem {
                    Image(systemName: selectedTab == 0 ? "house.fill" : "house")
                    Text("Главная")
                }
                .tag(0)
            
            // Tab 2: Map
            EmergencyMapView()
                .tabItem {
                    Image(systemName: selectedTab == 1 ? "map.fill" : "map")
                    Text("Карта")
                }
                .tag(1)
            
            // Tab 3: Evacuation
            EmergencyEvacuationView()
                .tabItem {
                    Image(systemName: selectedTab == 2 ? "figure.run" : "figure.walk")
                    Text("Эвакуация")
                }
                .tag(2)
            
            // Tab 4: Notifications
            EmergencyNotificationsView()
                .tabItem {
                    Image(systemName: selectedTab == 3 ? "bell.fill" : "bell")
                    Text("Уведомления")
                }
                .tag(3)
            
            // Tab 5: Profile
            EmergencyProfileView()
                .tabItem {
                    Image(systemName: selectedTab == 4 ? "person.crop.circle.fill" : "person.crop.circle")
                    Text("Профиль")
                }
                .tag(4)
        }
        .accentColor(Color.red) // Красный акцент для МЧС
    }
}

// MARK: - Placeholders (TODO views)

struct EmergencyEvacuationPlaceholder: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "figure.run")
                .font(.system(size: 80))
                .foregroundColor(.orange)
            
            Text("Управление эвакуацией")
                .font(.title2)
                .fontWeight(.bold)
            
            Text("Скоро будет доступно")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(.systemGroupedBackground))
    }
}

struct EmergencyNotificationsPlaceholder: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "bell.badge.fill")
                .font(.system(size: 80))
                .foregroundColor(.red)
            
            Text("Отправка уведомлений")
                .font(.title2)
                .fontWeight(.bold)
            
            Text("Скоро будет доступно")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(.systemGroupedBackground))
    }
}

struct EmergencyProfilePlaceholder: View {
    @EnvironmentObject var authManager: AuthManager
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "person.circle.fill")
                .font(.system(size: 80))
                .foregroundColor(.blue)
            
            Text("Профиль сотрудника")
                .font(.title2)
                .fontWeight(.bold)
            
            if let user = authManager.currentUser {
                Text(user.name)
                    .font(.headline)
                
                Text(user.email)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            
            Button(action: {
                authManager.logout()
            }) {
                HStack {
                    Image(systemName: "rectangle.portrait.and.arrow.right")
                    Text("Выйти")
                        .fontWeight(.semibold)
                }
                .foregroundColor(.red)
                .padding()
                .frame(maxWidth: 200)
                .background(Color.red.opacity(0.1))
                .cornerRadius(12)
            }
            .padding(.top, 20)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(.systemGroupedBackground))
    }
}

#Preview {
    EmergencyMainTabView()
        .environmentObject(AuthManager())
}

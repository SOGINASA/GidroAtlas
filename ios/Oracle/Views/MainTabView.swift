import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0

    init() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor.white
        appearance.shadowColor = UIColor.black.withAlphaComponent(0.1)

        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }

    var body: some View {
        TabView(selection: $selectedTab) {
            MapView()
                .tabItem {
                    Image(systemName: selectedTab == 0 ? "map.fill" : "map")
                    Text("Карта")
                }
                .tag(0)

            NotificationsView()
                .tabItem {
                    Image(systemName: selectedTab == 1 ? "bell.fill" : "bell")
                    Text("Уведомления")
                }
                .tag(1)

            ProfileView()
                .tabItem {
                    Image(systemName: selectedTab == 2 ? "person.fill" : "person")
                    Text("Профиль")
                }
                .tag(2)
        }
        .accentColor(Color(red: 0.1, green: 0.4, blue: 0.7))
    }
}

#Preview {
    MainTabView()
        .environmentObject(AuthManager())
        .environmentObject(NotificationStore())
        .environmentObject(WaterObjectStore())
}

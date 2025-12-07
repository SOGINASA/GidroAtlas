import SwiftUI

struct AdminMainTabView: View {
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
            NavigationView {
                AdminDashboardView()
            }
            .tabItem {
                Image(systemName: "speedometer")
                Text("Дашборд")
            }
            .tag(0)
            
            NavigationView {
                AdminMapView()
            }
            .tabItem {
                Image(systemName: "map")
                Text("Карта")
            }
            .tag(1)
            
            NavigationView {
                AdminObjectsView()
            }
            .tabItem {
                Image(systemName: "list.bullet.rectangle")
                Text("Объекты")
            }
            .tag(2)
            
            NavigationView {
                AdminProfileView()
            }
            .tabItem {
                Image(systemName: "person.crop.circle")
                Text("Профиль")
            }
            .tag(3)
        }
        .accentColor(Color(red: 0.84, green: 0.30, blue: 0.70)) // розово-фиолетовый
    }
}

#Preview {
    AdminMainTabView()
        .environmentObject(AuthManager())
        .environmentObject(SensorStore())
        .environmentObject(NotificationStore())
}

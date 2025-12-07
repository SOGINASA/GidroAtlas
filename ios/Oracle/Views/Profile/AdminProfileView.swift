import SwiftUI

struct AdminProfileView: View {
    @EnvironmentObject var authManager: AuthManager
    
    private var user: User? { authManager.currentUser }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                if let user = user {
                    header(user: user)
                    preferences
                    logoutSection
                } else {
                    Text("Пользователь не найден")
                        .foregroundColor(.secondary)
                }
            }
            .padding(.horizontal)
            .padding(.top, 16)
            .padding(.bottom, 24)
        }
        .background(Color(.systemGroupedBackground))
        .navigationTitle("Профиль")
        .navigationBarTitleDisplayMode(.inline)
    }
    
    private func header(user: User) -> some View {
        VStack(spacing: 10) {
            ZStack {
                Circle()
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
                    .frame(width: 100, height: 100)
                Image(systemName: "gearshape.2.fill")
                    .font(.system(size: 40))
                    .foregroundColor(.white)
            }
            
            Text(user.name)
                .font(.title2)
                .fontWeight(.bold)
            
            Text("Администратор GidroAtlas")
                .font(.subheadline)
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(Color(red: 0.92, green: 0.36, blue: 0.62).opacity(0.12))
                .foregroundColor(Color(red: 0.84, green: 0.30, blue: 0.70))
                .cornerRadius(20)
            
            Text(user.email)
                .font(.footnote)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color.white)
        .cornerRadius(18)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
    }
    
    private var preferences: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Настройки администратора")
                .font(.headline)
                .padding(.horizontal, 4)
            
            VStack {
                ToggleRow(title: "Email-уведомления о критических событиях")
                ToggleRow(title: "Пуши о новых сенсорах и объектах")
                ToggleRow(title: "Показывать технические поля (ID, UUID)")
            }
            .padding()
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.05), radius: 6, x: 0, y: 3)
        }
    }
    
    private var logoutSection: some View {
        Button(action: {
            authManager.logout()
        }) {
            HStack {
                Spacer()
                Label("Выйти", systemImage: "rectangle.portrait.and.arrow.right")
                    .fontWeight(.semibold)
                Spacer()
            }
            .padding(.vertical, 12)
            .background(Color.red.opacity(0.08))
            .foregroundColor(.red)
            .cornerRadius(12)
        }
    }
}

struct ToggleRow: View {
    let title: String
    @State private var isOn: Bool = true
    
    var body: some View {
        Toggle(isOn: $isOn) {
            Text(title)
                .font(.subheadline)
        }
    }
}

#Preview {
    NavigationView {
        AdminProfileView()
            .environmentObject(AuthManager())
    }
}

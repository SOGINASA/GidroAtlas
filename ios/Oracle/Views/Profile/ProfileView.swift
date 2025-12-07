import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var showLogoutConfirmation = false
    @State private var showEditProfile = false
    
    private var user: User? {
        authManager.currentUser
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(.systemGroupedBackground)
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 20) {
                        if let user = user {
                            headerCard(user: user)
                            infoSection(user: user)
                            aboutSection
                            logoutSection
                        } else {
                            emptyState
                        }
                    }
                    .padding(.horizontal)
                    .padding(.top, 16)
                    .padding(.bottom, 24)
                }
            }
            .navigationTitle("Профиль")
            .navigationBarTitleDisplayMode(.inline)
            .alert(isPresented: $showLogoutConfirmation) {
                Alert(
                    title: Text("Выход"),
                    message: Text("Вы действительно хотите выйти из аккаунта?"),
                    primaryButton: .destructive(Text("Выйти")) {
                        authManager.logout()
                    },
                    secondaryButton: .cancel()
                )
            }
        }
    }
    
    // MARK: - Header
    private func headerCard(user: User) -> some View {
        VStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(LinearGradient(
                        colors: [
                            Color.blue.opacity(0.2),
                            Color.cyan.opacity(0.4)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ))
                    .frame(width: 110, height: 110)
                
                Image(systemName: "person.circle.fill")
                    .resizable()
                    .frame(width: 90, height: 90)
                    .foregroundColor(OracleDesign.Colors.primary)
            }
            
            Text(user.name)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(OracleDesign.Colors.primary)
            
            Text(roleTitle(for: user.role))
                .font(.subheadline)
                .fontWeight(.medium)
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(roleColor(for: user.role).opacity(0.12))
                .foregroundColor(roleColor(for: user.role))
                .cornerRadius(20)
            
            Button(action: {
                showEditProfile = true
            }) {
                HStack(spacing: 6) {
                    Image(systemName: "pencil")
                    Text("Редактировать профиль")
                }
                .font(.subheadline)
                .foregroundColor(OracleDesign.Colors.primary)
            }
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color.white)
        .cornerRadius(18)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
    }
    
    // MARK: - Информация
    private func infoSection(user: User) -> some View {
        VStack(alignment: .leading, spacing: 15) {
            Text("Контактная информация")
                .font(.headline)
                .foregroundColor(OracleDesign.Colors.primary)
                .padding(.horizontal)
            
            VStack(spacing: 0) {
                ProfileInfoRow(icon: "envelope.fill", title: "Email", value: user.email)
                Divider().padding(.leading, 50)
                
                if let phone = user.phone {
                    ProfileInfoRow(icon: "phone.fill", title: "Телефон", value: phone)
                } else {
                    ProfileInfoRow(icon: "phone.fill", title: "Телефон", value: "Не указан")
                }
            }
            .background(Color.white)
            .cornerRadius(15)
            .shadow(color: .black.opacity(0.05), radius: 3, x: 0, y: 2)
        }
    }
    
    // MARK: - О приложении
    private var aboutSection: some View {
        VStack(alignment: .leading, spacing: 15) {
            Text("О приложении")
                .font(.headline)
                .foregroundColor(OracleDesign.Colors.primary)
                .padding(.horizontal)
            
            VStack(spacing: 0) {
                AboutRow(
                    icon: "drop.triangle.fill",
                    title: "Oracle",
                    value: "Мониторинг паводков и оповещение жителей"
                )
                
                Divider().padding(.leading, 50)
                
                AboutRow(
                    icon: "lock.shield",
                    title: "Защита данных",
                    value: "Ваши данные обрабатываются только локально (MVP-режим)"
                )
            }
            .background(Color.white)
            .cornerRadius(15)
            .shadow(color: .black.opacity(0.05), radius: 3, x: 0, y: 2)
        }
    }
    
    // MARK: - Выход
    private var logoutSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Сессия")
                .font(.headline)
                .foregroundColor(OracleDesign.Colors.primary)
                .padding(.horizontal)
            
            Button(action: {
                showLogoutConfirmation = true
            }) {
                HStack {
                    Spacer()
                    HStack(spacing: 8) {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                        Text("Выйти из аккаунта")
                            .fontWeight(.semibold)
                    }
                    Spacer()
                }
                .padding(.vertical, 12)
                .background(Color.red.opacity(0.08))
                .foregroundColor(.red)
                .cornerRadius(12)
            }
            .padding(.horizontal)
        }
    }
    
    // MARK: - Пустое состояние
    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "person.crop.circle.badge.exclam")
                .font(.system(size: 60))
                .foregroundColor(.secondary)
            
            Text("Пользователь не найден")
                .font(.headline)
            
            Text("Попробуйте перелогиниться или перезапустить приложение.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding()
    }
    
    // MARK: - Вспомогательные
    private func roleTitle(for role: UserRole) -> String {
        switch role {
        case .resident:
            return "Житель"
        case .emergency:
            return "Сотрудник МЧС"
        }
    }
    
    private func roleColor(for role: UserRole) -> Color {
        switch role {
        case .resident:
            return .blue
        case .emergency:
            return .red
        }
    }
}

// MARK: - Вспомогательные строки

struct ProfileInfoRow: View {
    let icon: String
    let title: String
    let value: String
    
    var body: some View {
        HStack(spacing: 15) {
            Image(systemName: icon)
                .foregroundColor(OracleDesign.Colors.primary)
                .frame(width: 24)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(value)
                    .font(.subheadline)
            }
            
            Spacer()
        }
        .padding(.horizontal)
        .padding(.vertical, 10)
    }
}

struct AboutRow: View {
    let icon: String
    let title: String
    let value: String
    
    var body: some View {
        HStack(spacing: 15) {
            Image(systemName: icon)
                .foregroundColor(OracleDesign.Colors.primary)
                .frame(width: 24)
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(value)
                    .font(.subheadline)
            }
            Spacer()
        }
        .padding(.horizontal)
        .padding(.vertical, 10)
    }
}

#Preview {
    ProfileView()
        .environmentObject(AuthManager())
}

import SwiftUI

struct EmergencyProfileView: View {
    @EnvironmentObject var authManager: AuthManager

    @State private var onDuty: Bool = true
    @State private var allowCriticalPush: Bool = true
    @State private var allowAllPush: Bool = true
    @State private var vibrationEnabled: Bool = true

    private var user: User? { authManager.currentUser }

    private var userName: String {
        user?.name.isEmpty == false ? user!.name : "Без имени"
    }

    private var userEmail: String {
        user?.email ?? "Нет email"
    }

    private var userPhone: String {
        user?.phone ?? "Не указан"
    }

    private var userAddress: String {
        user?.address ?? "Не указан"
    }

    private var roleLabel: String {
        guard let role = user?.role else { return "Пользователь" }
        
        switch role {
        case .emergency:
            return "Сотрудник МЧС"
        case .resident:
            return "Житель"
        @unknown default:
            return "Пользователь"
        }
    }

    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(
                    colors: [
                        Color(red: 0.96, green: 0.98, blue: 1.0),
                        Color(red: 0.93, green: 0.96, blue: 1.0)
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 20) {
                        headerCard
                        dutyStatsCard
                        contactCard
                        settingsCard
                        logoutButton
                    }
                    .padding(.horizontal)
                    .padding(.top, 16)
                    .padding(.bottom, 24)
                }
            }
            .navigationBarHidden(true)
        }
    }

    // MARK: - Header

    private var headerCard: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [OracleDesign.Colors.primary, OracleDesign.Colors.secondary],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 72, height: 72)
                    .shadow(color: .black.opacity(0.15), radius: 8, y: 4)

                Text(initials(from: userName))
                    .font(.system(size: 30, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(userName)
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(OracleDesign.Colors.primary)

                HStack(spacing: 6) {
                    Image(systemName: "shield.lefthalf.filled")
                    Text(roleLabel)
                }
                .font(.caption)
                .foregroundColor(.secondary)

                HStack(spacing: 8) {
                    Capsule()
                        .fill(onDuty ? Color.green.opacity(0.2) : Color.gray.opacity(0.2))
                        .frame(width: 10, height: 10)
                        .overlay(
                            Circle()
                                .fill(onDuty ? Color.green : Color.gray)
                                .frame(width: 8, height: 8)
                        )

                    Text(onDuty ? "На смене" : "Вне смены")
                        .font(.caption2)
                        .foregroundColor(onDuty ? .green : .secondary)
                }
            }

            Spacer()
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.06), radius: 10, y: 5)
        )
    }

    // MARK: - Duty stats

    private var dutyStatsCard: some View {
        HStack(spacing: 12) {
            ProfileStatCard(
                title: "Смен в этом месяце",
                value: "12",
                icon: "calendar",
                color: .blue
            )

            ProfileStatCard(
                title: "Отработано часов",
                value: "96",
                icon: "clock.badge.checkmark",
                color: .orange
            )

            ProfileStatCard(
                title: "Инцидентов",
                value: "7",
                icon: "flame.fill",
                color: .red
            )
        }
    }

    // MARK: - Contacts

    private var contactCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Контактные данные")
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(OracleDesign.Colors.primary)

                Spacer()

                Button {
                    // тут потом можно открыть экран редактирования профиля
                } label: {
                    HStack(spacing: 4) {
                        Image(systemName: "square.and.pencil")
                        Text("Редактировать")
                    }
                    .font(.caption2)
                }
            }

            EmergencyProfileInfoRow(
                icon: "envelope.fill",
                title: "Email",
                value: userEmail
            )

            EmergencyProfileInfoRow(
                icon: "phone.fill",
                title: "Телефон",
                value: userPhone
            )

            EmergencyProfileInfoRow(
                icon: "mappin.and.ellipse",
                title: "Закреплённый район",
                value: userAddress
            )
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.05), radius: 8, y: 4)
        )
    }

    // MARK: - Settings

    private var settingsCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Настройки оповещений")
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(OracleDesign.Colors.primary)

            Toggle(isOn: $onDuty) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Статус смены")
                    Text(onDuty ? "Показывать вас как активного дежурного" : "Вы отмечены как вне смены")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }

            Toggle(isOn: $allowCriticalPush) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Критические уведомления")
                    Text("Получать всегда, даже в режиме «Не беспокоить»")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }

            Toggle(isOn: $allowAllPush) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Уведомления по всем зонам")
                    Text("Включая зоны, за которые вы не отвечаете напрямую")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }

            Toggle(isOn: $vibrationEnabled) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Вибро для тревоги")
                    Text("Дополнительный сигнал при критических событиях")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
        }
        .toggleStyle(SwitchToggleStyle(tint: OracleDesign.Colors.primary))
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.05), radius: 8, y: 4)
        )
    }

    // MARK: - Logout

    private var logoutButton: some View {
        Button(action: { authManager.logout() }) {
            HStack {
                Spacer()
                Image(systemName: "rectangle.portrait.and.arrow.right")
                Text("Выйти из аккаунта")
                    .fontWeight(.semibold)
                Spacer()
            }
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(Color.red.opacity(0.1))
            )
            .foregroundColor(.red)
        }
        .padding(.top, 4)
    }

    // MARK: - Helpers

    private func initials(from name: String) -> String {
        let parts = name.split(separator: " ")
        let first = parts.first?.first.map(String.init) ?? ""
        let last = parts.dropFirst().first?.first.map(String.init) ?? ""
        let combo = first + last
        return combo.isEmpty ? "MЧ" : combo.uppercased()
    }
}

// MARK: - Вспомогательные вью

private struct ProfileStatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                ZStack {
                    Circle()
                        .fill(color.opacity(0.18))
                        .frame(width: 26, height: 26)
                    Image(systemName: icon)
                        .foregroundColor(color)
                        .font(.system(size: 14, weight: .semibold))
                }
                Spacer()
            }

            Text(value)
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundColor(OracleDesign.Colors.primary)

            Text(title)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .padding(10)
        .frame(maxWidth: .infinity)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.04), radius: 5, y: 3)
        )
    }
}

private struct EmergencyProfileInfoRow: View {
    let icon: String
    let title: String
    let value: String

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: icon)
                .foregroundColor(OracleDesign.Colors.primary)
                .frame(width: 18)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.caption2)
                    .foregroundColor(.secondary)

                Text(value)
                    .font(.subheadline)
                    .foregroundColor(.primary)
            }

            Spacer()
        }
    }
}

// MARK: - Preview

#Preview {
    let manager = AuthManager()
    EmergencyProfileView()
        .environmentObject(manager)
}

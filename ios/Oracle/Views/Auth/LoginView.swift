import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var email = ""
    @State private var password = ""
    @State private var showRegister = false
    @State private var showError = false
    @State private var errorMessage = ""
    @State private var isAnimating = false
    
    // Логотип (можешь поменять на свой)
    private let oracleLogoURL = URL(string: "https://media.discordapp.net/attachments/1290320649657634907/1303119409691564032/Frame_1000004563_1.png")!
    
    var body: some View {
        NavigationView {
            ZStack {
                // Фон — фирменный градиент Oracle
                LinearGradient(
                    colors: [
                        Color(red: 0.06, green: 0.18, blue: 0.32),
                        Color(red: 0.00, green: 0.49, blue: 0.77)
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    Spacer()
                    
                    // Логотип Oracle с анимацией
                    VStack(spacing: 12) {
                        ZStack {
                            Circle()
                                .fill(Color.white.opacity(0.15))
                                .frame(width: 100, height: 100)
                                .blur(radius: 15)
                            
                            Circle()
                                .stroke(Color.white.opacity(0.3), lineWidth: 2)
                                .frame(width: 85, height: 85)
                            
                            AsyncImage(url: oracleLogoURL) { phase in
                                switch phase {
                                case .empty:
                                    ProgressView()
                                        .tint(.white)
                                case .success(let image):
                                    image
                                        .resizable()
                                        .scaledToFit()
                                        .frame(width: 70, height: 70)
                                        .clipShape(Circle())
                                        .shadow(color: .cyan.opacity(0.5), radius: 10)
                                case .failure:
                                    Image(systemName: "waveform.circle.fill")
                                        .resizable()
                                        .scaledToFit()
                                        .frame(width: 70, height: 70)
                                        .foregroundColor(.white)
                                @unknown default:
                                    EmptyView()
                                }
                            }
                        }
                        .scaleEffect(isAnimating ? 1.05 : 1.0)
                        .animation(
                            .easeInOut(duration: 2.0)
                                .repeatForever(autoreverses: true),
                            value: isAnimating
                        )
                        
                        Text("Oracle")
                            .font(.system(size: 42, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                            .shadow(color: .black.opacity(0.2), radius: 5, x: 0, y: 3)
                        
                        Text("Мониторинг паводков")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.white.opacity(0.95))
                            .tracking(1)
                    }
                    .padding(.bottom, 25)
                    
                    Spacer().frame(height: 20)
                    
                    // Форма входа + быстрые кнопки
                    VStack(spacing: 16) {
                        // Быстрый вход (Житель)
                        Button(action: {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                authManager.loginAsTestResident()
                            }
                        }) {
                            HStack(spacing: 10) {
                                Image(systemName: "person.crop.circle.fill")
                                    .font(.title3)
                                Text("Войти как житель")
                                    .fontWeight(.semibold)
                                Spacer()
                                Image(systemName: "arrow.right.circle.fill")
                                    .font(.title3)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .padding(.horizontal, 18)
                            .background(
                                LinearGradient(
                                    colors: [Color.green, Color.green.opacity(0.85)],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .foregroundColor(.white)
                            .cornerRadius(14)
                            .shadow(color: .green.opacity(0.4), radius: 8, y: 4)
                        }
                        .padding(.horizontal, 25)
                        
                        // Быстрый вход (сотрудник МЧС)
                        Button(action: {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                authManager.loginAsTestEmergency()
                            }
                        }) {
                            HStack(spacing: 10) {
                                Image(systemName: "shield.lefthalf.filled")
                                    .font(.title3)
                                Text("Войти как сотрудник МЧС")
                                    .fontWeight(.semibold)
                                Spacer()
                                Image(systemName: "arrow.right.circle.fill")
                                    .font(.title3)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .padding(.horizontal, 18)
                            .background(
                                LinearGradient(
                                    colors: [Color.orange, Color.orange.opacity(0.85)],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .foregroundColor(.white)
                            .cornerRadius(14)
                            .shadow(color: .orange.opacity(0.4), radius: 8, y: 4)
                        }
                        .padding(.horizontal, 25)
                        
                        // Быстрый вход (администратор GidroAtlas)
                        Button(action: {
                            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                authManager.loginAsTestAdmin()
                            }
                        }) {
                            HStack(spacing: 10) {
                                Image(systemName: "slider.horizontal.3")
                                    .font(.title3)
                                Text("Войти как администратор GidroAtlas")
                                    .fontWeight(.semibold)
                                Spacer()
                                Image(systemName: "arrow.right.circle.fill")
                                    .font(.title3)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .padding(.horizontal, 18)
                            .background(
                                LinearGradient(
                                    colors: [
                                        Color(red: 0.92, green: 0.36, blue: 0.62),
                                        Color(red: 0.58, green: 0.26, blue: 0.82)
                                    ],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .foregroundColor(.white)
                            .cornerRadius(14)
                            .shadow(color: Color(red: 0.92, green: 0.36, blue: 0.62).opacity(0.5), radius: 8, y: 4)
                        }
                        .padding(.horizontal, 25)
                        
                        // Разделитель
                        HStack(spacing: 12) {
                            Rectangle()
                                .fill(Color.white.opacity(0.3))
                                .frame(height: 1)
                            Text("или")
                                .foregroundColor(.white.opacity(0.8))
                                .font(.subheadline)
                                .fontWeight(.medium)
                            Rectangle()
                                .fill(Color.white.opacity(0.3))
                                .frame(height: 1)
                        }
                        .padding(.horizontal, 35)
                        
                        // Email
                        HStack(spacing: 10) {
                            Image(systemName: "envelope.fill")
                                .foregroundColor(.white.opacity(0.7))
                                .frame(width: 18)
                            
                            TextField("", text: $email)
                                .keyboardType(.emailAddress)
                                .textInputAutocapitalization(.never)
                                .autocorrectionDisabled()
                                .placeholder(when: email.isEmpty) {
                                    Text("Email").foregroundColor(.white.opacity(0.5))
                                }
                                .foregroundColor(.white)
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .background(Color.white.opacity(0.12))
                        .cornerRadius(12)
                        .padding(.horizontal, 25)
                        
                        // Пароль
                        HStack(spacing: 10) {
                            Image(systemName: "lock.fill")
                                .foregroundColor(.white.opacity(0.7))
                                .frame(width: 18)
                            
                            SecureField("", text: $password)
                                .placeholder(when: password.isEmpty) {
                                    Text("Пароль").foregroundColor(.white.opacity(0.5))
                                }
                                .foregroundColor(.white)
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .background(Color.white.opacity(0.12))
                        .cornerRadius(12)
                        .padding(.horizontal, 25)
                        
                        // Кнопка "Войти" по email/паролю
                        Button(action: loginWithEmail) {
                            HStack {
                                Text("Войти")
                                    .fontWeight(.semibold)
                                Image(systemName: "arrow.right")
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(Color.white.opacity(0.25))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 12)
                                            .stroke(Color.white.opacity(0.4), lineWidth: 1)
                                    )
                            )
                            .foregroundColor(.white)
                        }
                        .padding(.horizontal, 25)
                        
                        // Ошибка
                        if showError {
                            Text(errorMessage)
                                .font(.footnote)
                                .foregroundColor(.yellow)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, 30)
                        }
                        
                        // Регистрация
                        Button(action: {
                            showRegister = true
                        }) {
                            Text("Нет аккаунта? Зарегистрироваться")
                                .font(.footnote)
                                .fontWeight(.medium)
                                .foregroundColor(.white.opacity(0.9))
                        }
                        .padding(.top, 4)
                    }
                    .padding(.bottom, 30)
                }
            }
            .navigationBarHidden(true)
            .sheet(isPresented: $showRegister) {
                RegisterView()
                    .environmentObject(authManager)
            }
            .onAppear {
                isAnimating = true
            }
        }
    }
    
    private func loginWithEmail() {
        guard !email.isEmpty, !password.isEmpty else {
            errorMessage = "Введите email и пароль"
            showError = true
            return
        }
        
        Task {
            let success = await authManager.login(email: email, password: password)
            if !success {
                errorMessage = authManager.errorMessage ?? "Ошибка входа. Попробуйте ещё раз."
                showError = true
            } else {
                showError = false
            }
        }
    }
}

// MARK: - Placeholder модификатор

private extension View {
    func placeholder<Content: View>(
        when shouldShow: Bool,
        alignment: Alignment = .leading,
        @ViewBuilder placeholder: () -> Content
    ) -> some View {
        ZStack(alignment: alignment) {
            if shouldShow {
                placeholder()
            }
            self
        }
    }
}

#Preview {
    LoginView()
        .environmentObject(AuthManager())
}

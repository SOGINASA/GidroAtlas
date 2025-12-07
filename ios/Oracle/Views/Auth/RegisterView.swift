import SwiftUI

struct RegisterView: View {
    @EnvironmentObject var authManager: AuthManager
    @Environment(\.dismiss) var dismiss
    
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var selectedRole: UserRole = .resident
    @State private var showError = false
    @State private var errorMessage = ""
    
    var body: some View {
        NavigationView {
            ZStack {
                // Фон
                LinearGradient(
                    colors: [Color.blue.opacity(0.6), Color.cyan.opacity(0.3)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 20) {
                        // Заголовок
                        VStack(spacing: 10) {
                            Image(systemName: "person.badge.plus")
                                .font(.system(size: 60))
                                .foregroundColor(.white)
                            
                            Text("Регистрация")
                                .font(.system(size: 32, weight: .bold))
                                .foregroundColor(.white)
                        }
                        .padding(.top, 40)
                        .padding(.bottom, 20)
                        
                        // Форма
                        VStack(spacing: 15) {
                            // Имя
                            TextField("Полное имя", text: $name)
                                .padding()
                                .background(Color.white.opacity(0.9))
                                .cornerRadius(10)
                            
                            // Email
                            TextField("Email", text: $email)
                                .textInputAutocapitalization(.never)
                                .keyboardType(.emailAddress)
                                .padding()
                                .background(Color.white.opacity(0.9))
                                .cornerRadius(10)
                            
                            // Пароль
                            SecureField("Пароль", text: $password)
                                .padding()
                                .background(Color.white.opacity(0.9))
                                .cornerRadius(10)
                            
                            // Подтверждение пароля
                            SecureField("Подтвердите пароль", text: $confirmPassword)
                                .padding()
                                .background(Color.white.opacity(0.9))
                                .cornerRadius(10)
                            
                            // Выбор роли
                            VStack(alignment: .leading, spacing: 10) {
                                Text("Тип аккаунта")
                                    .foregroundColor(.white)
                                    .fontWeight(.semibold)
                                
                                Picker("Роль", selection: $selectedRole) {
                                    Text("Гость").tag(UserRole.resident)
                                    Text("Эксперт").tag(UserRole.emergency)
                                }
                                .pickerStyle(SegmentedPickerStyle())
                                .background(Color.white.opacity(0.9))
                                .cornerRadius(10)
                            }
                            
                            // Кнопка регистрации
                            Button(action: register) {
                                Text("Зарегистрироваться")
                                    .fontWeight(.semibold)
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color.green)
                                    .foregroundColor(.white)
                                    .cornerRadius(15)
                            }
                            .padding(.top, 10)
                            
                            // Кнопка отмены
                            Button(action: {
                                dismiss()
                            }) {
                                Text("Уже есть аккаунт? Войти")
                                    .foregroundColor(.white)
                                    .underline()
                            }
                        }
                        .padding(.horizontal)
                        
                        Spacer()
                    }
                }
            }
            .alert("Ошибка", isPresented: $showError) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(errorMessage)
            }
        }
    }
    
    private func register() {
        // Валидация
        guard !name.isEmpty else {
            errorMessage = "Введите имя"
            showError = true
            return
        }
        
        guard !email.isEmpty else {
            errorMessage = "Введите email"
            showError = true
            return
        }
        
        guard password.count >= 6 else {
            errorMessage = "Пароль должен быть не менее 6 символов"
            showError = true
            return
        }
        
        guard password == confirmPassword else {
            errorMessage = "Пароли не совпадают"
            showError = true
            return
        }
        
        // Регистрация
        Task {
            let success = await authManager.register(
                name: name,
                email: email,
                password: password,
                role: selectedRole
            )
            
            if success {
                dismiss()
            } else {
                errorMessage = authManager.errorMessage ?? "Ошибка регистрации. Попробуйте позже"
                showError = true
            }
        }

    }
}

#Preview {
    RegisterView()
        .environmentObject(AuthManager())
}

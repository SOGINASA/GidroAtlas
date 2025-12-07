import Foundation
import SwiftUI

@MainActor
class AuthManager: ObservableObject {
    // MARK: - Published state
    
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    // MARK: - Quick login (debug users)
    
    /// Быстрый вход тестовым жителем
    func loginAsTestResident() {
        isLoading = false
        errorMessage = nil
        
        currentUser = User.testResident
        isAuthenticated = true
        
        // Для локальных тестов токен не нужен
        APIClient.shared.authToken = nil
    }
    
    /// Быстрый вход тестовым сотрудником МЧС
    func loginAsTestEmergency() {
        isLoading = false
        errorMessage = nil
        
        currentUser = User.testEmergency
        isAuthenticated = true
        
        // Для локальных тестов токен не нужен
        APIClient.shared.authToken = nil
    }
    
    /// Быстрый вход тестовым администратором GidroAtlas
    func loginAsTestAdmin() {
        isLoading = false
        errorMessage = nil
        
        // Порядок аргументов подгоняем под твой init User
        // init(id: UUID, name: String, email: String, role: UserRole, phone: String?)
        let admin = User(
            id: UUID(),                          // <-- было String, теперь UUID
            name: "Test Admin",
            email: "admin@gidroatlas.kz",
            role: .admin,
            phone: "+7 777 000 00 00"
        )
        
        currentUser = admin
        isAuthenticated = true
        
        // Для локальных тестов токен не нужен
        APIClient.shared.authToken = nil
    }
    
    // MARK: - Backend auth
    
    /// Обычный вход через бэкенд
    @discardableResult
    func login(email: String, password: String) async -> Bool {
        isLoading = true
        errorMessage = nil
        
        do {
            let (user, token) = try await APIClient.shared.login(email: email, password: password)
            APIClient.shared.authToken = token
            currentUser = user
            isAuthenticated = true
            isLoading = false
            return true
        } catch {
            errorMessage = error.localizedDescription
            isAuthenticated = false
            isLoading = false
            return false
        }
    }
    
    /// Регистрация через бэкенд
    @discardableResult
    func register(name: String, email: String, password: String, role: UserRole) async -> Bool {
        isLoading = true
        errorMessage = nil
        
        do {
            let (user, token) = try await APIClient.shared.register(
                name: name,
                email: email,
                password: password,
                role: role
            )
            APIClient.shared.authToken = token
            currentUser = user
            isAuthenticated = true
            isLoading = false
            return true
        } catch {
            errorMessage = error.localizedDescription
            isAuthenticated = false
            isLoading = false
            return false
        }
    }
    
    // MARK: - Profile
    
    /// Обновление профиля текущего пользователя
    func updateProfile(name: String, phone: String?, address: String?) async {
        do {
            let updated = try await APIClient.shared.updateProfile(
                name: name,
                phone: phone,
                address: address
            )
            currentUser = updated
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    // MARK: - Logout
    
    func logout() {
        currentUser = nil
        isAuthenticated = false
        isLoading = false
        errorMessage = nil
        APIClient.shared.authToken = nil
    }
}

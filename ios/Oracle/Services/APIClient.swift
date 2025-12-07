import Foundation
import CoreLocation

// DTO-модели под формат бэкенда — подправишь под свой JSON
private struct LoginResponseDTO: Decodable {
    let token: String
    let user: UserDTO
}

private struct UserDTO: Decodable {
    let id: String?
    let name: String
    let email: String
    let role: String
    let address: String?
    let phone: String?
}

private struct SensorDTO: Decodable {
    let id: String
    let name: String
    let latitude: Double
    let longitude: Double
    let currentLevel: Double
    let maxLevel: Double
    let status: String
    let lastUpdate: Date
}

private struct NotificationDTO: Decodable {
    let id: String
    let title: String
    let message: String
    let type: String
    let timestamp: Date
    let isRead: Bool
}

enum APIError: Error, LocalizedError {
    case invalidResponse
    case server(String)
    case unauthorized
    
    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "Неверный ответ сервера"
        case .server(let msg):
            return msg
        case .unauthorized:
            return "Неавторизован"
        }
    }
}

final class APIClient {
    static let shared = APIClient()
    
    /// При необходимости измени `/api` на свой префикс
    private let baseURL = URL(string: "https://korolevst.supertest.beast-inside.kz/oracle/api")!
    private let session: URLSession
    
    /// Токен, который мы получаем при логине
    var authToken: String?
    
    private init() {
        let config = URLSessionConfiguration.default
        session = URLSession(configuration: config)
    }
    
    // MARK: - Общая вспомогательная функция
    
    private func makeRequest(
        path: String,
        method: String = "GET",
        body: Encodable? = nil,
        authorized: Bool = false
    ) throws -> URLRequest {
        let url = baseURL.appendingPathComponent(path)
        var request = URLRequest(url: url)
        request.httpMethod = method
        
        if let body = body {
            let encoder = JSONEncoder()
            request.httpBody = try encoder.encode(AnyEncodable(body))
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        
        if authorized, let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        return request
    }
    
    private func perform<T: Decodable>(_ request: URLRequest) async throws -> T {
        let (data, response) = try await session.data(for: request)
        
        guard let http = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        // Подстрой под свои коды/формат ошибок
        switch http.statusCode {
        case 200..<300:
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .iso8601
            return try decoder.decode(T.self, from: data)
        case 401:
            throw APIError.unauthorized
        default:
            let message = String(data: data, encoding: .utf8) ?? "Ошибка \(http.statusCode)"
            throw APIError.server(message)
        }
    }
    
    // MARK: - Auth
    
    struct LoginRequest: Encodable {
        let email: String
        let password: String
    }
    
    struct RegisterRequest: Encodable {
        let name: String
        let email: String
        let password: String
        let role: String
    }
    
    func login(email: String, password: String) async throws -> (User, String) {
        let reqDTO = LoginRequest(email: email, password: password)
        let request = try makeRequest(path: "login", method: "POST", body: reqDTO)
        let dto: LoginResponseDTO = try await perform(request)
        
        let user = dto.user.toDomain()
        return (user, dto.token)
    }
    
    func register(name: String, email: String, password: String, role: UserRole) async throws -> (User, String) {
        let reqDTO = RegisterRequest(
            name: name,
            email: email,
            password: password,
            role: role == .resident ? "resident" : "emergency"
        )
        let request = try makeRequest(path: "register", method: "POST", body: reqDTO)
        let dto: LoginResponseDTO = try await perform(request)
        
        let user = dto.user.toDomain()
        return (user, dto.token)
    }
    
    // MARK: - Sensors
    
    func fetchSensors() async throws -> [Sensor] {
        let request = try makeRequest(path: "sensors", method: "GET", authorized: true)
        let dtos: [SensorDTO] = try await perform(request)
        return dtos.map { $0.toDomain() }
    }
    
    // MARK: - Notifications
    
    func fetchNotifications() async throws -> [Notification] {
        let request = try makeRequest(path: "notifications", method: "GET", authorized: true)
        let dtos: [NotificationDTO] = try await perform(request)
        return dtos.map { $0.toDomain() }
    }
    
    func markNotificationRead(id: UUID) async throws {
        // Пример — измени путь/метод под свой бэкенд
        struct Body: Encodable { let id: UUID }
        let request = try makeRequest(
            path: "notifications/read",
            method: "POST",
            body: Body(id: id),
            authorized: true
        )
        let _: EmptyResponse = try await perform(request)
    }
    
    func markAllNotificationsRead() async throws {
        let request = try makeRequest(
            path: "notifications/read-all",
            method: "POST",
            authorized: true
        )
        let _: EmptyResponse = try await perform(request)
    }
    
    // MARK: - Profile
    
    func updateProfile(name: String, phone: String?, address: String?) async throws -> User {
        struct Body: Encodable {
            let name: String
            let phone: String?
            let address: String?
        }
        let body = Body(name: name, phone: phone, address: address)
        let request = try makeRequest(path: "profile", method: "PUT", body: body, authorized: true)
        let dto: UserDTO = try await perform(request)
        return dto.toDomain()
    }
}

// MARK: - DTO → Domain маппинг

private extension UserDTO {
    func toDomain() -> User {
        User(
            id: UUID(), // если бэкенд шлёт UUID — подставь сюда
            name: name,
            email: email,
            role: role == "emergency" ? .emergency : .resident,
            address: address,
            phone: phone
        )
    }
}

private extension SensorDTO {
    func toDomain() -> Sensor {
        Sensor(
            id: UUID(uuidString: id) ?? UUID(),
            name: name,
            location: CLLocationCoordinate2D(latitude: latitude, longitude: longitude),
            currentLevel: currentLevel,
            maxLevel: maxLevel,
            status: WaterLevel.fromBackend(status),
            lastUpdate: lastUpdate
        )
    }
}

private extension NotificationDTO {
    func toDomain() -> Notification {
        Notification(
            id: UUID(uuidString: id) ?? UUID(),
            title: title,
            message: message,
            type: NotificationType.fromBackend(type),
            timestamp: timestamp,
            isRead: isRead
        )
    }
}

// MARK: - Вспомогательное

private struct AnyEncodable: Encodable {
    private let encodeFunc: (Encoder) throws -> Void
    
    init(_ wrapped: Encodable) {
        self.encodeFunc = wrapped.encode
    }
    
    func encode(to encoder: Encoder) throws {
        try encodeFunc(encoder)
    }
}

private struct EmptyResponse: Decodable {}

private extension WaterLevel {
    static func fromBackend(_ value: String) -> WaterLevel {
        switch value.lowercased() {
        case "safe": return .safe
        case "warning": return .warning
        case "danger": return .danger
        case "critical": return .critical
        default: return .safe
        }
    }
}

private extension NotificationType {
    static func fromBackend(_ value: String) -> NotificationType {
        switch value.lowercased() {
        case "warning": return .warning
        case "danger": return .danger
        case "evacuation": return .evacuation
        default: return .info
        }
    }
}

import Foundation

enum UserRole: String, Codable {
    case resident
    case emergency
}


struct User: Identifiable, Codable {
    let id: UUID
    var name: String
    var email: String
    var role: UserRole
    var address: String?
    var phone: String?
    
    // Тестовый пользователь-житель
    static let testResident = User(
        id: UUID(),
        name: "Иван Петров",
        email: "ivan@test.kz",
        role: .resident,
        address: "ул. Конституции Казахстана, 52",
        phone: "+7 777 123 4567"
    )
    
    // Тестовый пользователь-сотрудник МЧС
    static let testEmergency = User(
        id: UUID(),
        name: "Капитан МЧС Oracle",
        email: "mchs@test.kz",
        role: .emergency,
        address: "Штаб МЧС, Петропавловск",
        phone: "+7 777 000 1122"
    )
}

import Foundation
import MapKit

final class WaterObjectStore: ObservableObject {
    @Published var objects: [WaterObject]

    init() {
        self.objects = WaterObjectStore.makeMockData()
    }

    // Сейчас мок-данные, потом заменишь на загрузку с API
    private static func makeMockData() -> [WaterObject] {
        func d(_ y: Int, _ m: Int, _ day: Int) -> Date {
            var c = DateComponents()
            c.year = y; c.month = m; c.day = day
            return Calendar.current.date(from: c) ?? Date()
        }

        return [
            WaterObject(
                id: UUID(),
                name: "Северо-Казахстанское водохранилище",
                region: "Северо-Казахстанская область",
                resourceType: .reservoir,
                waterType: .fresh,
                hasFauna: true,
                passportDate: d(2015, 6, 12),
                technicalCondition: 3,
                coordinate: CLLocationCoordinate2D(latitude: 54.9, longitude: 69.15),
                passportURL: nil
            ),
            WaterObject(
                id: UUID(),
                name: "Река Ишим (участок Петропавловск)",
                region: "Северо-Казахстанская область",
                resourceType: .canal,
                waterType: .fresh,
                hasFauna: true,
                passportDate: d(2012, 4, 1),
                technicalCondition: 4,
                coordinate: CLLocationCoordinate2D(latitude: 54.88, longitude: 69.16),
                passportURL: nil
            ),
            WaterObject(
                id: UUID(),
                name: "Серебрянское водохранилище",
                region: "Восточно-Казахстанская область",
                resourceType: .reservoir,
                waterType: .fresh,
                hasFauna: true,
                passportDate: d(2008, 9, 18),
                technicalCondition: 5,
                coordinate: CLLocationCoordinate2D(latitude: 49.7, longitude: 83.0),
                passportURL: nil
            ),
            WaterObject(
                id: UUID(),
                name: "Аральское море (северная часть)",
                region: "Кызылординская область",
                resourceType: .lake,
                waterType: .nonFresh,
                hasFauna: false,
                passportDate: d(2010, 3, 5),
                technicalCondition: 5,
                coordinate: CLLocationCoordinate2D(latitude: 46.5, longitude: 61.0),
                passportURL: nil
            ),
            WaterObject(
                id: UUID(),
                name: "Канал Иртыш–Караганда (участок-1)",
                region: "Карагандинская область",
                resourceType: .canal,
                waterType: .fresh,
                hasFauna: false,
                passportDate: d(2018, 11, 20),
                technicalCondition: 2,
                coordinate: CLLocationCoordinate2D(latitude: 49.7, longitude: 73.1),
                passportURL: nil
            ),
            WaterObject(
                id: UUID(),
                name: "Балхаш",
                region: "Жетысуская область",
                resourceType: .lake,
                waterType: .nonFresh,
                hasFauna: true,
                passportDate: d(2016, 7, 30),
                technicalCondition: 3,
                coordinate: CLLocationCoordinate2D(latitude: 46.1, longitude: 74.2),
                passportURL: nil
            )
        ]
    }
}

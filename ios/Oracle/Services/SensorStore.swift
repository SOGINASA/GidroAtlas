import Foundation

@MainActor
final class SensorStore: ObservableObject {
    @Published var sensors: [Sensor] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    func loadSensors(force: Bool = false) async {
        if !force, !sensors.isEmpty { return }
        
        isLoading = true
        errorMessage = nil
        
        do {
            let result = try await APIClient.shared.fetchSensors()
            self.sensors = result
        } catch {
            self.errorMessage = error.localizedDescription
        }
        
        isLoading = false
    }
}

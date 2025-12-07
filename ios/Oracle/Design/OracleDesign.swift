import SwiftUI

// MARK: - Дизайн-система Oracle

struct OracleDesign {
    
    // MARK: - Цвета
    struct Colors {
        // Основные цвета
        static let primary = Color(red: 0.1, green: 0.4, blue: 0.7)
        static let secondary = Color(red: 0.0, green: 0.6, blue: 0.8)
        static let accent = Color.cyan
        
        // Водная тематика
        static let waterBlue = Color(red: 0.2, green: 0.5, blue: 0.8)
        static let waterCyan = Color(red: 0.3, green: 0.7, blue: 0.9)
        static let deepWater = Color(red: 0.05, green: 0.3, blue: 0.6)
        
        // Статусы
        static let safe = Color.green
        static let warning = Color.orange
        static let danger = Color.red.opacity(0.9)
        static let critical = Color.red
        
        // Фоны
        static let backgroundLight = Color(red: 0.95, green: 0.97, blue: 1.0)
        static let backgroundGradient1 = Color(red: 0.9, green: 0.95, blue: 0.98)
        static let cardBackground = Color.white
        
        // Градиенты
        static func primaryGradient() -> LinearGradient {
            LinearGradient(
                colors: [primary, secondary],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
        
        static func waterGradient() -> LinearGradient {
            LinearGradient(
                colors: [waterBlue, waterCyan],
                startPoint: .top,
                endPoint: .bottom
            )
        }
        
        static func statusGradient(for status: WaterLevel) -> LinearGradient {
            switch status {
            case .safe:
                return LinearGradient(
                    colors: [Color.green, Color.green.opacity(0.7)],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            case .warning:
                return LinearGradient(
                    colors: [Color.orange, Color.yellow],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            case .danger:
                return LinearGradient(
                    colors: [Color.orange, Color.red.opacity(0.8)],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            case .critical:
                return LinearGradient(
                    colors: [Color.red, Color.red.opacity(0.7)],
                    startPoint: .leading,
                    endPoint: .trailing
                )
            }
        }
    }
    
    // MARK: - Радиусы скругления
    struct Radius {
        static let small: CGFloat = 8
        static let medium: CGFloat = 12
        static let large: CGFloat = 16
        static let extraLarge: CGFloat = 20
        static let round: CGFloat = 100
    }
    
    // MARK: - Тени
    struct Shadows {
        static func light() -> some View {
            EmptyView()
                .shadow(color: .black.opacity(0.05), radius: 5, y: 2)
        }
        
        static func medium() -> some View {
            EmptyView()
                .shadow(color: .black.opacity(0.08), radius: 10, y: 5)
        }
        
        static func strong() -> some View {
            EmptyView()
                .shadow(color: .black.opacity(0.12), radius: 15, y: 8)
        }
        
        static func colored(_ color: Color) -> some View {
            EmptyView()
                .shadow(color: color.opacity(0.3), radius: 10, y: 5)
        }
    }
    
    // MARK: - Анимации
    struct Animations {
        static let quick = Animation.easeInOut(duration: 0.2)
        static let standard = Animation.easeInOut(duration: 0.3)
        static let slow = Animation.easeInOut(duration: 0.5)
        
        static let spring = Animation.spring(response: 0.4, dampingFraction: 0.7)
        static let springBouncy = Animation.spring(response: 0.6, dampingFraction: 0.6)
        
        static let pulse = Animation
            .easeInOut(duration: 1.5)
            .repeatForever(autoreverses: true)
        
        static let wave = Animation
            .linear(duration: 8.0)
            .repeatForever(autoreverses: false)
    }
    
    // MARK: - Размеры
    struct Spacing {
        static let tiny: CGFloat = 4
        static let small: CGFloat = 8
        static let medium: CGFloat = 12
        static let standard: CGFloat = 16
        static let large: CGFloat = 20
        static let extraLarge: CGFloat = 24
        static let huge: CGFloat = 32
    }
    
    struct Sizes {
        static let iconSmall: CGFloat = 20
        static let iconMedium: CGFloat = 24
        static let iconLarge: CGFloat = 32
        static let iconHuge: CGFloat = 48
        
        static let buttonHeight: CGFloat = 50
        static let cardHeight: CGFloat = 120
    }
    
    // MARK: - Типография
    struct Typography {
        static func largeTitle() -> Font {
            .system(size: 34, weight: .bold, design: .rounded)
        }
        
        static func title1() -> Font {
            .system(size: 28, weight: .bold, design: .rounded)
        }
        
        static func title2() -> Font {
            .system(size: 22, weight: .semibold, design: .rounded)
        }
        
        static func headline() -> Font {
            .system(size: 17, weight: .semibold)
        }
        
        static func body() -> Font {
            .system(size: 17, weight: .regular)
        }
        
        static func caption() -> Font {
            .system(size: 12, weight: .regular)
        }
    }
}

// MARK: - Модификаторы

extension View {
    // Карточка
    func oracleCard() -> some View {
        self
            .background(OracleDesign.Colors.cardBackground)
            .cornerRadius(OracleDesign.Radius.large)
            .shadow(color: .black.opacity(0.08), radius: 10, y: 5)
    }
    
    // Glassmorphism эффект
    func glassCard() -> some View {
        self
            .background(
                RoundedRectangle(cornerRadius: OracleDesign.Radius.large)
                    .fill(Color.white.opacity(0.2))
                    .background(
                        RoundedRectangle(cornerRadius: OracleDesign.Radius.large)
                            .fill(.ultraThinMaterial)
                    )
            )
            .overlay(
                RoundedRectangle(cornerRadius: OracleDesign.Radius.large)
                    .stroke(Color.white.opacity(0.3), lineWidth: 1)
            )
    }
    
    // Кнопка с градиентом
    func gradientButton(colors: [Color]) -> some View {
        self
            .padding(.vertical, 16)
            .padding(.horizontal, 20)
            .background(
                LinearGradient(
                    colors: colors,
                    startPoint: .leading,
                    endPoint: .trailing
                )
            )
            .foregroundColor(.white)
            .cornerRadius(OracleDesign.Radius.medium)
    }
}

// MARK: - Компоненты для переиспользования

struct OracleLogoView: View {
    var size: CGFloat = 32
    var showText: Bool = true
    
    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: "water.waves.circle.fill")
                .font(.system(size: size))
                .foregroundStyle(OracleDesign.Colors.primaryGradient())
            
            if showText {
                Text("Oracle")
                    .font(.system(size: size * 0.7, weight: .bold, design: .rounded))
                    .foregroundColor(OracleDesign.Colors.primary)
            }
        }
    }
}

struct PulsingCircle: View {
    let color: Color
    let size: CGFloat
    @State private var isPulsing = false
    
    var body: some View {
        ZStack {
            Circle()
                .fill(color.opacity(0.2))
                .frame(width: size, height: size)
            
            Circle()
                .fill(color)
                .frame(width: size * 0.3, height: size * 0.3)
            
            Circle()
                .stroke(color, lineWidth: 2)
                .frame(width: size * 0.6, height: size * 0.6)
                .scaleEffect(isPulsing ? 1.2 : 1.0)
                .opacity(isPulsing ? 0 : 1)
        }
        .onAppear {
            withAnimation(OracleDesign.Animations.pulse) {
                isPulsing = true
            }
        }
    }
}

#Preview {
    VStack(spacing: 20) {
        OracleLogoView(size: 48)
        
        Text("Oracle Design System")
            .font(OracleDesign.Typography.title1())
        
        HStack {
            PulsingCircle(color: .green, size: 50)
            PulsingCircle(color: .orange, size: 50)
            PulsingCircle(color: .red, size: 50)
        }
    }
    .padding()
}

//
//  ContentView.swift
//  TPPC Watch Watch App
//

import SwiftUI
import Combine

// MARK: - Day

enum ChukkaDay: String, CaseIterable, Identifiable {
    case wed, thu, sat, sun

    var id: String { rawValue }

    var label: String {
        switch self {
        case .wed: return "Wed"
        case .thu: return "Thu"
        case .sat: return "Sat"
        case .sun: return "Sun"
        }
    }

    var fullLabel: String {
        switch self {
        case .wed: return "Wednesday"
        case .thu: return "Thursday"
        case .sat: return "Saturday"
        case .sun: return "Sunday"
        }
    }

    var scheduleKey: String { self == .wed ? "schedule" : "schedule-\(rawValue)" }
    var rosterKey: String { self == .wed ? "roster" : "roster-\(rawValue)" }

    static func upcoming() -> ChukkaDay {
        switch Calendar.current.component(.weekday, from: Date()) {
        case 1:    return .sun
        case 5:    return .thu
        case 6, 7: return .sat
        default:   return .wed
        }
    }
}

// MARK: - Models (match the JSON the web app stores)

struct Player: Codable, Identifiable {
    var id = UUID()
    let name: String
    let handicap: Int?

    enum CodingKeys: String, CodingKey { case name, handicap }

    var display: String {
        if let handicap { return "\(name)  (\(handicap))" }
        return name
    }
}

struct Chukka: Codable, Identifiable {
    let number: Int
    let time: String
    let teamA: [Player]
    let teamB: [Player]

    var id: Int { number }
}

struct Schedule: Codable {
    let chukkas: [Chukka]
}

// MARK: - Firestore REST envelope

private struct FirestoreDocument: Decodable {
    let fields: Fields?
    struct Fields: Decodable { let value: StringValue? }
    struct StringValue: Decodable { let stringValue: String? }
}

// MARK: - Data store (Firestore REST API — no SDK needed)

enum LoadState {
    case loading
    case schedule(Schedule)
    case roster([Player])
    case empty
    case error(String)
}

@MainActor
final class ChukkaStore: ObservableObject {
    @Published var state: LoadState

    private let projectID = "tedworth-park-polo"
    private let apiKey = "AIzaSyBEPZpBeZLmUQdtzGCY7UCIwnGzP8f1xpQ"

    init() {
        state = .loading
    }

    func load(day: ChukkaDay) {
        state = .loading
        Task { await fetch(day: day) }
    }

    private func fetch(day: ChukkaDay) async {
        do {
            if let schedule = try await getDocument(Schedule.self, key: day.scheduleKey),
               !schedule.chukkas.isEmpty {
                state = .schedule(schedule)
                return
            }
            if let players = try await getDocument([Player].self, key: day.rosterKey),
               !players.isEmpty {
                state = .roster(players)
                return
            }
            state = .empty
        } catch {
            state = .error("No connection")
        }
    }

    private func getDocument<T: Decodable>(_ type: T.Type, key: String) async throws -> T? {
        let path = "https://firestore.googleapis.com/v1/projects/\(projectID)/databases/(default)/documents/shared/\(key)?key=\(apiKey)"
        guard let url = URL(string: path) else { return nil }

        let (data, response) = try await URLSession.shared.data(from: url)
        guard let http = response as? HTTPURLResponse else { return nil }
        if http.statusCode == 404 { return nil }
        guard http.statusCode == 200 else { return nil }

        let document = try JSONDecoder().decode(FirestoreDocument.self, from: data)
        guard let inner = document.fields?.value?.stringValue,
              let innerData = inner.data(using: .utf8) else { return nil }
        return try JSONDecoder().decode(T.self, from: innerData)
    }
}

// MARK: - Root view

struct ContentView: View {
    @StateObject private var store = ChukkaStore()
    @State private var day: ChukkaDay = ChukkaDay.upcoming()
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        NavigationStack {
            VStack(spacing: 5) {
                DayPicker(day: $day)
                ScrollView { content }
            }
            .navigationTitle("Chukkas")
        }
        .onChange(of: scenePhase, initial: true) {
            if scenePhase == .active { store.load(day: day) }
        }
        .onChange(of: day) { store.load(day: day) }
    }

    @ViewBuilder
    private var content: some View {
        switch store.state {
        case .loading:
            ProgressView().padding(.top, 24)
        case .error(let message):
            MessageView(title: "Couldn't load", detail: message)
        case .empty:
            MessageView(title: "Nothing booked",
                        detail: "No one is on the \(day.fullLabel) roster yet.")
        case .roster(let players):
            RosterView(players: players, day: day)
        case .schedule(let schedule):
            VStack(spacing: 6) {
                ForEach(schedule.chukkas) { ChukkaCard(chukka: $0) }
            }
            .padding(.horizontal, 4)
            .padding(.bottom, 8)
        }
    }
}

// MARK: - Day picker

struct DayPicker: View {
    @Binding var day: ChukkaDay
    private let burgundy = Color(red: 0.42, green: 0.12, blue: 0.16)

    var body: some View {
        HStack(spacing: 3) {
            ForEach(ChukkaDay.allCases) { option in
                Button {
                    day = option
                } label: {
                    Text(option.label)
                        .font(.system(size: 12, weight: .semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 4)
                }
                .buttonStyle(.plain)
                .background(day == option ? burgundy : Color.gray.opacity(0.25))
                .foregroundColor(day == option ? .white : .gray)
                .clipShape(RoundedRectangle(cornerRadius: 6))
            }
        }
        .padding(.horizontal, 4)
    }
}

// MARK: - Chukka card

struct ChukkaCard: View {
    let chukka: Chukka

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text("Chukka \(chukka.number)")
                    .font(.system(size: 14, weight: .bold))
                Spacer()
                Text(chukka.time)
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
            }
            TeamRow(label: "Blue", players: chukka.teamA, color: .blue)
            TeamRow(label: "White", players: chukka.teamB, color: .white)
        }
        .padding(8)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.gray.opacity(0.18))
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}

struct TeamRow: View {
    let label: String
    let players: [Player]
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 1) {
            HStack(spacing: 4) {
                Circle()
                    .fill(color)
                    .frame(width: 7, height: 7)
                Text(label)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(color)
            }
            if players.isEmpty {
                Text("—").font(.system(size: 12)).foregroundColor(.secondary)
            } else {
                ForEach(players) { player in
                    Text(player.display).font(.system(size: 12))
                }
            }
        }
    }
}

// MARK: - Roster fallback

struct RosterView: View {
    let players: [Player]
    let day: ChukkaDay

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text("Draw not published yet")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.orange)
            Text("\(players.count) booked for \(day.fullLabel):")
                .font(.system(size: 11))
                .foregroundColor(.secondary)
            ForEach(players) { player in
                Text(player.display).font(.system(size: 13))
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 8)
        .padding(.bottom, 8)
    }
}

// MARK: - Message view

struct MessageView: View {
    let title: String
    let detail: String

    var body: some View {
        VStack(spacing: 6) {
            Text(title).font(.system(size: 14, weight: .semibold))
            Text(detail)
                .font(.system(size: 12))
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding()
        .padding(.top, 12)
    }
}
